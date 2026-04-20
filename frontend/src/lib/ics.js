const pad = (n) => String(n).padStart(2, "0");

const toIcsDate = (iso) => {
    const d = new Date(iso);
    return (
        d.getUTCFullYear() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) +
        "T" +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) +
        "Z"
    );
};

const escapeText = (s = "") => s.replace(/[\\,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");

export const buildIcs = (contest) =>
    [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Contest Notifier//EN",
        "BEGIN:VEVENT",
        `UID:${contest.contestId}@contest-notifier`,
        `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
        `DTSTART:${toIcsDate(contest.start)}`,
        `DTEND:${toIcsDate(contest.end)}`,
        `SUMMARY:${escapeText(contest.name)}`,
        `DESCRIPTION:${escapeText(contest.platform)} contest`,
        `URL:${contest.url}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

export const downloadIcs = (contest) => {
    const blob = new Blob([buildIcs(contest)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contest.platform}-${contest.contestId}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

export const googleCalendarUrl = (contest) => {
    const fmt = (iso) => toIcsDate(iso);
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: contest.name,
        dates: `${fmt(contest.start)}/${fmt(contest.end)}`,
        details: `${contest.platform} contest — ${contest.url}`,
        location: contest.url,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
