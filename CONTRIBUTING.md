# Contributing to AION

Thank you for contributing to AION.

## Project direction

AION is intended to stay openly accessible and open to shared contribution.
The current project reference is:

- Patrick Wirth
- patrickwirth_93@icloud.com

## Ground rules

- Keep changes understandable and reviewable.
- Prefer small pull requests over large undifferentiated dumps.
- Do not commit secrets, private keys or personal data that should not be public.
- Preserve license notices and project reference files.
- Keep the project human-centered and aligned with the documented governance and privacy principles.

## Development workflow

1. Fork the repository or create a topic branch.
2. Install dependencies with `pnpm install`.
3. Run:
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
4. Update docs when behavior or structure changes.
5. Open a pull request with a clear summary.

## First contribution path

If you are new to the project, start with one of these tracks:

- public website and contributor onboarding polish
- documentation, release notes, and onboarding flow improvements
- UI consistency and small product-surface fixes
- contained trust-hardening changes with clear verification

Good first contributions should usually avoid broad refactors across unrelated modules.

## Local setup

1. Copy the environment file:
   - `Copy-Item .env.example .env`
2. Generate the Prisma client:
   - `pnpm --filter @aion/api prisma:generate`
3. Start the workspaces when needed:
   - `pnpm dev`

If PowerShell blocks the package-manager shim on your machine, use:

- `pnpm.cmd`
- `npm.cmd`

## Commit guidance

- Write direct commit messages.
- Group related changes together.
- Avoid mixing refactors and product changes unless tightly coupled.

## Pull requests should include

- What changed
- Why it changed
- How it was verified
- Any follow-up work or open risks

## Verification baseline

For most contribution paths, run at least:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

For web-facing work:

- `pnpm --filter @aion/web test`

For API persistence and trust changes:

- `pnpm --filter @aion/api verify:persistence`

## Licensing

By contributing, you agree that your contribution is provided under the same
AION Community Fairness License 1.0 as the rest of the project. Contributions
must preserve the original project attribution and remain compatible with the
human-centered, non-exploitative purpose documented in `LICENSE`,
`COPYRIGHT.md` and `FAIR-COMMERCE.md`.
