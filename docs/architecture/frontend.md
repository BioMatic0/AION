# Frontend

The web client uses Next.js App Router, TypeScript and Tailwind CSS.

Current structure:

- marketing landing page at `/`
- workspace shell at `/(app)`
- generic section route for the AION core areas
- reusable shell component with active navigation state

The current UI is a production-minded scaffold. It prioritizes structure, visual direction and extension points over deep feature completion.

Current user account surface:

- authenticated shell with cookie-backed session awareness
- dedicated login and register routes
- settings area with profile editing
- password change flow
- visible 2FA scaffold with method selection and SMS hint support
- notification preference management in the same account workspace

Testing:

- Vitest + React Testing Library cover the API-first MVP components in `apps/web/test`
- Playwright provides a browser-level smoke path in `apps/web/e2e`
- Runtime-focused tests currently cover dashboard data hydration, journal capture, notification preference persistence and the profile settings flow
