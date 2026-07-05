# Contributing to Hooklane

PRs and issues welcome.

## Workflow

1. Branch from `main`: `git checkout -b feat/your-feature`
2. Make changes, keep commits focused
3. Rebase on latest `main` before submitting
4. Open a Pull Request

## Commit Messages

Follow Conventional Commits:

```
feat: add share card download
fix: handle empty artist search
chore: update dependencies
```

## Code Style

- ESLint via Oxlint: `npm run lint`
- No commented-out code
- Descriptive variable names, no abbreviations
- Async/await, no `.then()` chains

## Testing

Run tests before pushing:

```bash
npm test
```

## Before Submitting

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Tested in browser (Chrome + Safari)
- [ ] No console errors

## Questions

Open an issue with the `question` label.
