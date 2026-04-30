const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("portfolio page contains core positioning and project links", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const js = fs.readFileSync("script.js", "utf8");

  assert.match(html, /AI Specialist/);
  assert.match(html, /Full-Stack Developer/);
  assert.match(html, /Digital Media Strategist/);
  assert.match(js, /AI Campaign Orchestrator/);
  assert.match(js, /https:\/\/abdulazizbalu.github.io\/ai-campaign-orchestrator\//);
});

