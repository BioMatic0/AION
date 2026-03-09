import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UserProfileSettingsPanel } from "../components/mvp/user-profile-settings-panel";
import { queueJsonResponses } from "./fetch-mock";

describe("UserProfileSettingsPanel", () => {
  it("loads the security summary and saves profile changes through the API", async () => {
    const fetchMock = queueJsonResponses([
      {
        body: {
          profile: {
            id: "user-1",
            displayName: "Patrick Wirth",
            email: "patrick@example.com",
            createdAt: "2026-03-08T09:00:00.000Z",
            updatedAt: "2026-03-08T09:00:00.000Z",
            twoFactorEnabled: false
          },
          sessionCount: 2,
          activeSessionCount: 1,
          twoFactor: {
            enabled: false,
            availableMethods: ["authenticator", "email", "sms"],
            readiness: "scaffold",
            note: "The 2FA scaffold is ready."
          }
        }
      },
      {
        body: {
          id: "user-1",
          displayName: "Patrick Wirth 2",
          email: "patrick2@example.com",
          createdAt: "2026-03-08T09:00:00.000Z",
          updatedAt: "2026-03-08T10:00:00.000Z",
          twoFactorEnabled: false
        }
      }
    ]);

    const user = userEvent.setup();
    render(<UserProfileSettingsPanel />);

    await screen.findByText("Profile and account protection are connected directly to the API.");

    fireEvent.change(screen.getByLabelText("Display name"), { target: { value: "Patrick Wirth 2" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "patrick2@example.com" } });
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => {
      expect(screen.getByText("User profile was saved.")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Display name")).toHaveValue("Patrick Wirth 2");
    expect(screen.getByLabelText("Email")).toHaveValue("patrick2@example.com");
    expect(fetchMock.mock.calls[1]?.[0]).toBe("http://localhost:4000/users/profile");
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "PATCH"
    });
  });
});
