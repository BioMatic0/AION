import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NotificationSettingsPanel } from "../components/mvp/notification-settings-panel";
import { queueJsonResponses } from "./fetch-mock";

describe("NotificationSettingsPanel", () => {
  it("keeps the save success message after refreshing data", async () => {
    const fetchMock = queueJsonResponses([
      {
        body: {
          developmentEnabled: true,
          goalRemindersEnabled: true,
          frequency: "daily",
          preferredTime: "08:30",
          preferredWeekday: "monday",
          tone: "mixed"
        }
      },
      {
        body: [
          {
            id: "history-1",
            notificationType: "growth",
            channel: "email",
            title: "Wachstumsimpuls",
            message: "Klarheit vor Tempo.",
            deliveredAt: "2026-03-08T08:30:00.000Z",
            status: "sent"
          }
        ]
      },
      {
        body: [
          {
            id: "job-1",
            jobType: "growth",
            scheduledFor: "2026-03-09T08:30:00.000Z",
            status: "scheduled"
          }
        ]
      },
      {
        body: {
          developmentEnabled: false,
          goalRemindersEnabled: true,
          frequency: "weekly",
          preferredTime: "09:15",
          preferredWeekday: "friday",
          tone: "reflective"
        }
      },
      {
        body: {
          developmentEnabled: false,
          goalRemindersEnabled: true,
          frequency: "weekly",
          preferredTime: "09:15",
          preferredWeekday: "friday",
          tone: "reflective"
        }
      },
      {
        body: [
          {
            id: "history-1",
            notificationType: "growth",
            channel: "email",
            title: "Wachstumsimpuls",
            message: "Klarheit vor Tempo.",
            deliveredAt: "2026-03-08T08:30:00.000Z",
            status: "sent"
          }
        ]
      },
      {
        body: [
          {
            id: "job-1",
            jobType: "growth",
            scheduledFor: "2026-03-15T09:15:00.000Z",
            status: "scheduled"
          }
        ]
      }
    ]);

    const user = userEvent.setup();
    render(<NotificationSettingsPanel />);

    await screen.findByText("Benachrichtigungen sind direkt mit der API verbunden.");

    await user.selectOptions(screen.getByLabelText("Benachrichtigungsfrequenz"), "weekly");
    await user.selectOptions(screen.getByLabelText("Tonfall"), "reflective");
    await user.clear(screen.getByLabelText("Bevorzugte Uhrzeit"));
    await user.type(screen.getByLabelText("Bevorzugte Uhrzeit"), "09:15");
    await user.selectOptions(screen.getByLabelText("Bevorzugter Wochentag"), "friday");
    await user.click(screen.getByRole("button", { name: "Praeferenzen speichern" }));

    await waitFor(() => {
      expect(screen.getByText("Die Benachrichtigungs-Praeferenzen wurden gespeichert.")).toBeInTheDocument();
    });

    expect(screen.getByText("Geplante Jobs").closest("article")).toHaveTextContent("Wachstum -");
    expect(screen.getByText("Geplante Jobs").closest("article")).toHaveTextContent("Geplant");
    expect(fetchMock).toHaveBeenCalledTimes(7);
    expect(fetchMock.mock.calls[3]?.[1]).toMatchObject({
      method: "PUT"
    });
  });
});
