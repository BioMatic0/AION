import { vi } from "vitest";

interface MockJsonResponse {
  status?: number;
  body?: unknown;
}

export function queueJsonResponses(responses: MockJsonResponse[]) {
  const fetchMock = vi.fn();

  for (const response of responses) {
    fetchMock.mockResolvedValueOnce(
      new Response(response.body === undefined ? null : JSON.stringify(response.body), {
        status: response.status ?? 200,
        headers: {
          "content-type": "application/json"
        }
      })
    );
  }

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
