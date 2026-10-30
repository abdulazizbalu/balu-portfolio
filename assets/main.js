/* Notebook interactions: lights, clock, written-in reveal, sketchy live demos. */
(() => {
  const root = document.documentElement;
  const RU = root.lang === "ru";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const METRICA = 113689053;
  const goal = (g) => { try { if (typeof window.ym === "function") window.ym(METRICA, "reachGoal", g); } catch (_) { /* ignore */ } };
  const store = { set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* private mode */ } } };
  const $$ = (s, n = document) => [...n.querySelectorAll(s)];
  const INK = { ink: "#1d2433", red: "#c93c33", blue: "#2747a8", axis: "#8a90a0" };

  // ---------------------------------------------------------------- lights
  const toggles = $$("[data-mode-toggle]");
  const label = () => toggles.forEach((b) => { b.textContent = root.dataset.mode === "dark" ? b.dataset.on : b.dataset.off; });
  label();
  toggles.forEach((b) => b.addEventListener("click", () => {
    const m = root.dataset.mode === "dark" ? "light" : "dark";
    root.dataset.mode = m; store.set("balu-mode", m); label(); goal("theme_" + m);
  }));

  // ---------------------------------------------------------------- clock
  const clocks = $$("[data-clock]");
  const tick = () => {
    const t = new Intl.DateTimeFormat(RU ? "ru-RU" : "en-GB", { timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit" }).format(new Date());
    clocks.forEach((c) => { c.textContent = t; });
  };
  if (clocks.length) { tick(); setInterval(tick, 20000); }

  // ---------------------------------------------------------------- goals
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("a");
    if (!a) return;
    const h = a.getAttribute("href") || "";
    if (h.includes("t.me/")) goal("telegram_click");
    else if (h.includes("github.com/")) goal("repo_click");
    else if (h.includes("work/")) goal("case_open");
  });

  // ---------------------------------------------------------------- copy email
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async (ev) => {
    const ok = (b.closest(".envelope") || document).querySelector(".copy-ok");
    if (!navigator.clipboard) return;
    ev.preventDefault();
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (_) { location.href = "mailto:" + b.dataset.copy; return; }
    if (ok) { ok.textContent = ok.dataset.copied; ok.classList.add("on"); setTimeout(() => ok.classList.remove("on"), 1800); }
    goal("email_copy");
  }));

  // ---------------------------------------------------------------- written-in reveal
  requestAnimationFrame(() => document.querySelector(".hero")?.classList.add("ready"));
  const rv = $$(".rv");
  if (rv.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
    rv.forEach((n) => io.observe(n));
  } else rv.forEach((n) => n.classList.add("in"));

  // ---------------------------------------------------------------- landscape footer: rise in, slight parallax
  const lfoot = document.querySelector("[data-lfoot]");
  const land = lfoot?.querySelector(".lfoot-land");
  const img = land?.querySelector("img");
  if (lfoot && land && img && "IntersectionObserver" in window && !reduce) {
    const LIFT = 40;
    let raf = 0, on = false;
    const move = () => {
      raf = 0;
      const r = land.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
      img.style.setProperty("--py", (-LIFT * p).toFixed(1) + "px");
    };
    const queue = () => { if (on && !raf) raf = requestAnimationFrame(move); };
    new IntersectionObserver((es) => es.forEach((en) => {
      on = en.isIntersecting;
      if (en.intersectionRatio >= 0.15) lfoot.classList.add("in");
      queue();
    }), { threshold: [0, 0.15] }).observe(land);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
  } else lfoot?.classList.add("in");

  // ---------------------------------------------------------------- sketchy demos
  const sized = (cv) => { const r = Math.min(2, devicePixelRatio || 1); cv.width = cv.clientWidth * r; cv.height = cv.clientHeight * r; return r; };
  const DEMOS = {
    quasar(cv) {
      const out = cv.parentElement.querySelector("[data-out]");
      const base = out ? out.textContent : "";
      let P = [], tour = [], T = 1, raf = 0, frame = 0, rest = 0;
      const reset = () => { P = Array.from({ length: 15 }, () => [Math.random(), Math.random()]); tour = P.map((_, i) => i).sort(() => Math.random() - 0.5); T = 1; rest = 0; };
      const d = (a, b) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]);
      const len = () => tour.reduce((s, c, i) => s + d(c, tour[(i + 1) % tour.length]), 0);
      const anneal = () => {
        for (let k = 0; k < 30; k++) {
          const i = 1 + Math.floor(Math.random() * (tour.length - 2)), j = i + 1 + Math.floor(Math.random() * (tour.length - i - 1));
          const a = tour[i - 1], b = tour[i], c = tour[j], e = tour[(j + 1) % tour.length];
          const delta = d(a, c) + d(b, e) - d(a, b) - d(c, e);
          if (delta < 0 || Math.random() < Math.exp(-delta / (T * 0.08))) tour = tour.slice(0, i).concat(tour.slice(i, j + 1).reverse(), tour.slice(j + 1));
        }
        T *= 0.985;
      };
      const draw = () => {
        if (!window.rough) return;
        const r = sized(cv), W = cv.width, H = cv.height, rc = window.rough.canvas(cv);
        const px = (p) => [26 * r + p[0] * (W - 52 * r), 22 * r + p[1] * (H - 44 * r)];
        cv.getContext("2d").clearRect(0, 0, W, H);
        rc.polygon(tour.map((i) => px(P[i])), { stroke: INK.ink, strokeWidth: 1.6 * r, roughness: 1.3, bowing: 1.2, seed: 7 });
        P.forEach((p) => { const [x, y] = px(p); rc.circle(x, y, 11 * r, { fill: INK.red, fillStyle: "solid", stroke: INK.red, roughness: 0.8, seed: 3 }); });
        if (out) out.textContent = T <= 0.002 ? (RU ? `готово: длина ${len().toFixed(2)}` : `done: length ${len().toFixed(2)}`) : base;
      };
      const step = () => {
        if (T > 0.002) anneal(); else if (++rest > 160) reset();
        if (frame++ % 5 === 0) draw();
        raf = requestAnimationFrame(step);
      };
      reset();
      const btn = cv.closest("[data-shuffle]");
      if (btn) btn.addEventListener("click", () => { reset(); draw(); goal("demo_shuffle"); });
      if (reduce) { while (T > 0.002) anneal(); return { play: draw, pause() {}, redraw: draw }; }
      return { play() { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); }, pause() { cancelAnimationFrame(raf); }, redraw: draw };
    },
    pricing(cv) {
      const even = [[50, 0.2439], [100, 0.1233], [200, 0.06198], [400, 0.03108], [800, 0.01557], [1600, 0.007791]];
      const odd = [[51, 2.14e-4], [101, 5.55e-5], [201, 1.41e-5], [401, 3.56e-6], [801, 8.94e-7], [1601, 2.24e-7]];
      let shown = reduce ? 6 : 0, timer = 0;
      const draw = () => {
        if (!window.rough) return;
        const r = sized(cv), W = cv.width, H = cv.height, rc = window.rough.canvas(cv);
        const lx = (v) => 24 * r + (Math.log10(v) - 1.6) / (3.3 - 1.6) * (W - 44 * r);
        const ly = (v) => 14 * r + (-0.5 - Math.log10(v)) / (7 - 0.5) * (H - 30 * r);
        cv.getContext("2d").clearRect(0, 0, W, H);
        rc.line(14 * r, H - 10 * r, W - 10 * r, H - 10 * r, { stroke: INK.axis, roughness: 1.2, strokeWidth: r, seed: 1 });
        rc.line(14 * r, 8 * r, 14 * r, H - 10 * r, { stroke: INK.axis, roughness: 1.2, strokeWidth: r, seed: 2 });
        const k = Math.max(1, shown);
        const s = (pts, col) => {
          const v = pts.slice(0, k).map(([a, b]) => [lx(a), ly(b)]);
          if (v.length > 1) rc.linearPath(v, { stroke: col, strokeWidth: 1.8 * r, roughness: 1.1, seed: 5 });
          v.forEach(([x, y]) => rc.circle(x, y, 8 * r, { fill: col, fillStyle: "solid", stroke: col, roughness: 0.7, seed: 2 }));
        };
        s(even, INK.red); s(odd, INK.blue);
      };
      const loop = () => { shown = shown >= 6 ? 1 : shown + 1; draw(); timer = setTimeout(loop, shown >= 6 ? 2800 : 450); };
      return { play() { clearTimeout(timer); if (reduce) draw(); else loop(); }, pause() { clearTimeout(timer); }, redraw: draw };
    },
    cobol(box) {
      const out = box.parentElement.querySelector("[data-out]");
      const rules = ["MOVE num→num", "COMP-3 pack", "ROUNDED", "ON SIZE ERROR", "PICTURE edit", "STRING", "UNSTRING", "INSPECT", "COMPUTE", "DIVIDE REM"];
      let n = 0, timer = 0;
      const line = () => {
        n = Math.min(9769, n + 37 + Math.floor(Math.random() * 40));
        const p = document.createElement("p");
        p.innerHTML = `<span class="ok">✓</span> ${String(n).padStart(4, "0")} ${rules[Math.floor(Math.random() * rules.length)]} · ${RU ? "совпало" : "equal"}`;
        box.appendChild(p);
        while (box.children.length > 7) box.firstChild.remove();
        if (out) out.textContent = RU ? `${n.toLocaleString("ru-RU")} из 9 769 · 0 расхождений` : `${n.toLocaleString("en-US")} of 9,769 · 0 diffs`;
      };
      const loop = () => { line(); timer = setTimeout(n < 9769 ? loop : () => { n = 0; box.innerHTML = ""; loop(); }, n < 9769 ? 110 : 2600); };
      if (reduce) { for (let i = 0; i < 7; i++) line(); return { play() {}, pause() {}, redraw() {} }; }
      return { play() { clearTimeout(timer); loop(); }, pause() { clearTimeout(timer); }, redraw() {} };
    },
  };
  const demos = [];
  const boot = () => {
    $$("[data-demo]").forEach((el) => {
      const make = DEMOS[el.dataset.demo];
      if (!make) return;
      const d = make(el); demos.push(d);
      if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((en) => (en.isIntersecting ? d.play() : d.pause())), { threshold: 0.1 }).observe(el);
      else d.play();
    });
  };
  if (window.rough || !document.querySelector("canvas[data-demo]")) boot(); else addEventListener("load", boot);
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => demos.forEach((d) => d.redraw()), 150); });

  // ---------------------------------------------------------------- email picker
  // mailto: opens whatever app the visitor's system has (often not their real inbox),
  // so offer Gmail, Outlook, copy, or the default app.
  const L = RU
    ? { gmail: "открыть в Gmail", outlook: "открыть в Outlook", copy: "скопировать адрес", app: "почтовое приложение", done: "скопировано ✓" }
    : { gmail: "open in Gmail", outlook: "open in Outlook", copy: "copy address", app: "default mail app", done: "copied ✓" };
  let pick = null;
  const closePick = () => { pick?.remove(); pick = null; };
  document.addEventListener("click", (ev) => {
    if (pick && !pick.contains(ev.target)) closePick();
    const a = ev.target.closest('a[href^="mailto:"]');
    if (!a || a.hasAttribute("data-copy")) return;
    ev.preventDefault();
    const u = new URL(a.href.replace("mailto:", "https://x/?to="));
    const to = decodeURIComponent(a.href.slice(7).split("?")[0]);
    const su = u.searchParams.get("subject") || "";
    const q = encodeURIComponent;
    pick = document.createElement("div");
    pick.className = "mailpick";
    pick.setAttribute("role", "menu");
    pick.innerHTML =
      `<p class="addr">${to}</p>` +
      `<a role="menuitem" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=${q(to)}&su=${q(su)}">${L.gmail}</a>` +
      `<a role="menuitem" target="_blank" rel="noopener" href="https://outlook.live.com/mail/0/deeplink/compose?to=${q(to)}&subject=${q(su)}">${L.outlook}</a>` +
      `<button type="button" role="menuitem" data-c>${L.copy}</button>` +
      `<a role="menuitem" href="${a.href}">${L.app}</a>`;
    document.body.appendChild(pick);
    const r = a.getBoundingClientRect();
    const left = Math.min(Math.max(12, r.left), innerWidth - pick.offsetWidth - 12);
    const top = r.bottom + 10 + pick.offsetHeight < innerHeight ? r.bottom + 10 : r.top - pick.offsetHeight - 10;
    pick.style.left = left + "px"; pick.style.top = top + scrollY + "px";
    pick.querySelector("[data-c]").addEventListener("click", async (e2) => {
      e2.stopPropagation();
      try { await navigator.clipboard.writeText(to); e2.target.textContent = L.done; goal("email_copy"); } catch (_) { /* ignore */ }
      setTimeout(closePick, 900);
    });
    pick.querySelectorAll("a").forEach((x) => x.addEventListener("click", () => { goal("email_click"); setTimeout(closePick, 50); }));
    pick.querySelector("a")?.focus();
  });
  addEventListener("keydown", (ev) => { if (ev.key === "Escape") closePick(); });

  // ---------------------------------------------------------------- retro OS easter egg
  $$("[data-os]").forEach((b) => {
    b.hidden = !(window.baluOS && window.baluOS.capable);
    b.addEventListener("click", () => { goal("os_boot"); window.baluOS?.start(); });
  });
})();
