import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
            title: "Growth prompt",
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
            title: "Growth prompt",
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

    await screen.findByText("Notifications are connected directly to the API.");

    await user.selectOptions(screen.getByLabelText("Notification frequency"), "weekly");
    await user.selectOptions(screen.getByLabelText("Tone"), "reflective");
    fireEvent.change(screen.getByLabelText("Preferred time"), { target: { value: "09:15" } });
    await user.selectOptions(screen.getByLabelText("Preferred weekday"), "friday");
    await user.click(screen.getByRole("button", { name: "Save preferences" }));

    await waitFor(() => {
      expect(screen.getByText("Notification preferences were saved.")).toBeInTheDocument();
    });

    expect(screen.getByText("Scheduled jobs").closest("article")).toHaveTextContent("Growth -");
    expect(screen.getByText("Scheduled jobs").closest("article")).toHaveTextContent("Scheduled");
    expect(fetchMock).toHaveBeenCalledTimes(7);
    expect(fetchMock.mock.calls[3]?.[1]).toMatchObject({
      method: "PUT"
    });
  });
});
