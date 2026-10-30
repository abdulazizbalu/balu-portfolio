# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: people who hire freelance developers for teams in the US and Europe (founders, product leads, engineering managers at small and mid-size companies). They arrive from search, GitHub, LinkedIn or a referral, usually comparing several remote developers, and need to decide quickly whether this one can be trusted with a production project and how to start.

Secondary: Russian-speaking clients, served by the `/ru/` mirror. It stays, but it is not the main focus.

## Product Purpose

Personal portfolio of Abdulaziz Abdujalilov (Balu), a freelance full-stack and AI developer based in Tashkent. It sells three kinds of work: Telegram bots and Mini Apps, websites and web apps, and AI features (RAG, agents, evals). Success is a client sending an email about a project.

## Positioning

"I build software, then I prove it works." The differentiator is verifiability: every claim is backed by tests, evals, a reference to compare against, and reproducible numbers (cobol-equiv: 9,769 cases, 0 diffs vs GnuCOBOL; pricing-crosscheck: 27k+ grid points, 8 documented findings; quasar-solver: gap 86.7% → 3.7% against proven optima). Typical timelines are stated up front (1–2 weeks for most builds), with a fixed scope and date after a 20-minute call.

## Operating Context

- Primary action: email (`abdushkin2001@gmail.com`). A 20-minute intro call via cal.com and Telegram (`t.me/Abdulaziz6301`) are secondary.
- Time zone UTC+5: full overlap with Europe, US East Coast mornings. Languages: English, Russian, Uzbek.
- Hand-over on every project: code, docs, a runbook and tests.
- Deployed as a static site at https://balu.is-a.dev (GitHub Pages, custom domain).

## Capabilities and Constraints

- Plain static HTML, CSS and JavaScript, no framework or build step. Pages: home, `services/*`, `work/*` case studies, `404`, plus the `/ru/` mirror. `npm test` checks content and SEO basics.
- All copy on the English site is in English.
- Client work is under NDA: it is described by industry and system type only, with no names, screenshots or internals, and never in more detail than the site gives today. Employers in the work history are anonymised on purpose.
- Prices are deliberately not published; timelines are.
- The site works without JavaScript; motion respects `prefers-reduced-motion`.

## Brand Commitments

- The "engineer's notebook" style (graph paper, a red margin line, typed notes with handwritten accents, a "lights off" blueprint mode) is a deliberate choice and must be kept. Refinements work inside it; it is not up for replacement.
- Name: Abdulaziz Abdujalilov, also "Balu". Voice: first person, plain and specific, numbers over adjectives.
- Positioning line on the site: AI Specialist · Full-Stack Developer · LLMOps · Digital Media Strategist.

## Evidence on Hand

- Open-source case studies with code and numbers: `work/cobol-equiv`, `work/pricing-crosscheck`, `work/quasar-solver`, `work/nur`, `work/telegram-web-a` (7 upstream PRs to Ajaxy/telegram-tt), `work/ai-eval-lab`, `work/rag-knowledge-agent`, `work/agent-workflow-studio`, `work/ai-campaign-orchestrator`, `work/llmops-toolkit`.
- Upstream contributions: 7 PRs to Ajaxy/telegram-tt, QuantLib issue #2902.
- NDA work listed by sector only (HR-tech, legal, construction, education, media, local businesses).
- No client testimonials, logos or reviews exist. Do not invent them.

## Product Principles

1. Proof over promises: every claim links to code, a number or a reproducible run.
2. Email is the shortest path; nothing on the page should stand between a ready visitor and writing two lines.
3. Say what is under NDA plainly instead of padding it; never reveal more than today.
4. Keep the notebook: personality comes from the existing hand-made world, not from new trends.
5. English first for US and Europe; the Russian mirror is secondary.
