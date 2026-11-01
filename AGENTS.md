# Website working agreements

- Read `PRODUCT.md` and `DESIGN.md` before changing positioning or visual design.
- Use `.agents/skills/impeccable/SKILL.md` for design work. The vendored upstream skill is pinned in README; do not silently upgrade it.
- Preserve truthful stage labels. Demo content is illustrative, not an approved customer case or a claim of production capability.
- Keep user input browser-local unless the user explicitly requests and authorizes a backend integration.
- Public contact details belong in `public/site-config.js`. Never invent an email, company registration, customer quote, or performance statistic.
- This is a static site with no runtime dependencies. `npm run check` and `npm run build` must pass before a code handoff.
- Build output is `dist/`; do not commit build output, preview state, downloaded test data, or QA harnesses.
- Verify representative desktop and narrow layouts and keyboard interactions after meaningful UI changes.
