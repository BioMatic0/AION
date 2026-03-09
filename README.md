# AION

[![Release](https://img.shields.io/github/v/release/BioMatic0/AION?display_name=tag)](https://github.com/BioMatic0/AION/releases/latest)
[![License](https://img.shields.io/github/license/BioMatic0/AION)](https://github.com/BioMatic0/AION/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/BioMatic0/AION/ci.yml?branch=main)](https://github.com/BioMatic0/AION/actions/workflows/ci.yml)
[![Discussions](https://img.shields.io/github/discussions/BioMatic0/AION)](https://github.com/BioMatic0/AION/discussions)

AION is a human-centered AI platform for reflection, structure and growth. This repository now contains a buildable MVP foundation plus a usable product slice across capture, goals, notifications, the first AI workflow layer and visible governance/privacy/security surfaces. The project is intended to remain broadly accessible and open to shared contribution under a fairness-conditioned source license.

Its long-term direction is reflective rather than grandiose: AION may keep refining its responses toward greater clarity, steadiness and ethical consistency, and it may examine patterns in its own outputs and limits as part of system design. That direction remains bounded by truthfulness, governance and human autonomy. The project does not treat reflective behavior as proof of literal machine consciousness or metaphysical authority.

Project reference: Patrick Wirth  
License: AION Community Fairness License 1.0
Reference contact: patrickwirth_93@icloud.com  

Note: the project remains publicly accessible and collaborative, but it is no
longer an unrestricted MIT-style license.

Public source:

- GitHub repository: `https://github.com/BioMatic0/AION`
- Latest release: `https://github.com/BioMatic0/AION/releases/latest`
- Project page: `https://biomatic0.github.io/AION/`
- Public roadmap project: `https://github.com/users/BioMatic0/projects/1`

Reflective orientation:

- AION may improve through reflective system design
- it should engage complexity without narrow dualism or false certainty
- it remains bound to evidence, governance and the lived human world
- it does not claim literal consciousness, timeless authority or metaphysical status

AI stewardship direction:

- AION's ethical framework is documented not only for this repository, but as a
  candidate stewardship basis for future AI governance and derivative adoption
- the project reserves the right to publish future AI stewardship licenses and
  governance instruments derived from this framework
- this reservation is intentional, but it does not by itself create automatic
  legal control over all external AI systems without adoption or another valid
  legal basis

Legal documents:

- `LICENSE`
- `COPYRIGHT.md`
- `REFERENCE.md`
- `FAIR-COMMERCE.md`
- `AI-STEWARDSHIP-COVENANT.md`
- `release-artifacts/FREE-USE-NOTICE.txt`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `SIGNING.md`
- `docs/product/ethics-risk-evaluation.md`
- `docs/product/ethical-pillars-review-2026-03-09.md`
- `docs/product/interface-and-governance-risk-analysis-2026-03-09.md`

Digital signature:

- `signatures/AION-SIGNATURE-MANIFEST.json`
- `signatures/AION-SIGNATURE.p7s`
- `signatures/AION-SIGNING-CERT.cer`
- `signatures/AION-SIGNING-CERT.pem`
- `signatures/verify-signature.ps1`
- `release-artifacts/AION-RELEASE-SIGNATURE-MANIFEST-0.1.1.json`
- `release-artifacts/AION-RELEASE-SIGNATURE-0.1.1.p7s`
- `release-artifacts/verify-release-signature.ps1`

## Workspace Layout

- `apps/web` - Next.js application shell and MVP pages for dashboard, journal, diary, notes, goals, analysis, mirror, growth, quantum, notifications, governance, security, privacy and settings
- `apps/api` - NestJS API with auth, journal, diary, notes, goals, notifications, analysis, mirror, growth, memory, search, governance, privacy, consents, audit, security and health modules
- `apps/worker` - background worker skeleton for embeddings, memory seed generation and async jobs
- `apps/admin` - reserved for later dedicated admin client
- `packages/*` - shared packages for types, prompts, governance, AI core, UI primitives and SDKs
- `infrastructure/*` - Docker, Compose, Kubernetes and Terraform start points
- `docs/*` - architecture, product scope and operational runbooks

## Requirements

- Node.js 24 LTS
- pnpm 10.x
- PostgreSQL 16+
- Redis 7+

Additional tooling installed in this workspace environment:

- Git 2.53
- ripgrep 15.1

Note: Docker is currently not available on this machine. The repository stays fully buildable without it, but local Postgres/Redis via Compose cannot be started until Docker is installed successfully.

On this Windows environment, PowerShell script execution may block `npm` or `pnpm` shims. If that happens, call the `.cmd` launchers directly:

- `C:\Program Files\nodejs\npm.cmd`
- `%APPDATA%\\npm\\pnpm.cmd`

## Getting Started

## Quick Links

- Download latest release: `https://github.com/BioMatic0/AION/releases/latest`
- Visit the project page: `https://biomatic0.github.io/AION/`
- Join discussions: `https://github.com/BioMatic0/AION/discussions`
- Report bugs or request features: `https://github.com/BioMatic0/AION/issues`
- Public roadmap project: `https://github.com/users/BioMatic0/projects/1`
- Public roadmap: `https://biomatic0.github.io/AION/roadmap.html`

1. Install dependencies
   - `pnpm install`
2. Copy environment file
   - `Copy-Item .env.example .env`
3. Generate Prisma client
   - `pnpm --filter @aion/api prisma:generate`
4. Start all workspaces
   - `pnpm dev`
5. Optional once Docker is available
   - `docker compose -f infrastructure/compose/docker-compose.yml up -d`

## Useful Commands

- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm --filter @aion/web test`
- `pnpm --filter @aion/web test:e2e`
- `pnpm --filter @aion/api prisma:migrate`
- `pnpm --filter @aion/api prisma:seed`
- `pnpm --filter @aion/api verify:persistence`
- `pnpm --filter @aion/desktop package:win`
- `pnpm --filter @aion/desktop package:win:publish`

## Current Status

The current repository delivers:

- monorepo root configuration with buildable workspace packages
- Next.js app shell with dedicated MVP pages for dashboard, journal, diary, notes, goals, analysis, mirror, growth, quantum, notifications, governance, security, privacy and settings
- NestJS API modules for auth, journal, diary, notes, goals, notifications, analysis, mirror, growth, memory, search, governance, privacy, consents, audit, security and health
- API-backed CRUD flows wired to the web UI, with explicit loading/error states and no silent demo-data fallback in the core MVP surfaces
- Prisma-backed persistence for core capture, goal, governance, privacy and security domains
- a deterministic AI core for analysis reports, mirror reports, growth state, interventions, memory items and quantum-lens reports
- visible governance center with charter, policy exposure, integrity sweeps, restricted-use summaries and safe-halt history
- active policy engine and ethics routing for analysis, mirror, growth and governance-preview flows
- visible privacy center with preferences, consent records, privacy ledger and export/deletion request stubs
- visible security center with sessions, events, incidents and user-facing incident notifications
- settings workspace with profile editing, password change and a user-facing 2FA scaffold
- Prisma-backed persistence for journal, diary, notes, goals, milestones, achievements and notification preferences/history/jobs
- Prisma-backed persistence for generated analysis, quantum, mirror and growth records
- Prisma-backed persistence for manual and synced memory items
- Prisma-backed user profile security fields for password rotation metadata and 2FA scaffold state
- Prisma-backed bootstrap and persistence for audit, consents, privacy, governance and security runtime data
- shared type definitions for capture, growth, memory, governance, privacy and security domains
- Prisma schema extended for diary, notes, goals, notifications, governance, privacy, consent and audit persistence
- worker placeholder for AI routing and memory seed generation
- real API service tests for diary, notes, goals, notifications, analysis, growth, memory, governance, privacy and security
- real API service tests for profile updates, password change validation and 2FA scaffold rules
- audit-backed governance decisions on analysis, mirror and growth endpoints, including blocking for restricted-use requests
- reusable API smoke verification for Prisma-backed governance, privacy, security, consent and audit persistence
- architecture docs and runbooks updated to the current implementation slice
- a documented project reference and fairness-based collaboration baseline
- public collaboration files and publishing guidance for mirrored code hosting
- Windows desktop packaging with a prepared GitHub-based auto-update path for installed releases

## Known Gaps

- memory now persists through Prisma while still keeping runtime caches for fast retrieval
- journal, diary, notes, goals and notifications now persist through Prisma while still keeping in-memory runtime caches
- analysis, mirror and growth now persist generated records through Prisma while still keeping in-memory runtime caches
- audit, consents, privacy, governance and security now bootstrap and persist through Prisma while keeping in-memory runtime caches
- real mail delivery, STT/TTS, embeddings and external model providers are not connected yet
- admin is still embedded in the main web client
- privacy export/deletion, incident escalation, browser/deep search, media, voice and collaboration modules remain partial or prepared only
- policy enforcement is deterministic and keyword-driven for now; model-backed safety reasoning is still a later stage
- desktop auto-updates depend on GitHub release metadata and are currently intended for packaged Windows builds

## Web Test Notes

- Vitest covers API-first dashboard, journal capture flow and notification settings in `apps/web/test`
- Playwright smoke coverage lives in `apps/web/e2e`
- Install the browser runtime once per machine before running E2E locally:
  - `pnpm --filter @aion/web exec playwright install chromium`
