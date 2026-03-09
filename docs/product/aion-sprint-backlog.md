# AION Sprint Backlog

Date: 2026-03-08

## Planning Assumptions

This backlog is based on the current repository state and the document
[aion-programmierungsplan.md](C:\Users\Administrator\Documents\New project\docs\product\aion-programmierungsplan.md).

Working assumptions:

- sprint length: 2 weeks
- priority: stable MVP before feature expansion
- estimation: `S` = 1 to 2 days, `M` = 3 to 5 days, `L` = 6 to 10 days,
  `XL` = more than 10 days
- team assumption: a small core team focused on web, API, and platform

## Epic Overview

| Epic | Title | Goal | Priority | Release |
| --- | --- | --- | --- | --- |
| EP-01 | Environment and runtime foundation | Local setup, PATH, ENV, startability, build paths | Critical | Release 1 |
| EP-02 | Persistence of core modules | Move in-memory remnants to Prisma | Critical | Release 1 |
| EP-03 | Operationalize trust modules | Make privacy, consent, security, and audit production-like | High | Release 1 |
| EP-04 | Harden the frontend MVP | End-to-end flows, error handling, feature boundaries | High | Release 1 |
| EP-05 | Extend AI orchestration | Providers, prompts, retrieval, governance hooks | High | Release 2 |
| EP-06 | Worker and background jobs | Queue, embeddings, notification jobs, retries | High | Release 2 |
| EP-07 | Quality and release process | Test coverage, release gates, runbooks | Critical | Release 1 |
| EP-08 | Expansion products | Browser, voice, media, collaboration | Medium | Release 3 |

## Epic Details

### EP-01 Environment and Runtime Foundation

Goal:

- reproducible development, buildability, and local runtime capability

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-101 | Clean up toolchain paths | Make `node`, `pnpm`, and `git` reliably available in PATH and document it | S | none |
| AION-102 | Standardize ENV setup | Review `.env`, `.env.example`, required secrets, and local defaults | S | AION-101 |
| AION-103 | Verify local database setup | Make PostgreSQL and Redis startable via Compose or local fallback | M | AION-102 |
| AION-104 | Verify start and build matrix | Validate `build`, `lint`, `typecheck`, `test`, API start, and web start against a fresh setup | M | AION-103 |
| AION-105 | Extend developer runbook | Update README and setup docs with Windows-specific startup paths | S | AION-104 |

Acceptance criteria:

- a fresh setup can start web, API, and data services in a traceable way
- known PATH issues are removed or clearly documented around

### EP-02 Persistence of Core Modules

Goal:

- keep all critical user data consistently in PostgreSQL instead of memory

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-201 | Create persistence audit | Inventory all modules with remaining in-memory logic and prioritize by risk | S | EP-01 |
| AION-202 | Move journal to a repository layer | Move the service internally to Prisma repositories without breaking the API | M | AION-201 |
| AION-203 | Persist diary and notes | Move both capture modules fully to persistent paths | M | AION-201 |
| AION-204 | Persist goals and notifications | Persist reminders, jobs, history, and preferences cleanly | L | AION-201 |
| AION-205 | Make memory persistent | Move memory items, search input, and ranking basis to persistent data | L | AION-201 |
| AION-206 | Persist analysis, mirror, and growth | Move generated reports and state data from cache into Prisma | L | AION-201 |
| AION-207 | Automate persistence verification | Extend `verify:persistence` across all prioritized modules | M | AION-202 |

Acceptance criteria:

- restarts do not lose prioritized user data
- controller interfaces remain stable
- persistence tests cover the core modules

### EP-03 Operationalize Trust Modules

Goal:

- make governance, privacy, consent, and security into real operational functions

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-301 | Implement privacy export | Build export requests as real data extraction with status and expiry | L | EP-01, EP-02 |
| AION-302 | Implement deletion workflow | Build deletion requests with status machine, scheduling, and auditing | L | EP-01, EP-02 |
| AION-303 | Secure the consent lifecycle | Connect consent changes to audit in a domain-correct and revision-safe way | M | EP-02 |
| AION-304 | Introduce incident heuristics | Expand simulated security triggers into initial real detection logic | M | EP-01 |
| AION-305 | Prepare session and device trust | Lay the groundwork for trusted devices, session hardening, and later 2FA | M | AION-304 |
| AION-306 | Connect trust events | Make privacy, security, and audit events cross-referenceable | M | AION-301 |

Acceptance criteria:

- privacy and security features trigger real backend processes
- the audit trail is complete for critical trust-related actions

### EP-04 Harden the Frontend MVP

Goal:

- turn the existing product surfaces into release-ready user flows

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-401 | Prioritize core flows | Fix capture, goals, notifications, analysis, governance, privacy, and security as MVP flows | S | none |
| AION-402 | Unify error and loading states | Make API loading, error, and empty states consistent across the app | M | AION-401 |
| AION-403 | Mark placeholder areas | Clearly fence off `browser`, `voice`, `media`, and similar areas | S | AION-401 |
| AION-404 | Improve trust-center UX | Trim governance, privacy, and security screens for clarity and actionability | M | AION-402 |
| AION-405 | Simplify navigation and dashboard | Focus on MVP areas, clear entry points, and status visibility | M | AION-401 |
| AION-406 | Stabilize end-to-end flows | Validate core flows with the real API and without demo fallbacks | L | EP-02, AION-402 |

Acceptance criteria:

- MVP users can complete core flows without dead ends
- unfinished product areas are not presented as complete

### EP-05 Extend AI Orchestration

Goal:

- make a controlled transition from deterministic AI to provider-backed execution

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-501 | Design provider adapters | Define an interface for external LLM providers and integrate it into `packages/ai-core` | L | EP-02 |
| AION-502 | Make prompt versioning runtime-capable | Introduce active prompt versions, migrations, and fallbacks | M | AION-501 |
| AION-503 | Define retrieval context | Specify context building from memory, goals, and capture data functionally and technically | M | EP-02 |
| AION-504 | Extend governance around model calls | Secure pre- and post-processing with audit and policy metadata | L | AION-501 |
| AION-505 | Provider fallbacks and safe halt | Make error strategies, timeouts, and governance halt robust in AI pipelines | M | AION-504 |

Acceptance criteria:

- external models can be connected in a controlled way
- every AI answer remains traceable from a governance perspective

### EP-06 Worker and Background Jobs

Goal:

- move asynchronous work cleanly into the worker

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-601 | Introduce queue foundation | Establish a Redis-based job queue in the worker | L | EP-01 |
| AION-602 | Set up embedding jobs | Prepare persistent embedding generation for memory and retrieval | L | AION-601, EP-05 |
| AION-603 | Make notification jobs production-ready | Implement reminders, incident alerts, and delivery attempts as background jobs | L | AION-601, EP-03 |
| AION-604 | Retry and DLQ strategy | Make failed jobs observable and retryable | M | AION-601 |
| AION-605 | Expand worker observability | Expose job durations, failures, and statuses for operations | M | AION-604 |

Acceptance criteria:

- asynchronous work leaves the request path
- failures in background jobs remain visible and controllable

### EP-07 Quality and Release Process

Goal:

- secure releases through clear technical gates

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-701 | Define critical test matrix | Define core cases for capture, goals, governance, privacy, and security | S | none |
| AION-702 | Close API integration gaps | Cover missing persistence and trust scenarios with tests | L | EP-02, EP-03 |
| AION-703 | Extend web smoke coverage | Secure MVP flows end-to-end in the browser | M | EP-04 |
| AION-704 | Create release checklist | Define migrations, seeds, audit, worker, and rollback as mandatory release checks | S | EP-01 |
| AION-705 | Validate runbooks | Validate backup, incident response, and restart procedures in practice | M | EP-03, EP-06 |
| AION-706 | Extend trust regression tests | Cover privacy, consent, governance, and security edge cases systematically as regression tests | M | EP-03 |

Acceptance criteria:

- critical product flows are protected by test and operational gates before release

### EP-08 Expansion Products

Goal:

- expand secondary modules deliberately without blurring the MVP

Tickets:

| ID | Ticket | Description | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| AION-801 | Design browser module | Define scope, governance risks, and architecture for browser features | M | Release 2 |
| AION-802 | Design voice pipeline | Plan STT, TTS, privacy, and governance for voice | M | Release 2 |
| AION-803 | Design media pipeline | Plan upload, processing, storage, and trust gates for media | M | Release 2 |
| AION-804 | Create collaboration roadmap | Prepare roles, permissions, data separation, and auditing | M | Release 2 |

## Sprint Recommendation

### Sprint 1: Operational MVP Foundation

Goal:

- stabilize the setup and close the highest-risk persistence gaps

Commitment:

- AION-101
- AION-102
- AION-103
- AION-104
- AION-201
- AION-202
- AION-203
- AION-401
- AION-701
- AION-704

Success criteria:

- the local environment starts reproducibly
- journal, diary, and notes are persistently reliable
- test and release gates are initially defined

### Sprint 2: Persistence and MVP Flows

Goal:

- stabilize goals, notifications, and core frontend flows

Commitment:

- AION-204
- AION-402
- AION-403
- AION-405
- AION-406
- AION-702 partly for capture and notifications
- AION-703 initial

Success criteria:

- core usage works without demo fallbacks
- notifications and goals are functionally consistent

### Sprint 3: Make Trust Functions Production-Like

Goal:

- move privacy and security from visible stubs to real processes

Commitment:

- AION-301
- AION-302
- AION-303
- AION-304
- AION-404
- AION-706

Success criteria:

- export, deletion, and first incident heuristics are product-ready

### Sprint 4: Prepare AI and Worker Beta

Goal:

- prepare external AI and background jobs technically

Commitment:

- AION-501
- AION-502
- AION-503
- AION-601
- AION-604
- AION-605

Success criteria:

- the AI core and worker have a viable beta architecture

## Order and Dependencies

Recommended primary order:

1. Finish EP-01 before anything else.
2. Start EP-02 in parallel with EP-04.
3. Build EP-03 only on top of already stabilized persistence.
4. Prepare EP-05 and EP-06 together for Release 2.
5. Treat EP-08 strictly after the MVP.

Blockers:

- without a stable ENV and database foundation, persistence and worker tickets remain risky
- without persistent memory, retrieval is only partially useful
- without audit coupling, privacy and governance processes remain incomplete

## Recommended Immediate Priority

Start immediately with:

1. AION-101 through AION-104
2. AION-201 through AION-204
3. AION-402 and AION-406
4. AION-701 through AION-704

Deliberately later:

1. AION-801 through AION-804
2. browser, voice, and media without clear MVP value
3. deep AI provider integration before the persistence foundation is complete
