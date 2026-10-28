import { describe, expect, it } from "vitest";
import {
  checklistStatusLabel,
  isChecklistItemComplete,
  isChecklistItemDisputed,
  isChecklistItemInReview,
  mapChecklistItemFromApi,
} from "./checklistSubmission";

describe("checklist submission mapping", () => {
  it("maps the backend SUBMITTED response into a provider-reviewable item", () => {
    const item = mapChecklistItemFromApi({
      id: "item-1",
      title: "Share the final design",
      status: "SUBMITTED",
      submissions: [
        {
          version: 1,
          submittedAt: "2026-09-23T10:00:00.000Z",
          taskerDescription: "First version",
          review: { status: "REJECTED", providerFeedback: "Update spacing" },
        },
        {
          version: 2,
          submittedAt: "2026-09-24T10:00:00.000Z",
          taskerDescription: "Updated final version",
          taskerLink: "https://example.com/final",
          taskerFiles: [
            { id: "file-1", filename: "final.pdf", url: "https://example.com/final.pdf" },
          ],
          review: null,
        },
      ],
    });

    expect(item.status).toBe("In Review");
    expect(isChecklistItemInReview(item.apiStatus)).toBe(true);
    expect(item.submission.description).toBe("Updated final version");
    expect(item.submission.githubLink).toBe("https://example.com/final");
    expect(item.submission.files).toEqual([
      expect.objectContaining({ id: "file-1", filename: "final.pdf" }),
    ]);
    expect(item.submission.version).toBe(2);
  });

  it("reads provider feedback and review attachments from the nested review", () => {
    const item = mapChecklistItemFromApi({
      id: "item-2",
      title: "Export assets",
      status: "CHANGE_REQUESTED",
      submissions: [
        {
          version: 1,
          taskerDescription: "Assets attached",
          review: {
            status: "REJECTED",
            providerFeedback: "Please include SVG files",
            providerFiles: [
              { id: "review-file", filename: "example.svg", url: "https://example.com/example.svg" },
            ],
          },
        },
      ],
    });

    expect(item.status).toBe("Revision Required");
    expect(item.providerFeedback).toBe("Please include SVG files");
    expect(item.submission.providerFiles).toEqual([
      expect.objectContaining({ id: "review-file" }),
    ]);
  });

  it("supports app-compatible approved and disputed statuses", () => {
    expect(checklistStatusLabel("APPROVED")).toBe("Approved");
    expect(isChecklistItemComplete("APPROVED")).toBe(true);
    expect(checklistStatusLabel("DISPUTED")).toBe("Admin Review");
    expect(isChecklistItemDisputed("DISPUTED")).toBe(true);
  });
});
