export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

export const formatRelativeTime = (relativeTimeSeconds) => {
    let timeLeft = Math.abs(relativeTimeSeconds);
    const days = Math.floor(timeLeft / (24 * 3600));
    timeLeft %= 24 * 3600;
    const hours = Math.floor(timeLeft / 3600);
    timeLeft %= 3600;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const formatRelativeTime1 = (seconds) => {
    let absSeconds = Math.abs(seconds);
    let hours = Math.floor(absSeconds / 3600);
    let minutes = Math.floor((absSeconds % 3600) / 60);
    let secs = absSeconds % 60;

    return `${hours}h ${minutes}m ${secs}s`;
};
