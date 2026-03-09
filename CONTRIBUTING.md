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

## Commit guidance

- Write direct commit messages.
- Group related changes together.
- Avoid mixing refactors and product changes unless tightly coupled.

## Pull requests should include

- What changed
- Why it changed
- How it was verified
- Any follow-up work or open risks

## Licensing

By contributing, you agree that your contribution is provided under the same
AION Community Fairness License 1.0 as the rest of the project. Contributions
must preserve the original project attribution and remain compatible with the
human-centered, non-exploitative purpose documented in `LICENSE`,
`COPYRIGHT.md` and `FAIR-COMMERCE.md`.
