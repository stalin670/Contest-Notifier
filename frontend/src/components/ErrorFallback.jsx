import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div
        role="alert"
        className="mx-auto my-12 max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30"
    >
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Something went wrong</h2>
        <p className="mt-1 break-words text-sm text-gray-600 dark:text-gray-400">{error?.message ?? "Unknown error"}</p>
        {resetErrorBoundary && (
            <button
                type="button"
                onClick={resetErrorBoundary}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
                <RefreshCw className="h-4 w-4" /> Try again
            </button>
        )}
    </div>
);

export default ErrorFallback;
