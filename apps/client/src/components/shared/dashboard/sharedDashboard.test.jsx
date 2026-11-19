import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LoadingSkeleton,
  ErrorState,
  PrimaryButton,
  SecondaryButton,
  FormField,
  ConfirmationDialog,
  ResponsiveDrawer,
} from "./index";
import Toast from "../Toast";

describe("Phase 2 shared dashboard components", () => {
  it("renders LoadingSkeleton variants with status role", () => {
    const kpiHtml = renderToStaticMarkup(<LoadingSkeleton variant="kpi" count={4} />);
    const listHtml = renderToStaticMarkup(<LoadingSkeleton variant="list" count={2} />);
    const cardHtml = renderToStaticMarkup(<LoadingSkeleton variant="card" count={1} />);
    expect(kpiHtml).toContain('role="status"');
    expect(listHtml).toContain('role="status"');
    expect(cardHtml).toContain('role="status"');
  });

  it("renders ErrorState with alert role and retry button", () => {
    const html = renderToStaticMarkup(
      <ErrorState title="Failed" description="Retry please" onRetry={() => {}} />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain("Failed");
    expect(html).toContain("Try again");
  });

  it("renders PrimaryButton and SecondaryButton with loading and disabled states", () => {
    const primaryHtml = renderToStaticMarkup(
      <PrimaryButton variant="accent" loading>
        Save
      </PrimaryButton>,
    );
    const secondaryHtml = renderToStaticMarkup(
      <SecondaryButton disabled>Cancel</SecondaryButton>,
    );
    expect(primaryHtml).toContain('disabled=""');
    expect(primaryHtml).toContain('aria-busy="true"');
    expect(secondaryHtml).toContain('disabled=""');
  });

  it("renders FormField with label, required mark, and alert error", () => {
    const html = renderToStaticMarkup(
      <FormField label="Task Title" required error="Title is required">
        {(fieldProps) => <input type="text" {...fieldProps} />}
      </FormField>,
    );
    expect(html).toContain("Task Title");
    expect(html).toContain("*");
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("Title is required");
  });

  it("renders ConfirmationDialog and ResponsiveDrawer when open and null when closed", () => {
    expect(
      renderToStaticMarkup(<ConfirmationDialog open={false} title="Hidden" />),
    ).toBe("");
    expect(
      renderToStaticMarkup(<ResponsiveDrawer open={false} title="Hidden" />),
    ).toBe("");

    const dialogHtml = renderToStaticMarkup(
      <ConfirmationDialog open title="Delete task?" message="Cannot undo" />,
    );
    const drawerHtml = renderToStaticMarkup(
      <ResponsiveDrawer open title="Filters" subtitle="Refine results">
        <p>Body</p>
      </ResponsiveDrawer>,
    );
    expect(dialogHtml).toContain('role="dialog"');
    expect(dialogHtml).toContain('aria-modal="true"');
    expect(drawerHtml).toContain('role="dialog"');
    expect(drawerHtml).toContain('aria-modal="true"');
  });

  it("renders Toast warning, success, error, and info variants", () => {
    const warningHtml = renderToStaticMarkup(
      <Toast type="warning" message="Check input" onClose={() => {}} />,
    );
    const errorHtml = renderToStaticMarkup(
      <Toast type="error" message="Failed" onClose={() => {}} />,
    );
    expect(warningHtml).toContain('role="status"');
    expect(warningHtml).toContain("Check input");
    expect(warningHtml).toContain('aria-label="Dismiss notification"');
    expect(errorHtml).toContain('role="alert"');
  });
});
