# Privacy

Privacy is implemented as a visible control plane instead of a hidden compliance note.

## Current implementation

The current privacy module provides:

- privacy preference summaries
- consent record management
- privacy ledger entries for visible data categories and retention cues
- export request stubs
- deletion request stubs
- audit logging for preference and request changes

## API surface

Current privacy and consent endpoints:

- `GET /privacy/overview`
- `GET /privacy/preferences`
- `PATCH /privacy/preferences`
- `POST /privacy/export`
- `POST /privacy/deletion`
- `GET /consents`
- `POST /consents`
- `GET /audit/logs`

## Architecture notes

- privacy preferences, consent records, ledger entries and request queues now bootstrap from Prisma when available
- the service keeps an in-memory runtime cache, but writes are mirrored into PostgreSQL through Prisma
- the web client renders privacy state from the API and surfaces explicit loading or failure feedback instead of injecting local demo-state

## Next steps

- convert export and deletion request stubs into executable jobs
- connect privacy ledger generation to real storage metadata instead of seeded summaries
- surface incident-linked privacy notifications from the security module directly in the privacy center
