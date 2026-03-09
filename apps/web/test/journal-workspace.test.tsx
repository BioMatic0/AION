import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JournalWorkspace } from "../components/mvp/journal-workspace";
import { queueJsonResponses } from "./fetch-mock";

describe("JournalWorkspace", () => {
  it("loads entries and submits a new journal record through the API", async () => {
    const fetchMock = queueJsonResponses([
      {
        body: [
          {
            id: "entry-1",
            title: "Bestehender Eintrag",
            content: "Vorhandener Inhalt",
            entryType: "journal",
            mood: "klar",
            intensity: 5,
            createdAt: "2026-03-08T09:00:00.000Z",
            updatedAt: "2026-03-08T09:00:00.000Z"
          }
        ]
      },
      {
        body: {
          id: "entry-2",
          title: "Neuer Fokus",
          content: "Sichtbar und klar.",
          entryType: "journal",
          mood: "ruhig",
          intensity: 6,
          createdAt: "2026-03-08T10:00:00.000Z",
          updatedAt: "2026-03-08T10:00:00.000Z"
        }
      }
    ]);

    const user = userEvent.setup();
    render(<JournalWorkspace />);

    await screen.findByText("Bestehender Eintrag");

    await user.type(screen.getByPlaceholderText("Title"), "Neuer Fokus");
    await user.type(screen.getByPlaceholderText("Mood"), "ruhig");
    await user.type(
      screen.getByPlaceholderText("What is observable, what is interpretation, and what may matter later for mirror work?"),
      "Sichtbar und klar."
    );
    await user.click(screen.getByRole("button", { name: "Capture entry" }));

    await waitFor(() => {
      expect(screen.getByText("New journal entry was saved.")).toBeInTheDocument();
    });

    expect(screen.getByText("Neuer Fokus")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "POST"
    });
  }, 10000);
});
