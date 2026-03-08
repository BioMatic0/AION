# AI Orchestration

The AI core currently provides a deterministic orchestration layer without an external LLM dependency. It now includes:

- intent routing
- ethics assessment
- shared governance decisions with `allow`, `transform`, `review`, `block` and `halt` actions
- response envelope creation with applied governance policies
- analysis report generation
- mirror report generation
- quantum-lens report generation
- growth state and intervention generation
- memory item extraction and memory search ranking

This gives the project a real AI workflow slice even before a remote provider is attached. The current flow is:

1. Input enters a domain endpoint such as analysis, mirror or growth.
2. The API passes the content into `@aion/ai-core`.
3. The AI core asks the governance package for a runtime decision.
4. Restricted requests are blocked at the API service boundary and audited.
5. Allowed or transformed requests become structured reports with governance metadata attached.
6. Memory search uses extracted concepts and ranked overlap across current domain data.

The next implementation stage should add:

- provider adapters for real LLM calls
- prompt version selection at runtime
- retrieval-aware context assembly backed by persistent memory
- deeper policy transforms before delivery
- worker-backed embedding generation beyond the current placeholder path
