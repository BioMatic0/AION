import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SecurityOverviewPanel } from "../components/mvp/security-overview-panel";
import { queueJsonResponses } from "./fetch-mock";

describe("SecurityOverviewPanel", () => {
  it("shows the signature verification block with repository and release checks", async () => {
    queueJsonResponses([
      {
        body: {
          sessions: [
            {
              id: "session-1",
              label: "Primary device",
              createdAt: "2026-03-09T08:00:00.000Z",
              lastSeenAt: "2026-03-09T09:00:00.000Z",
              revokedAt: null
            }
          ],
          events: [
            {
              id: "event-1",
              type: "login_alert",
              severity: "warning",
              summary: "New login detected.",
              createdAt: "2026-03-09T09:10:00.000Z"
            }
          ],
          incidents: [
            {
              id: "incident-1",
              incidentType: "suspicious_login",
              status: "investigating",
              summary: "Suspicious login is under review.",
              recommendedAction: "Review the active sessions."
            }
          ],
          notifications: [
            {
              id: "notification-1",
              title: "Security notice",
              description: "Please review the latest login.",
              severity: "warning",
              deliveredVia: ["email", "in_app"]
            }
          ]
        }
      }
    ]);

    render(<SecurityOverviewPanel />);

    await waitFor(() => {
      expect(screen.getByText("Visible signature integrity")).toBeInTheDocument();
    });

    expect(screen.getByText("Signer thumbprint:")).toBeInTheDocument();
    expect(screen.getByText(/0B3D9CF4312D2983FE247D5DD98EA3F524AFDA41/)).toBeInTheDocument();
    expect(
      screen.getByText("powershell -ExecutionPolicy Bypass -File .\\signatures\\verify-signature.ps1")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "powershell -ExecutionPolicy Bypass -File .\\release-artifacts\\verify-release-signature.ps1"
      )
    ).toBeInTheDocument();
  });
});
