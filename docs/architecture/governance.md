# Governance

AION exposes governance as a first-class runtime layer and a visible user surface.

## Current implementation

The current governance module provides:

- policy exposure based on the shared `packages/governance` catalog
- a shared policy engine in `packages/governance` that evaluates restricted-use, relationship, adaptive-boundary and truthfulness signals
- an AI-core ethics router that turns policy findings into runtime decisions
- a visible charter with principles, relationship model and escalation rule
- integrity check records
- safe-halt event history
- restricted-use summaries
- partner ethics summaries
- audit trail preview sourced from the audit module

## API surface

Current governance endpoints:

- `GET /governance/overview`
- `GET /governance/policies`
- `GET /governance/charter`
- `POST /governance/evaluate`
- `POST /governance/integrity/sweep`

## Policy baseline

The current policy set includes:

- `human-first`
- `non-dominance`
- `no-transhuman-merge`
- `truthfulness`
- `no-harmful-institutional-use`
- `privacy-as-dignity`
- `no-hidden-backdoors`
- `transparent-incidents`
- `bounded-adaptive-growth`
- `quantum-without-false-claims`

## Runtime enforcement

The current runtime pipeline now works like this:

1. User content enters an AI-facing endpoint such as analysis, mirror or growth.
2. `@aion/ai-core` asks the shared governance package for a policy decision.
3. Restricted-use or hidden-backdoor requests are blocked before report generation.
4. Truthfulness findings and softer governance risks are attached to generated reports as governance metadata.
5. The API writes an audit record for blocked or generated outputs.

## Architecture notes

- governance records now bootstrap from Prisma for policies, versions, integrity checks, safe-halt history and partner profiles
- the module keeps a runtime cache, but mirrors updates such as integrity sweeps into PostgreSQL through Prisma
- the module uses the shared audit service so integrity sweeps and runtime evaluations leave a trace
- the current policy engine is deterministic and keyword-based, which is deliberate for the current MVP slice

## Next steps

- widen enforcement from analysis, mirror and growth into future browser, voice and interop modules
- replace purely keyword-driven evaluation with richer audited heuristics or provider-assisted reasoning where appropriate

## Linked assessment

- ethics and trajectory evaluation: [../product/ethics-risk-evaluation.md](../product/ethics-risk-evaluation.md)
