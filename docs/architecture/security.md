# Security

Security is already exposed as a product surface, not only as an internal concern.

## Current implementation

- session summaries are visible through the security center
- security events are recorded and surfaced to the user UI
- incidents and incident notifications exist as explicit domain objects
- suspicious-login simulation exercises the incident path end-to-end through the current service layer
- all security-relevant service actions can write audit records through the audit module

## API surface

Current security endpoints:

- `GET /security/overview`
- `GET /security/incidents`
- `GET /security/notifications`
- `POST /security/simulate/suspicious-login`
- `POST /security/notifications/:notificationId/acknowledge`

## Architecture notes

- sessions, events, incidents and notifications now bootstrap from Prisma when available
- the service keeps an in-memory runtime cache, but mirrors writes into PostgreSQL through Prisma
- audit logging is separated into its own module so security, privacy and governance can reuse the same trail

## Next steps

- add real suspicious-login heuristics instead of simulated triggers only
- connect incident notifications to actual mail and later push delivery
- add device trust flows and optional 2FA scaffolding
