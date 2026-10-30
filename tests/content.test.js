const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (p) => fs.readFileSync(p, "utf8");
const cases = fs.readdirSync("work").filter((d) => fs.existsSync(path.join("work", d, "index.html")));
const svc = fs.existsSync("services") ? fs.readdirSync("services") : [];
const pages = ["index.html", "ru/index.html", "404.html", ...cases.map((d) => `work/${d}/index.html`),
  ...svc.map((d) => `services/${d}/index.html`), ...svc.map((d) => `ru/services/${d}/index.html`)];
const home = read("index.html");
const ru = read("ru/index.html");

test("positioning is present", () => {
  assert.match(home, /AI Specialist/);
  assert.match(home, /Full-Stack Developer/);
  assert.match(home, /Digital Media Strategist/);
  assert.match(home, /<h1[^>]*>[\s\S]*Abdulaziz Abdujalilov[\s\S]*full.stack developer in Tashkent/);
});

test("flagship open-source projects are linked", () => {
  // the retro OS project list used to be inlined in index.html; it now loads from assets/data
  const linked = home + read("assets/data/os.en.json");
  for (const repo of ["cobol-equiv", "pricing-crosscheck", "quasar-solver", "nur", "ai-eval-lab"]) {
    assert.match(linked, new RegExp(`https://github.com/abdulazizbalu/${repo}`));
  }
});

test("every page has the landscape footer and self-hosted fonts", () => {
  for (const p of pages) {
    const html = read(p);
    assert.match(html, /<footer class="lfoot"/, `${p}: footer`);
    assert.doesNotMatch(html, /<footer class="foot"/, `${p}: old footer`);
    assert.doesNotMatch(html, /fonts\.googleapis\.com/, `${p}: google fonts`);
  }
});

test("the only contact email is the gmail address", () => {
  for (const p of pages) {
    for (const [, addr] of read(p).matchAll(/href="mailto:([^"?]*)/g)) assert.equal(addr, "abdushkin2001@gmail.com", `${p}: ${addr}`);
  }
});

test("service timelines use the current values", () => {
  // bots and sites up to 3 days, AI 1-2 weeks, web apps 2-4 weeks (EN and RU)
  const stale = /\b(3–4|4–8|2–3) (weeks|недел[а-яё]*)|Websites · 1–2 weeks|Mini Apps · 1–2 (weeks|недели)|Сайты · 1–2 недели|AI features · 2–4 weeks|AI-функции · 2–4 недели|bot or a site usually takes 1–2|сайт обычно 1–2/;
  for (const p of [...pages, "assets/data/os.en.json", "assets/data/os.ru.json"]) assert.doesNotMatch(read(p), stale, p);
});

test("mailto subjects are fully encoded", () => {
  for (const p of pages) {
    for (const [, q] of read(p).matchAll(/href="mailto:[^"?]*\?([^"]*)"/g)) assert.doesNotMatch(q, /&(?!amp;)/, `${p}: raw & in ${q}`);
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

test("service pages exist in both languages", () => {
  assert.ok(svc.length >= 4, `only ${svc.length} service pages`);
  for (const slug of ["telegram-bots", "websites", "web-apps", "ai"]) {
    assert.ok(svc.includes(slug), slug);
    assert.match(read(`services/${slug}/index.html`), /hreflang="ru"/);
  }
  assert.match(home, /Telegram bots/);
});

test("sitemap lists every indexable page", () => {
  const sm = read("sitemap.xml");
  assert.match(sm, /\/ru\//);
  for (const d of cases) assert.match(sm, new RegExp(`/work/${d}/`), d);
  for (const d of svc) assert.match(sm, new RegExp(`/ru/services/${d}/`), d);
  assert.match(read("robots.txt"), /Sitemap: https:\/\//);
});

test("client work stays anonymous", () => {
  assert.match(home, /under NDA/);
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
  assert.match(read("assets/main.js"), /data-demo/);
});

test("no em dashes in copy", () => {
  for (const p of pages) assert.doesNotMatch(read(p), /—/, p);
  assert.doesNotMatch(read("assets/os.js"), /—/);
});
