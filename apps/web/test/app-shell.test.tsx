import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "../components/layout/app-shell";
import { queueJsonResponses } from "./fetch-mock";

const navigationState = vi.hoisted(() => ({
  pathname: "/journal",
  router: {
    replace: vi.fn(),
    refresh: vi.fn()
  }
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navigationState.router,
  usePathname: () => navigationState.pathname
}));

const navigation = [
  {
    href: "/journal",
    label: "Journal",
    description: "Reflexion und Eintraege",
    status: "Aktiv",
    nextStep: "Weiter ausbauen",
    pillars: ["Eintraege", "Tags", "Kontext"]
  }
];

describe("AppShell", () => {
  beforeEach(() => {
    navigationState.pathname = "/journal";
    navigationState.router.replace.mockReset();
    navigationState.router.refresh.mockReset();
  });

  it("redirects unauthenticated users to the login screen with the current path", async () => {
    queueJsonResponses([
      {
        status: 401,
        body: {
          message: "Keine aktive Sitzung gefunden."
        }
      }
    ]);

    render(
      <AppShell navigation={navigation}>
        <div>Inhalt</div>
      </AppShell>
    );

    await waitFor(() => {
      expect(navigationState.router.replace).toHaveBeenCalledWith("/login?next=%2Fjournal");
    });
  });

  it("renders the authenticated user and logs out through the API", async () => {
    const fetchMock = queueJsonResponses([
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
      },
      {
        body: {
          revoked: true
        }
      }
    ]);

    const user = userEvent.setup();
    render(
      <AppShell navigation={navigation}>
        <div>Inhalt</div>
      </AppShell>
    );

    await waitFor(() => {
      expect(screen.getByText("patrick@example.com")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Abmelden" }));

    await waitFor(() => {
      expect(navigationState.router.replace).toHaveBeenCalledWith("/login");
    });

    expect(fetchMock.mock.calls.map((call) => call[0])).toContain("http://localhost:4000/auth/logout");
  });
});
