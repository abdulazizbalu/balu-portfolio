const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (p) => fs.readFileSync(p, "utf8");
const cases = fs.readdirSync("work").filter((d) => fs.existsSync(path.join("work", d, "index.html")));
const pages = ["index.html", "ru/index.html", "404.html", ...cases.map((d) => `work/${d}/index.html`)];
const home = read("index.html");
const ru = read("ru/index.html");

test("positioning is present", () => {
  assert.match(home, /AI Specialist/);
  assert.match(home, /Full-Stack Developer/);
  assert.match(home, /Digital Media Strategist/);
  assert.match(home, /<h1[^>]*>[\s\S]*Abdulaziz Abdujalilov/);
});

test("flagship open-source projects are linked", () => {
  for (const repo of ["cobol-equiv", "pricing-crosscheck", "quasar-solver", "nur", "ai-eval-lab"]) {
    assert.match(home, new RegExp(`https://github.com/abdulazizbalu/${repo}`));
  }
});

test("case study pages exist", () => {
  assert.ok(cases.length >= 8, `only ${cases.length} case pages`);
  for (const slug of ["cobol-equiv", "pricing-crosscheck", "quasar-solver", "nur"]) assert.ok(cases.includes(slug), slug);
});

test("every page has SEO basics", () => {
  for (const p of pages) {
    const html = read(p);
    assert.match(html, /<title>[^<]{10,}<\/title>/, `${p}: title`);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/, `${p}: description`);
    if (p !== "404.html") {
      assert.match(html, /<link rel="canonical" href="https:\/\//, `${p}: canonical`);
      assert.match(html, /application\/ld\+json/, `${p}: json-ld`);
    }
  }
  assert.match(home, /hreflang="ru"/);
  assert.match(ru, /<html lang="ru"/);
});

test("sitemap lists every indexable page", () => {
  const sm = read("sitemap.xml");
  assert.match(sm, /\/ru\//);
  for (const d of cases) assert.match(sm, new RegExp(`/work/${d}/`), d);
  assert.match(read("robots.txt"), /Sitemap: https:\/\//);
});

test("client work stays anonymous", () => {
  assert.match(home, /--nda/);
  const all = pages.map(read).join("\n") + read("assets/os.js") + read("assets/main.js");
  for (const banned of [/corpadvisor/i, /kadrovik/i, /top ?advisor/i, /lexadvisor/i, /norma\b/i, /buxgalter/i]) {
    assert.doesNotMatch(all, banned);
  }
});

test("contact uses Telegram and external links are safe", () => {
  for (const p of pages) {
    const html = read(p);
    const blank = html.match(/target="_blank"[^>]*>/g) || [];
    for (const tag of blank) assert.match(tag, /rel="noopener/, `${p}: ${tag}`);
  }
  assert.match(home, /https:\/\/t.me\/Abdulaziz6301/);
  assert.match(read("assets/main.js"), /sudo/);
});

test("no em dashes in copy", () => {
  for (const p of pages) assert.doesNotMatch(read(p), /—/, p);
  assert.doesNotMatch(read("assets/os.js"), /—/);
});
