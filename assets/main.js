/* Portfolio interactions: theme, clock, command palette, live project demos, reveal on scroll. */
(() => {
  const root = document.documentElement;
  const RU = root.lang === "ru";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const METRICA = 113689053;
  const goal = (g) => { try { if (typeof window.ym === "function") window.ym(METRICA, "reachGoal", g); } catch (_) { /* ignore */ } };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* private mode */ } },
  };
  const $ = (s, n = document) => n.querySelector(s);
  const $$ = (s, n = document) => [...n.querySelectorAll(s)];
  const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();

  // ---------------------------------------------------------------- theme
  const setMode = (m) => { root.dataset.mode = m; store.set("balu-mode", m); goal("theme_" + m); window.dispatchEvent(new Event("modechange")); };
  $$("[data-mode-toggle]").forEach((b) => b.addEventListener("click", () => setMode(root.dataset.mode === "dark" ? "light" : "dark")));

  // ---------------------------------------------------------------- header shadow + Tashkent clock
  const top = $(".top");
  const onScroll = () => top && top.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const clocks = $$("[data-clock]");
  const tick = () => {
    const t = new Intl.DateTimeFormat(RU ? "ru-RU" : "en-GB", { timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit" }).format(new Date());
    clocks.forEach((c) => { c.textContent = t; });
  };
  if (clocks.length) { tick(); setInterval(tick, 20000); }

  // ---------------------------------------------------------------- analytics goals
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("a");
    if (!a) return;
    const h = a.getAttribute("href") || "";
    if (h.includes("t.me/")) goal("telegram_click");
    else if (h.startsWith("mailto:")) goal("email_click");
    else if (h.includes("github.com/")) goal("repo_click");
    else if (h.includes("work/")) goal("case_open");
  });

  // ---------------------------------------------------------------- copy email
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async (ev) => {
    ev.preventDefault();
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (_) { location.href = "mailto:" + b.dataset.copy; return; }
    const ok = b.parentElement.querySelector(".copy-ok");
    if (ok) { ok.classList.add("on"); setTimeout(() => ok.classList.remove("on"), 1600); }
    goal("email_copy");
  }));

  // ---------------------------------------------------------------- reveal on scroll
  const rv = $$(".rv");
  if (rv.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    rv.forEach((n) => io.observe(n));
  } else rv.forEach((n) => n.classList.add("in"));

  // ---------------------------------------------------------------- live demos
  const DEMOS = {
    quasar(box) {
      const cv = document.createElement("canvas"); box.prepend(cv);
      const out = box.querySelector("[data-out]");
      const ctx = cv.getContext("2d");
      let pts = [], tour = [], T = 1, raf = 0, wait = 0;
      const reset = () => {
        pts = Array.from({ length: 20 }, () => [Math.random(), Math.random()]);
        tour = pts.map((_, i) => i).sort(() => Math.random() - 0.5); T = 1;
      };
      const d = (a, b) => Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
      const len = () => tour.reduce((s, c, i) => s + d(c, tour[(i + 1) % tour.length]), 0);
      const anneal = (n) => {
        for (let k = 0; k < n; k++) {
          const i = 1 + Math.floor(Math.random() * (tour.length - 2)), j = i + 1 + Math.floor(Math.random() * (tour.length - i - 1));
          const a = tour[i - 1], b = tour[i], c = tour[j], e = tour[(j + 1) % tour.length];
          const delta = d(a, c) + d(b, e) - d(a, b) - d(c, e);
          if (delta < 0 || Math.random() < Math.exp(-delta / (T * 0.08))) tour = tour.slice(0, i).concat(tour.slice(i, j + 1).reverse(), tour.slice(j + 1));
        }
        T *= 0.985;
      };
      const draw = () => {
        const dpr = devicePixelRatio || 1, W = cv.width = cv.clientWidth * dpr, H = cv.height = cv.clientHeight * dpr;
        const pad = 22 * dpr, px = (p) => [pad + p[0] * (W - 2 * pad), 16 * dpr + p[1] * (H - 56 * dpr)];
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = css("--fg"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.2 * dpr; ctx.lineJoin = "round";
        ctx.beginPath(); tour.forEach((c, i) => { const [x, y] = px(pts[c]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = css("--accent");
        pts.forEach((p) => { const [x, y] = px(p); ctx.beginPath(); ctx.arc(x, y, 2.6 * dpr, 0, 7); ctx.fill(); });
        if (out) out.textContent = `T ${T.toFixed(3)} · ${RU ? "длина" : "length"} ${len().toFixed(2)}`;
      };
      const step = () => {
        if (wait) { wait--; } else { anneal(40); if (T < 0.002) { wait = 90; T = 0.0019; } }
        if (wait === 1) reset();
        draw(); raf = requestAnimationFrame(step);
      };
      reset();
      if (reduce) { while (T > 0.002) anneal(40); draw(); return { play() {}, pause() {}, redraw: draw }; }
      return { play() { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); }, pause() { cancelAnimationFrame(raf); }, redraw: draw };
    },
    cobol(box) {
      const tk = document.createElement("div"); tk.className = "ticker"; box.prepend(tk);
      const out = box.querySelector("[data-out]");
      const rules = ["MOVE num→num", "COMP-3 pack", "ROUNDED", "ON SIZE ERROR", "PICTURE edit", "STRING", "UNSTRING", "INSPECT", "COMPUTE", "DIVIDE REMAINDER"];
      let n = 0, timer = 0;
      const line = () => {
        n = Math.min(9769, n + 37 + Math.floor(Math.random() * 40));
        const p = document.createElement("p");
        p.innerHTML = `<span class="ok">✓</span> case ${String(n).padStart(4, "0")} · ${rules[Math.floor(Math.random() * rules.length)]} · ${RU ? "байты совпали" : "bytes equal"}`;
        tk.appendChild(p);
        while (tk.children.length > 6) tk.firstChild.remove();
        if (out) out.textContent = `${n.toLocaleString(RU ? "ru-RU" : "en-US")} / ${RU ? "9 769 · 0 расхождений" : "9,769 · 0 diffs"}`;
      };
      const loop = () => { line(); timer = setTimeout(n < 9769 ? loop : () => { n = 0; tk.innerHTML = ""; loop(); }, n < 9769 ? 90 : 2600); };
      if (reduce) { for (let i = 0; i < 7; i++) line(); return { play() {}, pause() {}, redraw() {} }; }
      return { play() { clearTimeout(timer); loop(); }, pause() { clearTimeout(timer); }, redraw() {} };
    },
    pricing(box) {
      const cv = document.createElement("canvas"); box.prepend(cv);
      const even = [[50, 0.2439], [100, 0.1233], [200, 0.06198], [400, 0.03108], [800, 0.01557], [1600, 0.007791]];
      const odd = [[51, 2.14e-4], [101, 5.55e-5], [201, 1.41e-5], [401, 3.56e-6], [801, 8.94e-7], [1601, 2.24e-7]];
      let prog = reduce ? 1 : 0, raf = 0;
      const draw = () => {
        const dpr = devicePixelRatio || 1, W = cv.width = cv.clientWidth * dpr, H = cv.height = cv.clientHeight * dpr, ctx = cv.getContext("2d");
        const lx = (v) => 22 * dpr + (Math.log10(v) - 1.6) / (3.3 - 1.6) * (W - 44 * dpr);
        const ly = (v) => 18 * dpr + (-0.5 - Math.log10(v)) / (7 - 0.5) * (H - 56 * dpr);
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = css("--line-2"); ctx.lineWidth = dpr; ctx.setLineDash([2 * dpr, 4 * dpr]);
        for (let e = 1; e <= 7; e += 2) { ctx.beginPath(); ctx.moveTo(22 * dpr, ly(10 ** -e)); ctx.lineTo(W - 22 * dpr, ly(10 ** -e)); ctx.stroke(); }
        ctx.setLineDash([]);
        const series = (pts, col) => {
          const k = Math.max(1, Math.ceil(pts.length * prog));
          ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.6 * dpr;
          ctx.beginPath(); pts.slice(0, k).forEach(([s, v], i) => (i ? ctx.lineTo(lx(s), ly(v)) : ctx.moveTo(lx(s), ly(v)))); ctx.stroke();
          pts.slice(0, k).forEach(([s, v]) => { ctx.beginPath(); ctx.arc(lx(s), ly(v), 2.8 * dpr, 0, 7); ctx.fill(); });
        };
        series(even, css("--warm")); series(odd, css("--accent"));
        if (prog < 1) { prog = Math.min(1, prog + 0.018); raf = requestAnimationFrame(draw); }
      };
      return { play() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }, pause() { cancelAnimationFrame(raf); }, redraw: draw };
    },
  };
  const demos = [];
  $$("[data-demo]").forEach((box) => {
    const make = DEMOS[box.dataset.demo];
    if (!make) return;
    const d = make(box); demos.push(d);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? d.play() : d.pause())), { threshold: 0.15 }).observe(box);
    } else d.play();
  });
  addEventListener("modechange", () => demos.forEach((d) => d.redraw()));
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => demos.forEach((d) => d.redraw()), 150); });

  // ---------------------------------------------------------------- command palette
  const dlg = $("#cmdk");
  if (!dlg) return;
  const input = $("input", dlg), list = $("ul", dlg);
  const prefix = dlg.dataset.prefix || "";
  const os = () => window.baluOS && window.baluOS.capable;
  const T = RU ? { go: "Перейти", open: "Открыть", act: "Действие", nothing: "Ничего не найдено" } : { go: "Go to", open: "Open", act: "Action", nothing: "Nothing found" };
  const items = () => {
    const out = [];
    $$("main [data-nav]").forEach((s) => out.push({ label: s.dataset.nav, group: T.go, run: () => s.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }) }));
    JSON.parse(dlg.dataset.items || "[]").forEach(([label, href, kind]) => out.push({
      label, group: kind === "case" ? T.open : T.act,
      run: () => { if (/^https?:/.test(href)) window.open(href, "_blank", "noopener"); else location.href = href; },
    }));
    out.push({ label: RU ? "Скопировать email" : "Copy email", group: T.act, run: () => { navigator.clipboard?.writeText(dlg.dataset.mail); goal("email_copy"); } });
    out.push({ label: RU ? "Сменить тему" : "Toggle theme", group: T.act, run: () => setMode(root.dataset.mode === "dark" ? "light" : "dark") });
    if (os()) out.push({ label: RU ? "Запустить BALU-OS (ретро-режим)" : "Launch BALU-OS (retro mode)", group: "easter egg", run: () => { goal("os_boot"); window.baluOS.start(); } });
    return out;
  };
  let all = [], shown = [], sel = 0, lastFocus = null;
  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = all.filter((i) => !q || i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length
      ? shown.map((i, k) => `<li role="option" id="ck${k}" aria-selected="${k === sel}" class="${k === sel ? "on" : ""}" data-k="${k}">${i.label.replace(/</g, "&lt;")}<span class="g">${i.group}</span></li>`).join("")
      : `<li class="empty" aria-disabled="true">${T.nothing}</li>`;
    input.setAttribute("aria-activedescendant", shown.length ? "ck" + sel : "");
  };
  const open = () => {
    if (document.body.classList.contains("os-on")) return;
    lastFocus = document.activeElement; all = items(); input.value = ""; sel = 0; render();
    dlg.hidden = false; requestAnimationFrame(() => dlg.classList.add("open")); input.focus(); goal("cmdk_open");
  };
  const close = () => { dlg.classList.remove("open"); setTimeout(() => { dlg.hidden = true; }, 150); lastFocus?.focus?.(); };
  const run = (k) => { const it = shown[k]; if (!it) return; close(); setTimeout(it.run, 60); };
  $$("[data-cmdk]").forEach((b) => b.addEventListener("click", open));
  $$("[data-os]").forEach((b) => { b.hidden = !os(); b.addEventListener("click", () => { goal("os_boot"); window.baluOS?.start(); }); });
  addEventListener("keydown", (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); dlg.hidden ? open() : close(); return; }
    if (ev.key === "/" && dlg.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { ev.preventDefault(); open(); }
  });
  dlg.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") { ev.preventDefault(); close(); }
    else if (ev.key === "ArrowDown") { ev.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); $("li.on", list)?.scrollIntoView({ block: "nearest" }); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); $("li.on", list)?.scrollIntoView({ block: "nearest" }); }
    else if (ev.key === "Enter") { ev.preventDefault(); run(sel); }
  });
  input.addEventListener("input", () => { sel = 0; render(); });
  list.addEventListener("click", (ev) => { const li = ev.target.closest("li[data-k]"); if (li) run(+li.dataset.k); });
  list.addEventListener("mousemove", (ev) => { const li = ev.target.closest("li[data-k]"); if (li && +li.dataset.k !== sel) { sel = +li.dataset.k; render(); } });
  dlg.addEventListener("click", (ev) => { if (ev.target === dlg) close(); });
})();
