import { api } from "./api";

const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
};

export const pushSupported = () =>
    typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;

export const registerSW = async () => {
    if (!pushSupported()) return null;
    return navigator.serviceWorker.register("/sw.js");
};

export const getPublicKey = async () => {
    const { data } = await api.get("/api/push/public-key");
    return data;
};

export const getExistingSubscription = async () => {
    const reg = await navigator.serviceWorker.ready;
    return reg.pushManager.getSubscription();
};

export const subscribe = async ({ timezone }) => {
    const { publicKey, enabled } = await getPublicKey();
    if (!enabled || !publicKey) throw new Error("Push not enabled on server");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Permission denied");

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await api.post("/api/push/subscribe", { ...sub.toJSON(), timezone });
    return sub;
};

export const unsubscribe = async () => {
    const sub = await getExistingSubscription();
    if (!sub) return;
    await api.post("/api/push/unsubscribe", { endpoint: sub.endpoint });
    await sub.unsubscribe();
};
