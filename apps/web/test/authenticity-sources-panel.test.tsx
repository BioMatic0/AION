import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthenticitySourcesPanel } from "../components/mvp/authenticity-sources-panel";

describe("AuthenticitySourcesPanel", () => {
  it("shows source, disclosure, and provenance expectations", () => {
    render(<AuthenticitySourcesPanel />);

    expect(screen.getByText("Source-backed factual output")).toBeInTheDocument();
    expect(screen.getByText("Clear synthetic-media disclosure")).toBeInTheDocument();
    expect(screen.getByText("Traceable provenance")).toBeInTheDocument();
    expect(screen.getByText(/fabricated sources, invented citations, or fake educational material/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Governance" })).toHaveAttribute("href", "/governance");
  });
});
