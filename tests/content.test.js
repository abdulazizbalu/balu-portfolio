const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("script.js", "utf8");

test("positioning is present", () => {
  assert.match(html, /AI Specialist/);
  assert.match(html, /Full-Stack Developer/);
  assert.match(html, /Digital Media Strategist/);
});

test("flagship open-source projects are linked", () => {
  for (const repo of ["cobol-equiv", "pricing-crosscheck", "quasar-solver", "nur", "ai-eval-lab"]) {
    assert.match(html, new RegExp(`https://github.com/abdulazizbalu/${repo}`));
  }
  assert.match(html, /https:\/\/abdulazizbalu.github.io\/ai-campaign-orchestrator\//);
});

test("client work stays anonymous", () => {
  assert.match(html, /--nda/);
  for (const banned of [/corpadvisor/i, /kadrovik/i, /top ?advisor/i, /lexadvisor/i, /norma/i]) {
    assert.doesNotMatch(html, banned);
  }
});

test("contact uses Telegram and external links are safe", () => {
  assert.match(html, /https:\/\/t.me\/Abdulaziz6301/);
  const blank = html.match(/target="_blank"[^>]*>/g) || [];
  for (const tag of blank) assert.match(tag, /rel="noopener"/);
  assert.match(js, /sudo/);
});

test("no em dashes in copy", () => {
  assert.doesNotMatch(html, /—/);
});
