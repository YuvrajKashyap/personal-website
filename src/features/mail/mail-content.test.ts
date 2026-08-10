import assert from "node:assert/strict";
import test from "node:test";

const mailContentModuleUrl = new URL("./mail-content.ts", import.meta.url).href;
const { mailPageContent } = await import(mailContentModuleUrl);

test("mail page presents the agreed newsletter promise", () => {
  assert.equal(mailPageContent.title, "Yuv Got Mail");
  assert.equal(
    mailPageContent.tagline,
    "A weekly letter about whatever has my attention.",
  );
  assert.equal(
    mailPageContent.description,
    "Ideas, updates, discoveries, and occasional rabbit holes.",
  );
});

test("mail page keeps the schedule flexible and the signup honest", () => {
  assert.match(mailPageContent.scheduleNote, /no promised day/i);
  assert.match(mailPageContent.privacyNote, /unsubscribe/i);
  assert.equal(mailPageContent.formId, "9783767");
  assert.equal(mailPageContent.formUid, "984ceb5f60");
});
