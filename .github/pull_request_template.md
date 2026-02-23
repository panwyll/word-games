## Summary

<!-- Describe the change and why it was made. -->

## Definition of Done

> **Do not request a review until every box is checked.**

- [ ] **Vercel deployment check is ✅ successful** — check the "Vercel" status on this PR's commit (posted automatically by the Vercel GitHub app). This is the canonical build gate; do not request review if it is failing or pending.
- [ ] `E2E tests (Playwright)` CI check is ✅ green
- [ ] No TypeScript errors (`npx tsc --noEmit --skipLibCheck`)
- [ ] No lint errors (`npm run lint`)
- [ ] Self-reviewed the diff

## Screenshots (if UI changes)

<!-- Paste before/after screenshots here. -->
