import { describe, it, expect } from "vitest";
import { buildIcs, googleCalendarUrl } from "../lib/ics";

const sample = {
    contestId: "codeforces-123",
    platform: "codeforces",
    name: "Round, 999",
    url: "https://codeforces.com/contest/123",
    start: "2026-05-01T12:00:00Z",
    end: "2026-05-01T14:00:00Z",
    durationSec: 7200,
};

describe("buildIcs", () => {
    it("contains required VCALENDAR fields", () => {
        const ics = buildIcs(sample);
        expect(ics).toContain("BEGIN:VCALENDAR");
        expect(ics).toContain("DTSTART:20260501T120000Z");
        expect(ics).toContain("DTEND:20260501T140000Z");
        expect(ics).toContain("UID:codeforces-123@contest-notifier");
    });

    it("escapes commas in summary", () => {
        const ics = buildIcs(sample);
        expect(ics).toContain("SUMMARY:Round\\, 999");
    });
});

describe("googleCalendarUrl", () => {
    it("includes dates range", () => {
        const url = googleCalendarUrl(sample);
        expect(url).toContain("dates=20260501T120000Z%2F20260501T140000Z");
    });
});
