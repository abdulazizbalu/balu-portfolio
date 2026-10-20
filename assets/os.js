/* BALU-OS: a small desktop environment on top of the portfolio page.
   The page itself stays the source of truth for search engines and small screens. */
(() => {
  const dataEl = document.getElementById("balu-data");
  if (!dataEl) return;
  const D = JSON.parse(dataEl.textContent);
  const RU = D.lang === "ru";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const capable = matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
  const store = {
    get: (k, s = localStorage) => { try { return s.getItem(k); } catch (_) { return null; } },
    set: (k, v, s = localStorage) => { try { s.setItem(k, v); } catch (_) { /* private mode */ } },
  };
  const goal = (g) => { try { if (typeof window.ym === "function") window.ym(D.metrica, "reachGoal", g); } catch (_) { /* ignore */ } };

  // phosphor theme persists across both views
  const savedTheme = store.get("balu-theme");
  if (savedTheme === "amber") document.documentElement.dataset.theme = "amber";

  const L = RU ? {
    projects: "проекты", nda: "архив.nda", terminal: "терминал", history: "опыт.log", services: "услуги.man", contact: "контакт.sh",
    readme: "readme.txt", upstream: "upstream", trash: "корзина", about: "О BALU-OS", classic: "Вернуться на сайт", shutdown: "Выключить...",
    reboot: "Перезагрузить", all: "все", items: "объектов", open: "открыть", caseStudy: "разбор проекта →", skip: "нажмите любую клавишу, чтобы пропустить",
    off: "Теперь компьютер можно выключить.", offSub: "нажмите любую клавишу, чтобы вернуться на сайт", saver: "любое движение, чтобы вернуться",
    decrypt: "расшифровать всё", denied: "ДОСТУП ЗАПРЕЩЁН: NDA", copy: "скопировать email", copied: "скопировано",
    trashText: "сомнения.txt · дедлайны-сорванные.log (пусто) · \"и так сойдёт\".bak", emptyTrash: "очистить корзину",
    trashDone: "нечего удалять. хороший инстинкт.", welcome: "Добро пожаловать в BALU-OS",
    tips: ["двойной клик по иконке открывает приложение", "окна можно перетаскивать и растягивать", "<kbd>Ctrl</kbd>+<kbd>K</kbd> открывает терминал, попробуйте <kbd>help</kbd>",
           "классический вид страницы есть в меню ◆", "в системе есть пасхалки"],
    apps: "Приложения", status: "беру проекты",
  } : {
    projects: "projects", nda: "nda.archive", terminal: "terminal", history: "history.log", services: "services.man", contact: "contact.sh",
    readme: "readme.txt", upstream: "upstream", trash: "trash", about: "About BALU-OS", classic: "Back to the site", shutdown: "Shut down...",
    reboot: "Restart", all: "all", items: "items", open: "open", caseStudy: "read the case study →", skip: "press any key to skip",
    off: "It is now safe to turn off your computer.", offSub: "press any key to return to the site", saver: "move the mouse to come back",
    decrypt: "decrypt all", denied: "ACCESS DENIED: NDA", copy: "copy email", copied: "copied",
    trashText: "doubts.txt · missed-deadlines.log (empty) · good-enough.bak", emptyTrash: "empty trash",
    trashDone: "nothing to delete. good instinct.", welcome: "Welcome to BALU-OS",
    tips: ["double-click an icon to open an app", "drag windows around, resize from the corner", "<kbd>Ctrl</kbd>+<kbd>K</kbd> opens the terminal, try <kbd>help</kbd>",
           "the classic page lives in the ◆ menu", "there are easter eggs"],
    apps: "Apps", status: "open to contracts",
  };


  // ------------------------------------------------------------------ icons
  function icon(kind, extra) {
    const g = "var(--green)", a = "var(--amber)", dim = "var(--line2)";
    const s = (b) => `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">${b}</svg>`;
    switch (kind) {
      case "folder": return s(`<path d="M4 12h15l4 5h21v23H4z" fill="rgba(57,255,20,.08)" stroke="${g}" stroke-width="2"/><path d="M4 19h40" stroke="${g}" stroke-width="2"/>${extra ? `<text x="24" y="36" fill="${g}" font-size="10" text-anchor="middle" font-family="monospace">${extra}</text>` : ""}`);
      case "lock": return s(`<rect x="9" y="20" width="30" height="22" rx="3" fill="rgba(255,176,0,.08)" stroke="${a}" stroke-width="2"/><path d="M15 20v-6a9 9 0 0 1 18 0v6" stroke="${a}" stroke-width="2"/><circle cx="24" cy="31" r="3" fill="${a}"/>`);
      case "term": return s(`<rect x="4" y="8" width="40" height="32" rx="4" fill="rgba(57,255,20,.06)" stroke="${g}" stroke-width="2"/><path d="M11 18l7 6-7 6M22 31h12" stroke="${g}" stroke-width="2.5" stroke-linecap="round"/>`);
      case "doc": return s(`<path d="M11 4h18l9 9v31H11z" fill="rgba(57,255,20,.06)" stroke="${g}" stroke-width="2"/><path d="M29 4v9h9M17 22h15M17 28h15M17 34h10" stroke="${g}" stroke-width="2"/>`);
      case "log": return s(`<path d="M11 4h26v40H11z" fill="rgba(57,255,20,.06)" stroke="${g}" stroke-width="2"/><path d="M16 13h3M22 13h10M16 20h3M22 20h10M16 27h3M22 27h10M16 34h3M22 34h7" stroke="${g}" stroke-width="2"/>`);
      case "man": return s(`<path d="M8 6h24l8 8v28H8z" fill="rgba(57,255,20,.06)" stroke="${g}" stroke-width="2"/><text x="24" y="33" fill="${g}" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">man</text>`);
      case "mail": return s(`<rect x="5" y="11" width="38" height="26" rx="3" fill="rgba(57,255,20,.06)" stroke="${g}" stroke-width="2"/><path d="M6 13l18 13 18-13" stroke="${g}" stroke-width="2"/>`);
      case "git": return s(`<circle cx="14" cy="12" r="4" stroke="${g}" stroke-width="2"/><circle cx="14" cy="36" r="4" stroke="${g}" stroke-width="2"/><circle cx="34" cy="20" r="4" stroke="${a}" stroke-width="2"/><path d="M14 16v16M34 24c0 8-12 6-17 10" stroke="${g}" stroke-width="2"/>`);
      case "plane": return s(`<path d="M5 23L42 8l-7 33-11-9-6 7v-10l17-14-21 12z" fill="rgba(57,255,20,.08)" stroke="${g}" stroke-width="2" stroke-linejoin="round"/>`);
      case "trash": return s(`<path d="M10 14h28l-3 28H13z" fill="rgba(57,255,20,.04)" stroke="${dim}" stroke-width="2"/><path d="M7 14h34M19 14V8h10v6M19 21v15M29 21v15" stroke="${g}" stroke-width="2"/>`);
      case "file": return s(`<path d="M11 4h18l9 9v31H11z" fill="rgba(57,255,20,.05)" stroke="${extra || g}" stroke-width="2"/><path d="M29 4v9h9" stroke="${extra || g}" stroke-width="2"/><path d="M17 26l-4 4 4 4M31 26l4 4-4 4M26 23l-4 14" stroke="${g}" stroke-width="2"/>`);
      default: return s("");
    }
  }

  const APPS = [
    { id: "readme", label: () => L.readme, icon: "doc", w: 560, h: 520 },
    { id: "projects", label: () => L.projects, icon: "folder", w: 760, h: 500 },
    { id: "nda", label: () => L.nda, icon: "lock", w: 820, h: 560 },
    { id: "terminal", label: () => L.terminal, icon: "term", w: 640, h: 400 },
    { id: "history", label: () => L.history, icon: "log", w: 640, h: 520 },
    { id: "services", label: () => L.services, icon: "man", w: 680, h: 540 },
    { id: "upstream", label: () => L.upstream, icon: "git", w: 600, h: 420 },
    { id: "contact", label: () => L.contact, icon: "mail", w: 480, h: 360 },
    { id: "trash", label: () => L.trash, icon: "trash", w: 420, h: 240 },
  ];
  const DOCK = ["projects", "terminal", "nda", "history", "services", "contact"];

  // ------------------------------------------------------------------ state
  let root, layer, dockEl, z = 100, idleTimer, saverOn = false, started = false;
  const wins = new Map();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  function start(manual) {
    if (started) return;
    started = true;
    const href = D.prefix + "assets/os.css";
    const existing = [...document.querySelectorAll("link[rel=stylesheet]")].find((l) => l.getAttribute("href") === href);
    if (existing) { build(manual); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => build(manual);
    document.head.appendChild(link);
  }

  function build(manual) {
    root = el("div");
    root.id = "os";
    root.setAttribute("role", "application");
    root.setAttribute("aria-label", "BALU-OS desktop");
    document.body.appendChild(root);
    document.body.classList.add("os-on");

    const bannerSrc = document.querySelector(".hero .banner");
    if (bannerSrc) {
      const wall = bannerSrc.cloneNode(true);
      wall.classList.add("os-wall");
      root.appendChild(wall);
      root.appendChild(el("div", "os-wall-cap", "BALU-OS v26.10 · Tashkent · UTC+05:00"));
    }
    menubar();
    desktopIcons();
    layer = el("div", "os-layer");
    root.appendChild(layer);
    dock();
    keys();
    idle();
    goal("os_boot");

    const seen = store.get("balu-booted", sessionStorage);
    const afterBoot = () => {
      openApp("readme", { x: 150, y: 60 });
      setTimeout(() => openApp("terminal", { x: Math.max(160, innerWidth - 700), y: Math.max(70, innerHeight - 520) }), reduce ? 0 : 260);
    };
    if (!seen && !reduce && !manual) { store.set("balu-booted", "1", sessionStorage); boot(afterBoot); } else afterBoot();
  }

  function teardown() {
    root?.remove();
    document.body.classList.remove("os-on");
    wins.clear();
    started = false;
    clearTimeout(idleTimer);
  }

  // ------------------------------------------------------------------ menubar
  function menubar() {
    const mb = el("div", "os-menubar");
    const logo = el("button", "os-mb-btn os-mb-logo", "◆ BALU-OS");
    logo.setAttribute("aria-haspopup", "menu");
    logo.setAttribute("aria-expanded", "false");
    const apps = el("button", "os-mb-btn", L.apps);
    apps.setAttribute("aria-haspopup", "menu");
    apps.setAttribute("aria-expanded", "false");
    mb.append(logo, apps);
    ["projects", "nda", "contact"].forEach((id) => {
      const b = el("button", "os-mb-btn", esc(APPS.find((x) => x.id === id).label()));
      b.onclick = () => openApp(id);
      mb.appendChild(b);
    });
    const right = el("div", "os-mb-right");
    const langHref = RU ? D.prefix : "ru/";
    right.innerHTML = `<span><span class="dot"></span>${esc(L.status)}</span><a href="${langHref}" hreflang="${RU ? "en" : "ru"}">${RU ? "EN" : "RU"}</a><span class="clock"></span>`;
    mb.appendChild(right);
    root.appendChild(mb);

    const clock = right.querySelector(".clock");
    const tick = () => { clock.textContent = new Intl.DateTimeFormat(RU ? "ru-RU" : "en-GB", { timeZone: "Asia/Tashkent", weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date()) + " TAS"; };
    tick(); setInterval(tick, 15000);

    const menu = (btn, items) => {
      btn.onclick = (ev) => {
        ev.stopPropagation();
        const open = root.querySelector(".os-menu");
        if (open) { open.remove(); root.querySelectorAll(".os-mb-btn").forEach((x) => x.setAttribute("aria-expanded", "false")); if (open.dataset.for === btn.textContent) return; }
        const m = el("div", "os-menu");
        m.dataset.for = btn.textContent;
        m.setAttribute("role", "menu");
        items.forEach((it) => {
          if (it === "-") { m.appendChild(el("hr")); return; }
          const b = el("button", null, `<span>${esc(it[0])}</span>${it[2] ? `<kbd>${it[2]}</kbd>` : ""}`);
          b.setAttribute("role", "menuitem");
          b.onclick = () => { m.remove(); btn.setAttribute("aria-expanded", "false"); it[1](); };
          m.appendChild(b);
        });
        m.style.left = btn.offsetLeft + "px";
        root.appendChild(m);
        btn.setAttribute("aria-expanded", "true");
        m.querySelector("button")?.focus();
      };
    };
    menu(logo, [
      [L.about, () => openApp("readme")],
      "-",
      [L.classic, () => teardown()],
      [L.reboot, () => { teardown(); store.set("balu-booted", "", sessionStorage); start(false); }],
      [L.shutdown, shutdown],
    ]);
    menu(apps, APPS.filter((x) => x.id !== "trash").map((x) => [x.label(), () => openApp(x.id), x.id === "terminal" ? "Ctrl K" : ""]));
    root.addEventListener("click", () => { root.querySelector(".os-menu")?.remove(); root.querySelectorAll(".os-mb-btn").forEach((x) => x.setAttribute("aria-expanded", "false")); });
  }

  // ------------------------------------------------------------------ desktop icons + dock
  function desktopIcons() {
    const wrap = el("div", "os-icons");
    APPS.forEach((app) => {
      const b = el("button", "os-icon" + (app.id === "trash" ? " os-trash" : ""), `${icon(app.icon)}<span>${esc(app.label())}</span>`);
      b.addEventListener("click", () => { wrap.querySelectorAll(".sel").forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); });
      b.addEventListener("dblclick", () => openApp(app.id));
      b.addEventListener("keydown", (ev) => { if (ev.key === "Enter") openApp(app.id); });
      wrap.appendChild(b);
    });
    root.appendChild(wrap);
  }

  function dock() {
    dockEl = el("div", "os-dock");
    DOCK.forEach((id, i) => {
      const app = APPS.find((x) => x.id === id);
      const b = el("button", null, `${icon(app.icon)}<span class="tip">${esc(app.label())}</span>`);
      b.dataset.app = id;
      b.setAttribute("aria-label", app.label());
      b.onclick = () => openApp(id);
      dockEl.appendChild(b);
      if (i === 0) { /* keep order */ }
    });
    dockEl.appendChild(el("div", "sep"));
    const tg = el("button", null, `${icon("plane")}<span class="tip">telegram</span>`);
    tg.setAttribute("aria-label", "Telegram");
    tg.onclick = () => { goal("telegram_click"); window.open(D.tg, "_blank", "noopener"); };
    dockEl.appendChild(tg);
    root.appendChild(dockEl);
  }

  function syncDock() {
    dockEl?.querySelectorAll("button[data-app]").forEach((b) => b.classList.toggle("open", wins.has(b.dataset.app)));
  }

  // ------------------------------------------------------------------ window manager
  function openApp(id, pos = {}) {
    if (wins.has(id)) {
      const w = wins.get(id);
      w.classList.remove("min");
      focus(w);
      w.classList.remove("flash"); void w.offsetWidth; w.classList.add("flash");
      return w;
    }
    const def = APPS.find((x) => x.id === id) || { w: 600, h: 480 };
    const spec = id.startsWith("project:") ? projectWin(id.slice(8)) : CONTENT[id]?.();
    if (!spec) return null;
    const w = el("section", "osw");
    w.setAttribute("role", "dialog");
    w.setAttribute("aria-label", spec.title);
    const bar = el("div", "osw-bar");
    const bc = el("button", "osw-btn c"); bc.setAttribute("aria-label", "close");
    const bm = el("button", "osw-btn m"); bm.setAttribute("aria-label", "minimize");
    const bx = el("button", "osw-btn x"); bx.setAttribute("aria-label", "maximize");
    bar.append(bc, bm, bx, el("span", "osw-title", esc(spec.title)));
    const body = el("div", "osw-body" + (spec.flush ? " flush" : ""));
    body.appendChild(spec.node);
    w.append(bar, body, el("div", "osw-grip"));
    const W = Math.min(spec.w || def.w, innerWidth - 140), H = Math.min(spec.h || def.h, innerHeight - 140);
    const n = wins.size;
    w.style.width = W + "px";
    w.style.height = H + "px";
    w.style.left = clamp(pos.x ?? 150 + n * 34, 0, innerWidth - W) + "px";
    w.style.top = clamp(pos.y ?? 54 + n * 30, 34, innerHeight - H - 80) + "px";
    layer.appendChild(w);
    wins.set(id, w);
    w.dataset.id = id;
    focus(w);
    drag(w, bar);
    resize(w, w.querySelector(".osw-grip"));
    w.addEventListener("pointerdown", () => focus(w));
    bc.onclick = (ev) => { ev.stopPropagation(); closeWin(id); };
    bm.onclick = (ev) => { ev.stopPropagation(); w.classList.add("min"); syncDock(); };
    bx.onclick = (ev) => { ev.stopPropagation(); w.classList.toggle("max"); };
    bar.addEventListener("dblclick", () => w.classList.toggle("max"));
    spec.mount?.(w);
    syncDock();
    goal("os_open_" + id.replace(/[^a-z]/gi, "_"));
    return w;
  }

  function closeWin(id) {
    const w = wins.get(id);
    if (!w) return;
    wins.delete(id);
    w.dispatchEvent(new Event("os-close"));
    w.classList.add("closing");
    setTimeout(() => w.remove(), reduce ? 0 : 160);
    syncDock();
  }

  function focus(w) {
    layer.querySelectorAll(".osw.focused").forEach((x) => x.classList.remove("focused"));
    w.classList.add("focused");
    w.style.zIndex = ++z;
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function drag(w, handle) {
    handle.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".osw-btn") || w.classList.contains("max")) return;
      const sx = ev.clientX - w.offsetLeft, sy = ev.clientY - w.offsetTop;
      handle.setPointerCapture(ev.pointerId);
      const move = (e2) => {
        w.style.left = clamp(e2.clientX - sx, -w.offsetWidth + 120, innerWidth - 120) + "px";
        w.style.top = clamp(e2.clientY - sy, 32, innerHeight - 60) + "px";
      };
      const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  function resize(w, grip) {
    grip.addEventListener("pointerdown", (ev) => {
      ev.stopPropagation();
      const sw = w.offsetWidth, sh = w.offsetHeight, sx = ev.clientX, sy = ev.clientY;
      grip.setPointerCapture(ev.pointerId);
      const move = (e2) => { w.style.width = Math.max(300, sw + e2.clientX - sx) + "px"; w.style.height = Math.max(180, sh + e2.clientY - sy) + "px"; };
      const up = () => { grip.removeEventListener("pointermove", move); grip.removeEventListener("pointerup", up); };
      grip.addEventListener("pointermove", move);
      grip.addEventListener("pointerup", up);
    });
  }

  function toast(html, ms = 4200) {
    const t = el("div", "os-toast", html);
    root.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  // ------------------------------------------------------------------ app contents
  const CONTENT = {
    readme() {
      const n = el("div", "os-readme");
      const banner = document.querySelector(".hero .banner")?.outerHTML || "";
      n.innerHTML = `${banner}<h2>${esc(L.welcome)}</h2>
        <p class="hi" style="color:var(--green)">${esc(D.who[0])}</p><p class="muted">${esc(D.who[1])}</p><p>${esc(D.who[2])}</p>
        <ul class="os-tips">${L.tips.map((x) => `<li>${x}</li>`).join("")}</ul>
        <div class="os-row"><button class="os-btn primary" data-a="projects">./${esc(L.projects)}</button><button class="os-btn" data-a="nda">./${esc(L.nda)}</button><a class="os-btn" href="${D.tg}" target="_blank" rel="noopener">telegram</a></div>`;
      n.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => openApp(b.dataset.a)));
      return { title: "~/readme.txt", node: n };
    },

    projects() {
      const n = el("div", "os-explorer");
      const side = el("div", "os-side");
      const files = el("div", "os-files");
      const status = el("div", "os-status");
      const render = (cat) => {
        files.innerHTML = "";
        const list = D.projects.filter((p) => cat === "all" || p.cat === cat);
        list.forEach((p) => {
          const f = el("button", "os-file", `${icon("file", p.color)}<span>${esc(p.title)}</span><small>${esc(p.lang)}</small>`);
          f.onclick = () => openApp("project:" + p.slug);
          files.appendChild(f);
        });
        status.innerHTML = `<span>${list.length} ${esc(L.items)}</span><span>~/projects/${cat === "all" ? "" : cat}</span>`;
      };
      D.filters.forEach(([k, v], i) => {
        const b = el("button", i === 0 ? "on" : "", esc(v));
        b.onclick = () => { side.querySelectorAll("button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); render(k); };
        side.appendChild(b);
      });
      n.style.gridTemplateRows = "1fr auto";
      n.append(side, files, status);
      render("all");
      return { title: "~/projects", node: n, flush: true };
    },

    nda() {
      const n = el("div");
      const head = el("div", "os-nda-head", `<span class="muted">${D.cases.length} ${RU ? "кейсов под NDA" : "cases under NDA"}</span>`);
      const btn = el("button", "os-btn", esc(L.decrypt));
      btn.onclick = () => { const s = el("span", "os-denied", esc(L.denied)); btn.replaceWith(s); goal("nda_decrypt"); setTimeout(() => s.replaceWith(btn), 1600); };
      head.appendChild(btn);
      const list = el("div", "os-nda-list");
      D.cases.forEach((c, i) => {
        const it = el("div", "os-nda-item", `<p class="meta">${esc(c.sector)} · ${esc(c.region)} <span class="tag">${esc(c.tag)}</span></p>
          <p class="meta">${RU ? "клиент" : "client"}: <span class="redact" tabindex="0"><span>██████████</span></span></p>
          <p class="ttl" data-final="${esc(c.title)}"></p><p class="txt">${esc(c.text)}</p>
          <ul class="stack">${c.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`);
        list.appendChild(it);
        scramble(it.querySelector(".ttl"), c.title, 120 + i * 70);
      });
      n.append(head, list);
      return { title: "~/nda.archive (encrypted)", node: n };
    },

    terminal() { return terminalApp(); },

    history() {
      const n = el("div");
      n.innerHTML = `<h2>~/.history</h2><ul class="os-hist">${D.history.map(([w, r, x]) => `<li><span class="w">${esc(w)}</span><div><p class="r">${esc(r)}</p><p class="x">${esc(x)}</p></div></li>`).join("")}</ul>
        <h3>git log --since=2026-06</h3><ul class="os-up">${D.log.map(([m, items]) => items.map((x) => `<li><span class="n">${m}</span>${esc(x.replace("[NDA]", "").trim())}${x.includes("[NDA]") ? ' <span class="muted">[nda]</span>' : ""}</li>`).join("")).join("")}</ul>`;
      return { title: "~/history.log", node: n };
    },

    services() {
      const n = el("div");
      n.innerHTML = `<h2>man balu</h2><div class="os-svc">${D.services.map(([t, d]) => `<div><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}</div>
        <h3>./process.sh</h3><ul class="os-hist">${D.process.map(([k, d], i) => `<li><span class="w">0${i + 1} ./${esc(k)}</span><div><p class="x">${esc(d)}</p></div></li>`).join("")}</ul>`;
      return { title: "~/services.man", node: n };
    },

    upstream() {
      const n = el("div");
      n.innerHTML = `<h2>git log --upstream</h2><ul class="os-up">${D.upstream.map(([r, num, t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(r)}<span class="n">${esc(num)}</span>${esc(t)}</a></li>`).join("")}</ul>`;
      return { title: "~/upstream", node: n };
    },

    contact() {
      const n = el("div");
      n.innerHTML = `<p class="cmd" style="color:var(--dim);margin:0 0 6px">$ ./hire --project "your idea"</p>
        <h2>${RU ? "Нужно, чтобы работало в продакшене?" : "Got something that has to work in production?"}</h2>
        <p class="muted">${RU ? "Пара строк о задаче в Telegram: что сделать и к какому сроку." : "Two lines about the task on Telegram: what it should do and when you need it."}</p>
        <div class="os-row"><a class="os-btn primary" href="${D.tg}" target="_blank" rel="noopener">telegram @Abdulaziz6301</a><button class="os-btn" data-copy>${esc(L.copy)}</button></div>
        <div class="os-row"><a class="os-btn" href="mailto:${D.mail}">${esc(D.mail)}</a><a class="os-btn" href="${D.li}" target="_blank" rel="noopener">linkedin</a><a class="os-btn" href="${D.gh}" target="_blank" rel="noopener">github</a></div>`;
      const c = n.querySelector("[data-copy]");
      c.onclick = async () => { try { await navigator.clipboard.writeText(D.mail); c.textContent = L.copied; goal("email_copy"); } catch (_) { c.textContent = D.mail; } };
      return { title: "~/contact.sh", node: n };
    },

    trash() {
      const n = el("div");
      n.innerHTML = `<p class="muted">${esc(L.trashText)}</p><div class="os-row"><button class="os-btn">${esc(L.emptyTrash)}</button></div>`;
      n.querySelector("button").onclick = (ev) => { ev.target.replaceWith(el("span", "hi", esc(L.trashDone))); };
      return { title: "~/.trash", node: n };
    },
  };

  function projectWin(slug) {
    const p = D.projects.find((x) => x.slug === slug);
    if (!p) return null;
    const n = el("div", "os-proj");
    const caseBtn = p.case ? `<a class="os-btn primary" href="${D.prefix}work/${p.case}/">${esc(L.caseStudy)}</a>` : "";
    n.innerHTML = `<h2>${esc(p.title)}${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}</h2>
      <p>${esc(p.text)}</p><ul class="facts">${p.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <div class="os-row">${caseBtn}${p.links.map(([l, u]) => `<a class="os-btn" href="${u}" target="_blank" rel="noopener">↗ ${esc(l)}</a>`).join("")}</div>`;
    let stop = () => {};
    const viz = VIZ[slug];
    if (viz) {
      const box = el("div", "os-viz");
      n.appendChild(box);
      stop = viz(box) || stop;
    }
    return { title: `~/projects/${p.slug}`, node: n, w: 640, h: viz ? 600 : 420, mount: (w) => w.addEventListener("os-close", () => stop()) };
  }

  // ------------------------------------------------------------------ live proofs
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const VIZ = {
    "quasar-solver"(box) {
      const cv = el("canvas"); box.appendChild(cv);
      const cap = el("div", "os-viz-cap", "<span>2-opt annealing, 18 cities</span><span class=len></span>"); box.appendChild(cap);
      const ctx = cv.getContext("2d");
      let pts = [], tour = [], T = 1, raf, it = 0;
      const reset = () => { pts = Array.from({ length: 18 }, () => [Math.random(), Math.random()]); tour = pts.map((_, i) => i).sort(() => Math.random() - 0.5); T = 1; it = 0; };
      const d = (a, b) => Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
      const len = () => tour.reduce((s, c, i) => s + d(c, tour[(i + 1) % tour.length]), 0);
      reset();
      const step = () => {
        for (let k = 0; k < 40; k++) {
          const i = 1 + Math.floor(Math.random() * (tour.length - 2)), j = i + 1 + Math.floor(Math.random() * (tour.length - i - 1));
          const a = tour[i - 1], b = tour[i], c = tour[j], e2 = tour[(j + 1) % tour.length];
          const delta = d(a, c) + d(b, e2) - d(a, b) - d(c, e2);
          if (delta < 0 || Math.random() < Math.exp(-delta / (T * 0.08))) tour = tour.slice(0, i).concat(tour.slice(i, j + 1).reverse(), tour.slice(j + 1));
        }
        T *= 0.985; it++;
        const W = cv.width = cv.clientWidth * devicePixelRatio, H = cv.height = cv.clientHeight * devicePixelRatio;
        const px = (p) => [16 * devicePixelRatio + p[0] * (W - 32 * devicePixelRatio), 16 * devicePixelRatio + p[1] * (H - 32 * devicePixelRatio)];
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = css("--green"); ctx.lineWidth = 1.5 * devicePixelRatio; ctx.shadowColor = css("--green"); ctx.shadowBlur = 8;
        ctx.beginPath(); tour.forEach((c, i) => { const [x, y] = px(pts[c]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.stroke();
        ctx.shadowBlur = 0; ctx.fillStyle = css("--amber");
        pts.forEach((p) => { const [x, y] = px(p); ctx.beginPath(); ctx.arc(x, y, 3 * devicePixelRatio, 0, 7); ctx.fill(); });
        cap.querySelector(".len").textContent = `T=${T.toFixed(3)} · length ${len().toFixed(3)}`;
        if (T < 0.002) { setTimeout(() => { reset(); raf = requestAnimationFrame(step); }, 1400); return; }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    },
    "cobol-equiv"(box) {
      const tk = el("div", "os-ticker"); box.appendChild(tk);
      const cap = el("div", "os-viz-cap", "<span>differential run vs GnuCOBOL 3.1.2 (replay)</span><span class=c></span>"); box.appendChild(cap);
      const rules = ["MOVE num→num", "COMP-3 pack", "ROUNDED", "ON SIZE ERROR", "PICTURE edit", "STRING", "UNSTRING", "INSPECT", "COMPUTE", "DIVIDE REMAINDER"];
      let n = 0, timer;
      const tick = () => {
        n = Math.min(9769, n + 37 + Math.floor(Math.random() * 40));
        const r = rules[Math.floor(Math.random() * rules.length)];
        const p = el("p", null, `<span class="ok">[✓]</span> case ${String(n).padStart(4, "0")}  ${esc(r)}  bytes equal`);
        tk.appendChild(p);
        while (tk.children.length > 9) tk.firstChild.remove();
        cap.querySelector(".c").textContent = `${n.toLocaleString("en")} / 9,769 · 0 diffs`;
        if (n < 9769) timer = setTimeout(tick, 60); else timer = setTimeout(() => { n = 0; tk.innerHTML = ""; tick(); }, 2500);
      };
      tick();
      return () => clearTimeout(timer);
    },
    "pricing-crosscheck"(box) {
      const cv = el("canvas"); box.appendChild(cv);
      box.appendChild(el("div", "os-viz-cap", "<span>QuantLib LR tree error vs steps (log scale)</span><span><b style='color:var(--red)'>even</b> · <b style='color:var(--green)'>odd</b></span>"));
      const even = [[50, 0.2439], [100, 0.1233], [200, 0.06198], [400, 0.03108], [800, 0.01557], [1600, 0.007791]];
      const odd = [[51, 2.14e-4], [101, 5.55e-5], [201, 1.41e-5], [401, 3.56e-6], [801, 8.94e-7], [1601, 2.24e-7]];
      let prog = 0, raf;
      const draw = () => {
        const dpr = devicePixelRatio, W = cv.width = cv.clientWidth * dpr, H = cv.height = cv.clientHeight * dpr, ctx = cv.getContext("2d");
        const lx = (v) => 30 * dpr + (Math.log10(v) - 1.6) / (3.3 - 1.6) * (W - 50 * dpr), ly = (v) => 12 * dpr + (-0.5 - Math.log10(v)) / (7 - 0.5) * (H - 30 * dpr);
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = css("--line"); ctx.lineWidth = dpr;
        for (let e = 1; e <= 7; e++) { ctx.beginPath(); ctx.moveTo(30 * dpr, ly(10 ** -e)); ctx.lineTo(W - 20 * dpr, ly(10 ** -e)); ctx.stroke(); }
        const series = (pts, col) => {
          const k = Math.max(1, Math.ceil(pts.length * prog));
          ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2 * dpr; ctx.shadowColor = col; ctx.shadowBlur = 8;
          ctx.beginPath(); pts.slice(0, k).forEach(([s, v], i) => (i ? ctx.lineTo(lx(s), ly(v)) : ctx.moveTo(lx(s), ly(v)))); ctx.stroke();
          pts.slice(0, k).forEach(([s, v]) => { ctx.beginPath(); ctx.arc(lx(s), ly(v), 3 * dpr, 0, 7); ctx.fill(); });
          ctx.shadowBlur = 0;
        };
        series(even, css("--red")); series(odd, css("--green"));
        prog = Math.min(1, prog + 0.02);
        if (prog < 1) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(raf);
    },
  };

  function scramble(node, final, delay) {
    const chars = "▓▒░█<>/\\|=+*#%01";
    node.textContent = "";
    setTimeout(() => {
      let f = 0;
      const total = reduce ? 1 : 14;
      const t = setInterval(() => {
        f++;
        const k = Math.floor(final.length * (f / total));
        node.textContent = final.slice(0, k) + Array.from({ length: Math.max(0, final.length - k) }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        if (f >= total) { clearInterval(t); node.textContent = final; }
      }, 40);
    }, reduce ? 0 : delay);
  }

  // ------------------------------------------------------------------ terminal app
  function terminalApp() {
    const n = el("div", "os-term");
    const out = el("div", "os-term-out");
    const form = el("form", "os-term-in", `<span style="color:var(--green2)">balu@tashkent:~$</span><input type="text" spellcheck="false" autocomplete="off" aria-label="command" />`);
    n.append(out, form);
    const input = form.querySelector("input");
    const hist = [];
    let hi = 0;
    const print = (t, c = "o") => { const p = el("p", c); p.textContent = t; out.appendChild(p); out.scrollTop = out.scrollHeight; };
    const targets = () => APPS.map((a) => a.id).concat(D.projects.map((p) => p.slug));
    const cmds = {
      help: () => [["commands:", "am"], ["  ls                list projects"], ["  open <name>       open an app or project (tab completes)"], ["  whoami · contact · nda · history · services"],
                   ["  theme amber|green switch phosphor"], ["  matrix            you know"], ["  sudo hire-me      the fastest way"], ["  classic           leave BALU-OS"], ["  clear · reboot · shutdown"]],
      ls: () => [[D.projects.map((p) => p.slug).join("  ")]],
      whoami: () => [[D.who[0], "hi"], [D.who[1]]],
      contact: () => { openApp("contact"); return [["telegram  @Abdulaziz6301", "hi"], ["mail      " + D.mail]]; },
      nda: () => { openApp("nda"); return [[`${D.cases.length} files, encrypted`, "am"]]; },
      history: () => { openApp("history"); return []; },
      services: () => { openApp("services"); return []; },
      open: (a) => {
        const q = (a[0] || "").toLowerCase();
        const app = APPS.find((x) => x.id.startsWith(q) || x.label().startsWith(q));
        if (q && app) { openApp(app.id); return [["opening " + app.id, "hi"]]; }
        const p = D.projects.find((x) => x.slug.startsWith(q));
        if (q && p) { openApp("project:" + p.slug); return [["opening ~/projects/" + p.slug, "hi"]]; }
        return [["usage: open <" + targets().slice(0, 6).join("|") + "|...>", "er"]];
      },
      theme: (a) => {
        const t = a[0] === "amber" ? "amber" : "green";
        if (t === "amber") document.documentElement.dataset.theme = "amber"; else delete document.documentElement.dataset.theme;
        store.set("balu-theme", t); goal("theme_" + t);
        return [[`phosphor set to ${t}`, "hi"]];
      },
      matrix: () => { matrix(); goal("matrix"); return [["wake up, recruiter...", "hi"]]; },
      sudo: (a) => {
        if (a[0] === "hire-me") { goal("sudo_hire_me"); setTimeout(() => window.open(D.tg, "_blank", "noopener"), 700); return [["[sudo] password for recruiter: ********", "o"], ["access granted. opening telegram...", "hi"]]; }
        return [["recruiter is not in the sudoers file. try: sudo hire-me", "er"]];
      },
      classic: () => { store.set("balu-view", "classic"); setTimeout(teardown, 300); return [["switching to classic view...", "am"]]; },
      reboot: () => { setTimeout(() => { teardown(); start(false); }, 300); return [["rebooting...", "am"]]; },
      shutdown: () => { setTimeout(shutdown, 300); return [["bye.", "am"]]; },
      date: () => [[new Date().toLocaleString("en-GB", { timeZone: "Asia/Tashkent" }) + " (Tashkent)"]],
      echo: (a) => [[a.join(" ")]],
      pwd: () => [["/home/balu"]],
      exit: () => { setTimeout(() => closeWin("terminal"), 200); return [["logout", "o"]]; },
      rm: () => [["rm: refusing to delete production. good instinct though.", "er"]],
      vim: () => [["you are now stuck in vim. just kidding. :q", "am"]],
      cowsay: (a) => [[" _______\n< " + (a.join(" ") || "hire balu") + " >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||"]],
    };
    print("BALU-OS terminal. type help", "am");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const raw = input.value.trim();
      input.value = "";
      if (!raw) return;
      hist.push(raw); hi = hist.length;
      print("balu@tashkent:~$ " + raw, "o");
      const [name, ...args] = raw.split(/\s+/);
      if (name === "clear") { out.innerHTML = ""; return; }
      const fn = cmds[name.toLowerCase()];
      (fn ? fn(args) : [[`zsh: command not found: ${name}. type help`, "er"]]).forEach(([t, c]) => print(t, c));
    });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowUp") { hi = Math.max(0, hi - 1); input.value = hist[hi] || ""; ev.preventDefault(); }
      if (ev.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; ev.preventDefault(); }
      if (ev.key === "Tab") {
        ev.preventDefault();
        const [c, q = ""] = input.value.split(/\s+/);
        if (c === "open") { const m = targets().filter((x) => x.startsWith(q)); if (m.length === 1) input.value = "open " + m[0]; else if (m.length) print(m.join("  ")); }
        else { const m = Object.keys(cmds).filter((x) => x.startsWith(c)); if (m.length === 1) input.value = m[0] + " "; }
      }
    });
    return { title: "balu@tashkent: ~ (zsh)", node: n, flush: true, mount: (w) => setTimeout(() => input.focus(), 50) };
  }

  // ------------------------------------------------------------------ effects
  function boot(done) {
    const b = el("div", "os-boot");
    const lines = [
      ["BALU-OS BIOS v26.10  (c) 2026 Abdulaziz Abdujalilov", "am"], ["", ""],
      ["CPU: human, 1 core, caffeinated ............. OK", "ok"], ["Memory test: 9769 COBOL cases ................ 0 diffs", "ok"],
      ["Detecting languages: en ru uz ................ OK", "ok"], ["Mounting /home/balu/projects ................. OK", "ok"],
      ["Mounting /nda (encrypted) .................... LOCKED", "am"], ["Starting telegram daemon on @Abdulaziz6301 ... OK", "ok"],
      ["Loading desktop", "dim"],
    ];
    b.innerHTML = lines.map(([t, c], i) => `<p class="${c}" style="animation-delay:${0.55 + i * 0.13}s">${esc(t) || "&nbsp;"}</p>`).join("") +
      `<div class="bar"><i></i></div><span class="skip">${esc(L.skip)}</span>`;
    root.appendChild(b);
    const bar = b.querySelector(".bar i");
    let p = 0;
    const iv = setInterval(() => { p = Math.min(100, p + 7 + Math.random() * 9); bar.style.width = p + "%"; }, 120);
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true; clearInterval(iv);
      b.style.transition = "opacity .35s"; b.style.opacity = "0";
      setTimeout(() => { b.remove(); done(); }, 350);
      removeEventListener("keydown", finish); b.removeEventListener("click", finish);
    };
    setTimeout(finish, 0.55 * 1000 + lines.length * 130 + 700);
    addEventListener("keydown", finish);
    b.addEventListener("click", finish);
  }

  function shutdown() {
    goal("os_shutdown");
    const o = el("div", "os-off", `<div>${esc(L.off)}<small>${esc(L.offSub)}</small></div>`);
    root.appendChild(o);
    const again = () => { removeEventListener("keydown", again); o.removeEventListener("click", again); teardown(); };
    setTimeout(() => { addEventListener("keydown", again); o.addEventListener("click", again); }, 600);
  }

  function matrix() {
    const cv = el("canvas", "os-matrix");
    root.appendChild(cv);
    const ctx = cv.getContext("2d");
    const W = cv.width = innerWidth, H = cv.height = innerHeight, fs = 16, cols = Math.floor(W / fs);
    const drops = Array(cols).fill(0).map(() => Math.random() * -40);
    const glyphs = "アカサタナハマヤラワ0123456789BALU<>/{}";
    let raf;
    const end = Date.now() + 5200;
    const step = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = css("--green"); ctx.font = fs + "px monospace";
      drops.forEach((y, i) => { ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * fs, y * fs); drops[i] = y * fs > H && Math.random() > 0.975 ? 0 : y + 1; });
      if (Date.now() < end) raf = requestAnimationFrame(step); else { cv.style.transition = "opacity .6s"; cv.style.opacity = "0"; setTimeout(() => cv.remove(), 600); }
    };
    raf = requestAnimationFrame(step);
  }

  function screensaver() {
    if (saverOn || !root) return;
    saverOn = true;
    const s = el("div", "os-saver");
    const src = document.querySelector(".hero .banner");
    const box = el("div", "bounce");
    if (src) box.appendChild(src.cloneNode(true));
    s.append(box, el("p", null, esc(L.saver)));
    root.appendChild(s);
    let x = 80, y = 80, vx = 1.6, vy = 1.3, raf;
    const hues = ["--green", "--amber", "--green2"];
    let h = 0;
    const step = () => {
      const bw = box.offsetWidth, bh = box.offsetHeight;
      x += vx; y += vy;
      if (x <= 0 || x + bw >= innerWidth) { vx = -vx; h++; }
      if (y <= 0 || y + bh >= innerHeight) { vy = -vy; h++; }
      box.style.transform = `translate(${x}px, ${y}px)`;
      box.style.filter = h % 3 ? `drop-shadow(0 0 10px ${css(hues[h % 3])})` : "";
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const exit = () => { cancelAnimationFrame(raf); s.remove(); saverOn = false; removeEventListener("pointermove", exit); removeEventListener("keydown", exit); idle(); };
    setTimeout(() => { addEventListener("pointermove", exit); addEventListener("keydown", exit); }, 400);
  }

  function idle() {
    clearTimeout(idleTimer);
    if (reduce) return;
    idleTimer = setTimeout(screensaver, 60000);
  }

  function keys() {
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let kp = 0;
    addEventListener("pointermove", () => { if (!saverOn) idle(); }, { passive: true });
    addEventListener("keydown", (ev) => {
      if (!root || !document.body.contains(root)) return;
      if (!saverOn) idle();
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); const w = openApp("terminal"); w?.querySelector("input")?.focus(); }
      if (ev.key === "Escape") { const f = layer.querySelector(".osw.focused"); if (f) closeWin(f.dataset.id); }
      kp = ev.key === konami[kp] ? kp + 1 : (ev.key === konami[0] ? 1 : 0);
      if (kp === konami.length) {
        kp = 0; goal("konami");
        root.classList.add("glitch"); setTimeout(() => root.classList.remove("glitch"), 1600);
        toast(RU ? "<b>+30 жизней.</b> Секрет найден. Напишите в Telegram кодовое слово <b>KONAMI</b>." : "<b>+30 lives.</b> You found the secret. Say <b>KONAMI</b> on Telegram.");
      }
    });
  }

  // ------------------------------------------------------------------ init (after all declarations)
  // Retro mode is opt-in: launched from the command palette or the footer link.
  window.baluOS = { capable, start: () => start(false), stop: teardown };
  if (/[?&]os\b/.test(location.search) && capable) start(false);
})();
