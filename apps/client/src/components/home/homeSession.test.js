import { describe, expect, it } from "vitest";
import {
  getHomeDashboardPath,
  getHomePrimaryAction,
  getHomeSessionName,
} from "./homeSession";

describe("home session presentation", () => {
  it("uses the first part of the best available display name", () => {
    expect(getHomeSessionName({ displayName: "Vijay Nayak", email: "fallback@example.com" })).toBe("Vijay");
    expect(getHomeSessionName({ email: "ananya@example.com" })).toBe("ananya");
  });

  it("routes restored provider sessions back to the provider app", () => {
    expect(getHomeDashboardPath({ role: "PROVIDER" })).toBe("/provider/dashboard");
    expect(getHomePrimaryAction({ role: "PROVIDER" })).toEqual({
      label: "Post a Task",
      path: "/provider/post-task-selection",
    });
  });

  it("routes restored performer sessions back to the performer app", () => {
    expect(getHomeDashboardPath({ role: "TASKER" })).toBe("/performer/dashboard");
    expect(getHomePrimaryAction({ role: "PERFORMER" })).toEqual({
      label: "Find Tasks",
      path: "/performer/find-tasks",
    });
  });

  it("routes restored admin sessions to the admin app", () => {
    expect(getHomeDashboardPath({ role: "SUPER_ADMIN" })).toBe("/admin");
    expect(getHomePrimaryAction({ role: "ADMIN" })).toEqual({
      label: "Open Admin",
      path: "/admin",
    });
  });

  it("does not guess a portal for an incomplete role", () => {
    expect(getHomeDashboardPath({ role: "PENDING" })).toBe("/auth");
    expect(getHomePrimaryAction({ role: "PENDING" })).toEqual({
      label: "Continue",
      path: "/auth",
    });
  });
});
