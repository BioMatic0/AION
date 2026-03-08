# System Overview

AION is organized as a monorepo with three runtime applications:

- Web: user-facing Next.js experience with product shells for capture, AI workflows and user transparency
- API: NestJS service layer for auth, journal, goals, AI orchestration, governance, privacy, security and health
- Worker: asynchronous jobs for embeddings, summaries, media processing and future notification delivery

Shared packages hold the policy catalog, prompt library, AI-routing logic and typed contracts used across all runtimes.

## Current implementation slice

The repository now exposes a buildable MVP foundation across these areas:

- capture flows for journal, diary and notes
- goal tracking, reminders and notification preferences
- deterministic AI workflows for analysis, mirror, growth, memory and quantum lens
- deterministic policy-engine enforcement and ethics routing for AI-facing flows
- governance transparency with charter, policies, integrity sweeps and safe-halt history
- privacy transparency with preferences, consents, ledger entries and export/deletion request stubs
- security transparency with sessions, security events, incidents and incident notifications
- Prisma-backed persistence for audit, governance, privacy, consent and security runtime records

## Runtime shape

- `apps/web` renders the end-user surface against live API routes and now exposes loading and error states instead of silently falling back to seeded demo data
- `apps/api` now mixes Prisma-backed persistence for governance/privacy/security/audit domains with in-memory runtime caches and still-in-memory product modules
- `apps/worker` remains the place for future embedding jobs, notification scheduling and provider-backed background work

## Near-term technical direction

- replace in-memory services with Prisma-backed repositories
- wire notification delivery into Redis-backed jobs
- add an operational policy engine on top of the current governance read-model
- extend privacy and incident workflows from visible stubs to executable processes
