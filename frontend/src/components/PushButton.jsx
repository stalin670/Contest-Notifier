import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { pushSupported, registerSW, getExistingSubscription, subscribe, unsubscribe, getPublicKey } from "../lib/push";
import { usePrefsStore } from "../store/usePrefsStore";

const PushButton = () => {
    const timezone = usePrefsStore((s) => s.timezone);
    const [supported, setSupported] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            if (!pushSupported()) return;
            setSupported(true);
            try {
                await registerSW();
                const { enabled } = await getPublicKey();
                setEnabled(enabled);
                const sub = await getExistingSubscription();
                setSubscribed(Boolean(sub));
            } catch {
                /* ignore */
            }
        })();
    }, []);

    if (!supported || !enabled) return null;

    const toggle = async () => {
        setErr("");
        setBusy(true);
        try {
            if (subscribed) {
                await unsubscribe();
                setSubscribed(false);
            } else {
                await subscribe({ timezone });
                setSubscribed(true);
            }
        } catch (e) {
            setErr(e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={busy}
            aria-pressed={subscribed}
            title={err || (subscribed ? "Disable notifications" : "Enable notifications")}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500"
        >
            {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : subscribed ? (
                <BellOff className="h-4 w-4" />
            ) : (
                <Bell className="h-4 w-4" />
            )}
            {subscribed ? "Notifs on" : "Notify me"}
        </button>
    );
};

export default PushButton;
