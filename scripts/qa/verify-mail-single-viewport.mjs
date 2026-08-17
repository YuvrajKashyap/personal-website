import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.env.MAIL_QA_BASE_URL ?? "http://localhost:3100";
const captureDir = process.env.MAIL_QA_CAPTURE_DIR;
const optionalLocalVercelScript = /^404 http:\/\/localhost:\d+\/_vercel\/(?:insights|speed-insights)\/script\.js$/;
const fallbackPlaywrightUrl =
  "file:///C:/Users/ykyuv/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return import(process.env.PLAYWRIGHT_MODULE_URL ?? fallbackPlaywrightUrl);
  }
}

async function assertInsideViewport(locator, label, viewport) {
  await assert.doesNotReject(() => locator.waitFor({ state: "visible" }), `${label} is visible`);
  const box = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement;
    return {
      y: rect.y,
      height: rect.height,
      display: getComputedStyle(element).display,
      visibility: getComputedStyle(element).visibility,
      parentDisplay: parent ? getComputedStyle(parent).display : null,
      parentHeight: parent?.getBoundingClientRect().height ?? null,
    };
  });
  assert.ok(box.height > 0, `${label} has a rendered box (${JSON.stringify(box)})`);
  assert.ok(box.y >= -1, `${label} begins inside the viewport (y=${box.y})`);
  assert.ok(
    box.y + box.height <= viewport.height + 1,
    `${label} ends inside the viewport (bottom=${box.y + box.height}, height=${viewport.height})`,
  );
}

async function assertNoVerticalScroll(page, viewport) {
  const dimensions = await page.evaluate(() => ({
    body: document.body.scrollHeight,
    document: document.documentElement.scrollHeight,
  }));
  assert.ok(
    Math.max(dimensions.body, dimensions.document) <= viewport.height + 1,
    `mail page has no vertical scroll (${JSON.stringify(dimensions)}, viewport=${viewport.height})`,
  );
}

async function capture(page, name) {
  if (!captureDir) return;
  await mkdir(captureDir, { recursive: true });
  await page.screenshot({ path: join(captureDir, `${name}.png`), fullPage: false });
}

async function assertHealthyPage(page) {
  const overlays = await page
    .locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")
    .evaluateAll((elements) =>
      elements.map((element) => ({
        text: element.textContent?.trim().slice(0, 5000),
        html: element.outerHTML.slice(0, 1000),
      })),
    );
  assert.equal(
    overlays.length,
    0,
    `mail page has no framework error overlay (${JSON.stringify(overlays)})`,
  );
  assert.ok((await page.locator("body").innerText()).trim().length > 0, "mail page is not blank");
}

async function presentLetter(page) {
  const seal = page.locator('button[aria-label="Break the wax seal and open the letter"]');
  if (await seal.count()) await seal.click({ force: true });
  await page.locator('[data-phase="presented"]').waitFor({ state: "attached" });
}

async function getEnvelopeBox(page) {
  return page.evaluate(() => {
    const envelope = [...document.querySelectorAll("div")].find((element) =>
      [...element.classList].some((name) => /(?:^|__)envelope(?:$|_)/.test(name)),
    );
    const rect = envelope?.getBoundingClientRect();
    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
  });
}

async function getSealedLetterBox(page) {
  return page.evaluate(() => {
    const letter = [...document.querySelectorAll("div")].find((element) =>
      [...element.classList].some((name) => /(?:^|__)letter(?:$|_)/.test(name)),
    );
    const rect = letter?.getBoundingClientRect();
    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
  });
}

async function assertDesktopComposition(page, viewport) {
  const title = await page.getByRole("heading", { name: "Yuv Got Mail" }).boundingBox();
  const intro = await page.locator('[id="mail-manifest-panel"] > div').first().boundingBox();
  const letter = await page.locator("#mail-letter-panel").boundingBox();
  const manifest = page.locator('section[aria-label="What to expect"]');
  const manifestBox = await manifest.boundingBox();
  const envelope = await getEnvelopeBox(page);
  const sealedLetter = await getSealedLetterBox(page);
  const notes = await manifest.locator("article").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }),
  );
  const signoffBox = await page
    .getByText("Posted from the desk of Yuvraj Kashyap", { exact: false })
    .boundingBox();

  assert.ok(title && intro && letter && manifestBox && envelope && sealedLetter && signoffBox, "desktop composition has measurable regions");
  assert.ok(
    letter.x + letter.width / 2 > title.x + title.width / 2,
    "the envelope is centered to the right of Yuv Got Mail",
  );
  assert.ok(
    manifestBox.y >= viewport.height * 0.62,
    `the Manifest row stays at the bottom of the page (y=${manifestBox.y})`,
  );
  assert.ok(
    manifestBox.width >= Math.min(viewport.width * 0.72, 1000),
    `the Manifest row spans the bottom of the page (width=${manifestBox.width})`,
  );
  assert.ok(manifestBox.width <= 1120, `the Manifest row stays intentionally narrow (width=${manifestBox.width})`);
  assert.equal(notes.length, 3, "all three Manifest cards render");
  assert.ok(
    Math.max(...notes.map((note) => note.y)) - Math.min(...notes.map((note) => note.y)) <= 2,
    "the three Manifest cards share one bottom row",
  );
  assert.ok(notes[0].x < notes[1].x && notes[1].x < notes[2].x, "Manifest cards run left to right");
  assert.ok(notes.every((note) => note.width <= 350), `Manifest cards stay narrow (${notes.map((note) => note.width).join(", ")})`);
  const noteBottom = Math.max(...notes.map((note) => note.y + note.height));
  assert.ok(signoffBox.y - noteBottom >= 30, `the signoff has breathing room (${signoffBox.y - noteBottom}px)`);
  assert.ok(envelope.height >= 339, `the desktop envelope is visibly large (${envelope.height}px)`);
  assert.ok(
    sealedLetter.y >= envelope.y - 1 &&
      sealedLetter.y + sealedLetter.height <= envelope.y + envelope.height + 1,
    `the sealed white letter stays fully inside the envelope (${JSON.stringify({ sealedLetter, envelope })})`,
  );
  assert.ok(
    envelope.y + envelope.height <= manifestBox.y - 8,
    `the envelope clears the Manifest row instead of hanging low (envelope bottom=${envelope.y + envelope.height}, Manifest y=${manifestBox.y})`,
  );
  const introCenter = intro.y + intro.height / 2;
  const envelopeCenter = envelope.y + envelope.height / 2;
  assert.ok(
    Math.abs(envelopeCenter - introCenter) <= 125,
    `the envelope is vertically centered with the intro (difference=${Math.abs(envelopeCenter - introCenter)}px)`,
  );
}

async function verifyDesktop(browser, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      browserErrors.push(message.text());
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) browserErrors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(`${baseUrl}/mail`, { waitUntil: "domcontentloaded" });
  await page.locator("main").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  await assertHealthyPage(page);
  await assertNoVerticalScroll(page, viewport);
  for (const title of ["what shows up", "when it shows up", "how do I get it?"]) {
    await assertInsideViewport(page.getByRole("heading", { name: title }), title, viewport);
  }
  await assertDesktopComposition(page, viewport);
  await assertInsideViewport(
    page.getByText("Posted from the desk of Yuvraj Kashyap", { exact: false }),
    "mail signoff",
    viewport,
  );

  const envelopeBox = await getEnvelopeBox(page);
  assert.ok(envelopeBox && envelopeBox.height >= 339, `desktop envelope keeps its full size (${envelopeBox?.height ?? 0}px)`);
  await capture(page, `mail-${viewport.width}x${viewport.height}-sealed-dark`);
  await presentLetter(page);
  await assertInsideViewport(page.locator("form").first(), "signup form", viewport);
  await capture(page, `mail-${viewport.width}x${viewport.height}-dark`);
  if (viewport.width === 1440) {
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await page.waitForTimeout(350);
    await capture(page, `mail-${viewport.width}x${viewport.height}-light`);
  }
  const actionableErrors = browserErrors.filter((error) => !optionalLocalVercelScript.test(error));
  assert.deepEqual(actionableErrors, [], `desktop browser console stays clean (${actionableErrors.join(" | ")})`);
  await context.close();
}

async function verifyMobile(browser, viewport) {
  const context = await browser.newContext({
    viewport,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      browserErrors.push(message.text());
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) browserErrors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(`${baseUrl}/mail`, { waitUntil: "domcontentloaded" });
  await page.locator("main").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  await assertHealthyPage(page);
  await assertNoVerticalScroll(page, viewport);
  const letterTab = page.getByRole("tab", { name: "Letter" });
  const manifestTab = page.getByRole("tab", { name: "Manifest" });
  await assertInsideViewport(letterTab, "Letter tab", viewport);
  await assertInsideViewport(manifestTab, "Manifest tab", viewport);
  const tabHeights = await Promise.all([letterTab, manifestTab].map((tab) => tab.evaluate((element) => element.getBoundingClientRect().height)));
  assert.ok(tabHeights.every((height) => height >= 44), `mobile tabs keep 44px touch targets (${tabHeights.join(", ")})`);
  assert.equal(await letterTab.getAttribute("aria-selected"), "true");
  await assertInsideViewport(page.locator("form").first(), "mobile signup form", viewport);

  const envelopeBox = await getEnvelopeBox(page);
  assert.ok(envelopeBox && envelopeBox.height >= 199, `mobile envelope keeps its full size (${envelopeBox?.height ?? 0}px)`);
  await presentLetter(page);
  await capture(page, `mail-${viewport.width}x${viewport.height}-letter-dark`);

  await manifestTab.click();
  await page.waitForTimeout(350);
  assert.equal(await manifestTab.getAttribute("aria-selected"), "true");
  for (const title of ["what shows up", "when it shows up", "how do I get it?"]) {
    await assertInsideViewport(page.getByRole("heading", { name: title }), title, viewport);
  }
  await assertInsideViewport(
    page.getByText("Posted from the desk of Yuvraj Kashyap", { exact: false }),
    "mobile mail signoff",
    viewport,
  );
  await assertNoVerticalScroll(page, viewport);
  await capture(page, `mail-${viewport.width}x${viewport.height}-manifest-dark`);

  if (viewport.width === 390) {
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await page.waitForTimeout(350);
    await capture(page, `mail-${viewport.width}x${viewport.height}-manifest-light`);
  }

  await letterTab.click();
  assert.equal(await letterTab.getAttribute("aria-selected"), "true");
  await assertInsideViewport(page.locator("form").first(), "restored mobile signup form", viewport);
  const actionableErrors = browserErrors.filter((error) => !optionalLocalVercelScript.test(error));
  assert.deepEqual(actionableErrors, [], `mobile browser console stays clean (${actionableErrors.join(" | ")})`);
  await context.close();
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

try {
  await verifyDesktop(browser, { width: 1440, height: 900 });
  await verifyDesktop(browser, { width: 1366, height: 768 });
  await verifyDesktop(browser, { width: 1920, height: 1080 });
  await verifyMobile(browser, { width: 1024, height: 768 });
  await verifyMobile(browser, { width: 768, height: 1024 });
  await verifyMobile(browser, { width: 390, height: 844 });
  await verifyMobile(browser, { width: 375, height: 667 });
  console.log("Mail single-viewport QA passed.");
} finally {
  await browser.close();
}
