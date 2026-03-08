# ADR 0001: Monorepo Foundation

## Status
Accepted

## Context
AION needs a shared type system, governance rules and consistent tooling across web, API and worker runtimes.

## Decision
Use a single pnpm workspace monorepo with apps and packages split by runtime and reusable concern.

## Consequences
- Shared packages reduce drift between runtime layers.
- Build order becomes important.
- Session-based incremental delivery is easier to manage.