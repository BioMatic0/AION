# AION Implementation Plan

Date: 2026-03-08

## Starting Point

Note: the originally referenced PDF `AION_Gesamtpaket_Patrick_Wirth.pdf` was not
directly readable in this session because the referenced `D:` drive is not
currently mounted. This plan is therefore based on the existing repository, the
architecture files under `docs/`, and the current MVP state in the monorepo.

## Current Project State

Already available:

- monorepo with `apps/web`, `apps/api`, `apps/worker`, and shared packages
- Next.js web app with routes for dashboard, journal, diary, notes, goals,
  analysis, mirror, growth, notifications, governance, privacy, and security
- NestJS API with module boundaries for the core product, governance, privacy,
  consent, audit, and security
- Prisma schema for users, capture, goals, notifications, governance, privacy,
  security, audit, and AI-related data
- deterministic AI orchestration for analysis, mirror, growth, memory, and quantum lens
- visible governance, privacy, and security surfaces
- testing baseline with API tests, Vitest, and Playwright smoke tests

Still open or only partially implemented:

- external LLM integration
- embeddings and retrieval pipeline
- worker-based background jobs
- real notification delivery
- executable export and deletion flows
- replacement of remaining in-memory logic with Prisma repositories
- real security heuristics instead of simulations
- full implementation of browser, voice, media, and collaboration features

## Target State

The target is a production-ready AION MVP platform with:

- stable persistence instead of volatile runtime data
- a reliable AI pipeline with governance enforcement
- traceable privacy, consent, and security execution
- clearly separated release slices for MVP, beta, and expansion phases

## Implementation Phases

### Phase 0: Finalize Requirements

Goal:

- recover the PDF content or make drive `D:` available again
- map the PDF requirements against the repository state
- define epics, must-have criteria, and non-goals conclusively

Work packages:

- extract the PDF into backlog entries
- compare existing features with documented requirements
- create a gap list with priorities `MVP`, `Beta`, and `Later`

Result:

- a reliable scope document as the single source of truth

### Phase 1: Harden the Development and Runtime Foundation

Goal:

- reproducible local and later staging environments

Work packages:

- standardize Node 24, pnpm 10, PostgreSQL 16, and Redis 7
- ensure `node`, `pnpm`, and `git` are available cleanly in `PATH`
- standardize `.env` handling and secret management
- document Docker and local fallback setups
- verify start, build, lint, and test paths on a fresh machine

Result:

- every developer can start and test the system reproducibly

### Phase 2: Finish Persistence Consistently

Goal:

- move all core modules to Prisma-backed persistence

Work packages:

- identify all remaining in-memory services
- introduce repository layers per domain
- keep controller interfaces stable and replace only service implementations
- secure migrations, seeds, and data validation per domain
- move API tests to persistent paths

Priority:

- journal
- diary
- notes
- goals
- notifications
- memory
- analysis, mirror, and growth

Result:

- no critical user data remains only in memory

### Phase 3: Make AI Orchestration Production-Ready

Goal:

- move from deterministic rules toward controlled provider integration

Work packages:

- add provider adapters for external LLMs
- make prompt versioning in `packages/prompts` runtime-capable
- build a retrieval pipeline with persistent memory
- move embedding generation into the worker
- audit governance decisions before and after model calls
- define fallbacks when providers fail or governance blocks execution

Result:

- real AI outputs with traceable policy enforcement

### Phase 4: Complete Background Jobs and Notifications

Goal:

- introduce asynchronous and deliverable system processes

Work packages:

- use a Redis-based queue for background jobs
- define notification jobs, retries, and dead-letter handling
- implement mail delivery or provider integration for incident and reminder emails
- prepare push or in-app realtime later in a clean way
- add observability for failed jobs

Result:

- reminders, security alerts, and export processes no longer rely only on stubs

### Phase 5: Operationalize Privacy, Consent, and Security

Goal:

- move trust-related areas from demo visibility to real execution

Work packages:

- implement export requests as real data export
- implement deletion requests with status flow and deadlines
- connect consent changes in a revision-safe way
- extend incident detection from simulation toward real heuristics
- optionally prepare 2FA, device trust, and session hardening
- connect privacy, security, and audit events across modules

Result:

- governance, privacy, and security become operational product functions

### Phase 6: Refine the Frontend for Productive User Flows

Goal:

- turn the current routes into clean end-to-end product experiences

Work packages:

- distinguish placeholder areas from truly mature functionality
- unify API errors, loading states, and empty states consistently
- prioritize core flows: capture, goals, notifications, analysis, governance,
  privacy, and security
- gate unfinished areas like `browser`, `voice`, and `media` with feature flags
  or roadmap guidance
- improve UX for privacy, governance, and incident communication in a trustable way

Result:

- a consistent, credible, and release-ready user interface

### Phase 7: Quality Assurance and Release Process

Goal:

- establish reliable technical release criteria

Work packages:

- focus unit, integration, and E2E coverage on critical flows
- introduce contract tests between web, API, and shared packages
- build a test matrix for governance blocking, privacy requests, and security incidents
- define a release checklist for migrations, seeds, background jobs, and audit trails
- validate runbooks for backup, incident response, and rollback

Result:

- each release can be approved with technical and functional traceability

## Recommended Release Slices

### Release 1: Stable MVP

Scope:

- capture, goals, notifications
- governance, privacy, and security centers
- persistent core modules
- deterministic AI functions

Not included:

- external LLMs
- real embeddings
- voice, media, browser

### Release 2: Intelligent Beta

Scope:

- external model providers
- retrieval and memory context
- worker-based jobs
- real notification delivery
- operational privacy and incident workflows

### Release 3: Expansion Phase

Scope:

- browser
- voice
- media
- collaboration
- expanded security and trust functions

## Critical Risks

- the document state and repository state may diverge as long as the PDF is not revalidated
- remaining in-memory logic can cause inconsistent behavior across restarts
- external AI providers without clean policy and audit chains would undermine the trust model
- privacy and security stubs may appear product-ready while still being only partially reliable
- unclear prioritization of side modules endangers MVP focus

## Recommended Next Steps

1. Make the PDF accessible again and validate the requirements against this plan.
2. Start Phase 1 and Phase 2 as the immediate sprint block.
3. Turn all remaining in-memory modules into a prioritized persistence list.
4. Create a separate epic track for AI providers, embeddings, and worker expansion.
5. Treat privacy, security, and governance functions as production-critical tracks,
   not as later decoration.
