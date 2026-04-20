import { AlertTriangle } from "lucide-react";
import { useContests } from "../hooks/useContests";

const ErrorsBanner = () => {
    const { data } = useContests();
    const errs = data?.errors ?? [];
    if (!errs.length) return null;

    return (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
                <strong>Some platforms failed to load:</strong> {errs.map((e) => e.platform).join(", ")}.{" "}
                <span className="opacity-80">Check backend CLIST_API_KEY.</span>
            </div>
        </div>
    );
};

export default ErrorsBanner;
