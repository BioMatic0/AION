---
layout: default
title: Contribute
---

# Contribute to AION

AION is publicly accessible and open to shared contribution. The best entry path
is practical, reviewable, and small enough to verify clearly.

## Start with one of these tracks

- Public website and contributor onboarding polish
- Documentation and release communication
- Trust-hardening changes with clear scope
- UI consistency improvements
- Retrieval, AI core, and platform expansion only when the change is tightly scoped

## Basic local flow

1. Install dependencies with `pnpm install`
2. Copy the environment file with `Copy-Item .env.example .env`
3. Generate the Prisma client with `pnpm --filter @aion/api prisma:generate`
4. Run checks before opening a pull request

## Verification baseline

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm --filter @aion/web test`
- `pnpm --filter @aion/api verify:persistence`

## Project boundaries

- Preserve origin and fairness notices
- Keep governance, privacy and security visible
- Do not introduce hidden access paths or deceptive behavior
- Keep criticism and review open; moderation is tied to actual guideline violations

## Public links

- [Repository](https://github.com/BioMatic0/AION)
- [Issues](https://github.com/BioMatic0/AION/issues)
- [Discussions](https://github.com/BioMatic0/AION/discussions)
- [Roadmap](./roadmap.html)
