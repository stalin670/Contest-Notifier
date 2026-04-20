self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch {
        payload = { title: "Contest starting", body: event.data?.text() || "" };
    }
    const title = payload.title || "Contest Notifier";
    const options = {
        body: payload.body || "",
        data: { url: payload.url || "/" },
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: payload.contestId || "contest",
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";
    event.waitUntil(
        self.clients.matchAll({ type: "window" }).then((list) => {
            for (const client of list) {
                if (client.url === url && "focus" in client) return client.focus();
            }
            return self.clients.openWindow(url);
        })
    );
});
