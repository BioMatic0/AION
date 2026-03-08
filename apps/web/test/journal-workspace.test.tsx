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
          content: "Die neue Beobachtung bleibt sichtbar.",
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

    await user.type(screen.getByPlaceholderText("Titel"), "Neuer Fokus");
    await user.type(screen.getByPlaceholderText("Stimmung"), "ruhig");
    await user.type(
      screen.getByPlaceholderText("Was ist beobachtbar, was ist Deutung und was braucht spaeter die Spiegelung?"),
      "Die neue Beobachtung bleibt sichtbar."
    );
    await user.click(screen.getByRole("button", { name: "Eintrag erfassen" }));

    await waitFor(() => {
      expect(screen.getByText("Neuer Journal-Eintrag wurde gespeichert.")).toBeInTheDocument();
    });

    expect(screen.getByText("Neuer Fokus")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "POST"
    });
  });
});
