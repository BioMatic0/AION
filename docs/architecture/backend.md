# Backend

The API is a NestJS application with these currently implemented modules:

- health
- users
- security
- auth
- journal
- diary
- notes
- goals
- notifications
- analysis
- mirror
- growth
- memory
- search
- governance

The runtime path still uses in-memory services, but the module boundaries now match the intended product shape. The backend already exposes real endpoints for:

- capture domains: journal, diary, notes
- execution domains: goals, reminders/preferences
- AI workflow domains: analysis, mirror, growth, quantum-lens via analysis, memory and search
- platform trust domains: auth, security, governance

Prisma currently serves as the persistence contract and next migration target. The next backend step is moving selected services from in-memory storage to Prisma repositories without changing their public controller surface.