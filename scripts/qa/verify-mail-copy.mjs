import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const mailContent = await readFile("src/features/mail/mail-content.ts", "utf8");
const mailPage = await readFile("src/features/mail/MailPage.tsx", "utf8");

assert.match(
  mailContent,
  /i wanna make it as valuable as possible for you/,
  "relationship note uses the approved wording",
);
assert.match(mailPage, /title="how do I get it\?"/, "manifest uses the updated question");
for (const step of [
  "sign up",
  "get a confirmation email",
  "you're in, you'll get letters as they come out",
]) {
  assert.match(mailContent, new RegExp(step), `enrollment step is present: ${step}`);
}

console.log("Mail copy verification passed.");
