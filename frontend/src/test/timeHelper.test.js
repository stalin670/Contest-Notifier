import { describe, it, expect } from "vitest";
import { formatDuration } from "../utils/timeHelper";

describe("formatDuration", () => {
    it("formats hours+minutes", () => {
        expect(formatDuration(7200)).toBe("2h");
        expect(formatDuration(5400)).toBe("1h 30m");
    });
    it("handles empty", () => {
        expect(formatDuration(0)).toBe("—");
    });
});
