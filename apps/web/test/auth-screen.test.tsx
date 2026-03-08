import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthScreen } from "../components/auth/auth-screen";
import { queueJsonResponses } from "./fetch-mock";

const navigationState = vi.hoisted(() => ({
  search: "",
  router: {
    replace: vi.fn(),
    refresh: vi.fn()
  }
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navigationState.router,
  useSearchParams: () => new URLSearchParams(navigationState.search)
}));

describe("AuthScreen", () => {
  beforeEach(() => {
    navigationState.search = "";
    navigationState.router.replace.mockReset();
    navigationState.router.refresh.mockReset();
  });

  it("redirects authenticated users to a safe internal next path", async () => {
    navigationState.search = "next=/goals";
    queueJsonResponses([
      {
        body: {
          user: {
            id: "user-1",
            displayName: "Patrick Wirth",
            email: "patrick@example.com",
            createdAt: "2026-03-08T10:00:00.000Z"
          },
          session: {
            id: "session-1",
            userId: "user-1",
            label: "Browser",
            createdAt: "2026-03-08T10:00:00.000Z",
            lastSeenAt: "2026-03-08T10:00:00.000Z",
            revokedAt: null
          }
        }
      }
    ]);

    render(<AuthScreen mode="login" />);

    await waitFor(() => {
      expect(navigationState.router.replace).toHaveBeenCalledWith("/goals");
    });
  });

  it("falls back to the dashboard when next points outside the app", async () => {
    navigationState.search = "next=https://evil.example/phish";
    const fetchMock = queueJsonResponses([
      {
        status: 401,
        body: {
          message: "Keine aktive Sitzung gefunden."
        }
      },
      {
        body: {
          user: {
            id: "user-1",
            displayName: "Patrick Wirth",
            email: "patrick@example.com",
            createdAt: "2026-03-08T10:00:00.000Z"
          },
          session: {
            id: "session-1",
            userId: "user-1",
            label: "Browser",
            createdAt: "2026-03-08T10:00:00.000Z",
            lastSeenAt: "2026-03-08T10:00:00.000Z",
            revokedAt: null
          }
        }
      }
    ]);

    const user = userEvent.setup();
    render(<AuthScreen mode="login" />);

    await user.type(screen.getByLabelText("E-Mail"), "patrick@example.com");
    await user.type(screen.getByLabelText("Passwort"), "123456789012");
    await user.click(screen.getByRole("button", { name: "Anmelden" }));

    await waitFor(() => {
      expect(navigationState.router.replace).toHaveBeenCalledWith("/dashboard");
    });

    expect(fetchMock.mock.calls.map((call) => call[0])).toContain("http://localhost:4000/auth/login");
  });
});
