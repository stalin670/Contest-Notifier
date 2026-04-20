import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { normalizeCodeforces, normalizeClist } = require("../lib/dto");

describe("normalizeCodeforces", () => {
    it("maps fields to unified shape", () => {
        const out = normalizeCodeforces({
            id: 123,
            name: "Round 999",
            startTimeSeconds: 1_700_000_000,
            durationSeconds: 7200,
        });
        expect(out).toEqual({
            contestId: "codeforces-123",
            platform: "codeforces",
            name: "Round 999",
            url: "https://codeforces.com/contest/123",
            start: new Date(1_700_000_000 * 1000).toISOString(),
            end: new Date((1_700_000_000 + 7200) * 1000).toISOString(),
            durationSec: 7200,
        });
    });
});

describe("normalizeClist", () => {
    it("maps leetcode contest", () => {
        const out = normalizeClist("leetcode")({
            id: 42,
            event: "Weekly 500",
            href: "https://leetcode.com/contest/weekly-500",
            start: "2026-05-01T00:00:00Z",
            end: "2026-05-01T01:30:00Z",
            duration: 5400,
        });
        expect(out.contestId).toBe("leetcode-42");
        expect(out.platform).toBe("leetcode");
        expect(out.name).toBe("Weekly 500");
        expect(out.durationSec).toBe(5400);
    });
});
