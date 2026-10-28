import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  dedupePerformerRequest,
  expirePerformerCache,
  readPerformerCache,
  writePerformerCache,
} from "./performerDataCache";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
}

describe("performer data cache", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: createStorage(),
      sessionStorage: createStorage(),
    });
    window.localStorage.setItem("onit_user", JSON.stringify({ id: "tasker-1" }));
    vi.spyOn(Date, "now").mockReturnValue(1_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns fresh cached data for the current performer", () => {
    writePerformerCache("dashboard", { tasks: [{ id: "task-1" }] });

    expect(readPerformerCache("dashboard", 30_000)).toEqual({
      tasks: [{ id: "task-1" }],
    });
  });

  it("does not expose one performer's cache to another performer", () => {
    writePerformerCache("dashboard", { tasks: [{ id: "task-1" }] });
    window.localStorage.setItem("onit_user", JSON.stringify({ id: "tasker-2" }));

    expect(readPerformerCache("dashboard", 30_000)).toBeNull();
  });

  it("ignores expired data", () => {
    writePerformerCache("dashboard", { tasks: [{ id: "task-1" }] });
    Date.now.mockReturnValue(31_001);

    expect(readPerformerCache("dashboard", 30_000)).toBeNull();
  });

  it("can render stale data while it revalidates", () => {
    writePerformerCache("tasks", { tasks: [{ id: "task-1" }] });
    Date.now.mockReturnValue(31_001);

    expect(readPerformerCache("tasks", 30_000, { allowStale: true })).toEqual({
      tasks: [{ id: "task-1" }],
    });
  });

  it("expires cached data without removing the last good payload", () => {
    writePerformerCache("tasks", { tasks: [{ id: "task-1" }] });
    expirePerformerCache("tasks");

    expect(readPerformerCache("tasks", 30_000)).toBeNull();
    expect(readPerformerCache("tasks", 30_000, { allowStale: true })).toEqual({
      tasks: [{ id: "task-1" }],
    });
  });

  it("shares an in-flight request across component remounts", async () => {
    const requestFactory = vi.fn(async () => ({ data: ["task-1"] }));

    const first = dedupePerformerRequest("active-tasks", requestFactory);
    const second = dedupePerformerRequest("active-tasks", requestFactory);

    expect(first).toBe(second);
    await expect(first).resolves.toEqual({ data: ["task-1"] });
    expect(requestFactory).toHaveBeenCalledTimes(1);
  });
});
