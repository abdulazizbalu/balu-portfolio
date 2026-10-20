(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const term = document.getElementById("term");
  const form = document.getElementById("prompt");
  const input = document.getElementById("cmd");
  const PS = "balu@tashkent:~$";

  const REPOS = {
    "cobol-equiv": "https://github.com/abdulazizbalu/cobol-equiv",
    "pricing-crosscheck": "https://github.com/abdulazizbalu/pricing-crosscheck",
    "quasar-solver": "https://github.com/abdulazizbalu/quasar-solver",
    nur: "https://github.com/abdulazizbalu/nur",
    telegram: "https://telegram-tt-xi.vercel.app",
    "ai-eval-lab": "https://github.com/abdulazizbalu/ai-eval-lab",
    "rag-knowledge-agent": "https://github.com/abdulazizbalu/rag-knowledge-agent",
    "agent-workflow-studio": "https://github.com/abdulazizbalu/agent-workflow-studio",
    "ai-campaign-orchestrator": "https://github.com/abdulazizbalu/ai-campaign-orchestrator",
    github: "https://github.com/abdulazizbalu",
  };

  const line = (text, cls = "out") => {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = text;
    term.appendChild(p);
    return p;
  };
  const promptLine = (cmd) => {
    const p = document.createElement("p");
    p.className = "line";
    const s = document.createElement("span");
    s.className = "ps";
    s.textContent = PS;
    p.append(s, " " + cmd);
    term.appendChild(p);
  };
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  const COMMANDS = {
    help: () => [
      ["commands:", "amb"],
      ["whoami      who is this"],
      ["ls          public projects"],
      ["open <name> open a repo, e.g. open cobol-equiv"],
      ["clients     work under NDA"],
      ["services    what you can hire me for"],
      ["log         recent history"],
      ["contact     how to reach me"],
      ["clear       clear the screen"],
    ],
    whoami: () => [["Abdulaziz Abdujalilov, aka Balu", "hi"], ["AI Specialist :: Full-Stack Developer :: LLMOps, Tashkent"]],
    ls: () => [[Object.keys(REPOS).filter((k) => k !== "github").join("  ")]],
    clients: () => { go("nda"); return [["11 cases, names redacted. scrolling to ./clients", "amb"]]; },
    nda: () => COMMANDS.clients(),
    services: () => { go("services"); return [["AI systems · full-stack · Telegram bots · niche verification · compliance tooling · local-first AI"]]; },
    log: () => { go("log"); return [["git log --since=2026-06 opened below"]]; },
    contact: () => [["telegram  @Abdulaziz6301", "hi"], ["mail      abdushkin2001@gmail.com"], ["github    github.com/abdulazizbalu"]],
    hire: () => COMMANDS["sudo"](["hire-me"]),
    sudo: (args) => {
      if ((args[0] || "") === "hire-me") {
        setTimeout(() => window.open("https://t.me/Abdulaziz6301", "_blank", "noopener"), 700);
        return [["[sudo] permission granted. opening telegram...", "hi"]];
      }
      return [["nice try. try: sudo hire-me", "err"]];
    },
    open: (args) => {
      const key = Object.keys(REPOS).find((k) => k.startsWith((args[0] || "").toLowerCase()));
      if (!args[0] || !key) return [["usage: open <" + Object.keys(REPOS).join("|") + ">", "err"]];
      window.open(REPOS[key], "_blank", "noopener");
      return [["opening " + REPOS[key], "hi"]];
    },
    date: () => [[new Date().toLocaleString("en-GB", { timeZone: "Asia/Tashkent" }) + " (Tashkent)"]],
    echo: (args) => [[args.join(" ")]],
    pwd: () => [["/home/balu"]],
    exit: () => [["there is no exit. only shipping.", "amb"]],
    rm: () => [["rm: refusing to delete production. good instinct though.", "err"]],
  };

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    promptLine(cmd);
    const [name, ...args] = cmd.split(/\s+/);
    if (name === "clear") { term.replaceChildren(); return; }
    const fn = COMMANDS[name.toLowerCase()];
    const out = fn ? fn(args) : [[`command not found: ${name}. type help`, "err"]];
    out.forEach(([t, c]) => line(t, "out" + (c ? " " + c : "")));
    while (term.children.length > 40) term.firstChild.remove();
    term.scrollTop = term.scrollHeight;
  };

  form?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    run(input.value);
    input.value = "";
  });

  // retype the boot sequence (static HTML stays as no-JS fallback)
  const boot = async () => {
    const items = [...term.children].map((p) => ({ cls: p.className, cmd: p.classList.contains("line"), text: p.classList.contains("line") ? p.textContent.replace(PS, "").trim() : p.textContent }));
    if (reduce) return;
    term.replaceChildren();
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const it of items) {
      if (it.cmd) {
        const p = document.createElement("p");
        p.className = "line";
        const s = document.createElement("span");
        s.className = "ps";
        s.textContent = PS + " ";
        const t = document.createElement("span");
        p.append(s, t);
        term.appendChild(p);
        await sleep(250);
        for (const ch of it.text) { t.textContent += ch; await sleep(45 + Math.random() * 40); }
        await sleep(200);
      } else {
        line(it.text, it.cls);
        await sleep(160);
      }
    }
  };
  boot();

  // glitch the banner now and then
  const banner = document.querySelector(".banner");
  if (banner && !reduce) {
    setInterval(() => {
      banner.classList.add("glitch");
      setTimeout(() => banner.classList.remove("glitch"), 260);
    }, 6500);
  }

  // project filters
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("on", c === chip));
    const f = chip.dataset.filter;
    document.querySelectorAll("#grid .card").forEach((card) => {
      card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f);
    });
  }));

  // reveal on scroll
  if (!reduce && "IntersectionObserver" in window) {
    const els = document.querySelectorAll(".card, .case, .svc, .process li, .log-month, .upstream li, .format, .contact .win");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
