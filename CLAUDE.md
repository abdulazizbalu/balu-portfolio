# balu-portfolio

Static portfolio of Abdulaziz Abdujalilov (Balu), served from `balu.is-a.dev` (GitHub Pages, `CNAME`). Plain HTML, CSS and JavaScript with no build step: `index.html`, `work/*/`, `services/*/`, `404.html` and the `/ru/` mirror, styles in `assets/style.css`, behaviour in `assets/main.js`. Run `npm test` before every push.

Read [`PRODUCT.md`](PRODUCT.md) first: audience, positioning, constraints and evidence on hand. Project design skills live in `.claude/skills/`: `impeccable` (critique, audit, polish and the rest) and `design-taste-frontend`.

## Commits and pull requests

- No `Co-Authored-By` trailers in commit messages.
- No links to Claude sessions anywhere: commits, PR titles, PR descriptions, comments.
- No "Generated with Claude Code" (or similar) signature in PR descriptions. If the server appends one when the PR is created, edit the description right after creation to remove it, then re-read the PR to confirm it is gone.

## Design: the engineer's notebook stays

The notebook style is a deliberate brand choice. Do not remove, replace or "modernise" any of it:

- graph-paper grid, red margin line, cream paper (`--paper: #fbfaf5`) and the blueprint "lights off" mode;
- IBM Plex Mono for labels, nav and meta; numbered sections (the mono `01 ·` in each heading, ①② entry numbers, handwritten margin dates);
- Caveat handwriting accents (including the struck "hope" / handwritten "prove" headline);
- tape, taped and tilted paper cards with shadows, ruled index cards, stamps (NDA), sticky notes, dashed rules.

Rules in `design-taste-frontend` (or any other skill) that forbid these (no monospace, no 01/02 numbering, no cream, no resting shadows, no thin or dashed rules, no third typeface) do not apply to this site. Use the skills for what still fits: contrast, layout faults, accessibility, performance, copy.

## Content rules

- All site copy is in English. `/ru/` is a secondary mirror for Russian-speaking clients.
- NDA work is described by sector, system type and stack only. Never add more detail than the site already gives: no client names, screenshots or internals.
- Never mention Corpadvisor (also covered by `npm test`).
- The only contact email is `abdushkin2001@gmail.com`; no other address, no domain email.
