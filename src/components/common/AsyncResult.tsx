import type { ReactNode } from "react";

interface AsyncResultProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  label: string;
  children: ReactNode;
}

const AsyncResult = ({
  status,
  error,
  label,
  children,
}: AsyncResultProps) => {
  if (status === "loading") {
    return (
      <div
        className="p-8 text-center text-gray-600"
        role="status"
        aria-live="polite"
      >
        Loading {label.toLowerCase()}…
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className="m-6 rounded-lg border border-red-200 bg-red-50 p-6 text-red-900"
        role="alert"
      >
        <h2 className="font-semibold">{label} are unavailable</h2>
        <p className="mt-1 text-sm">
          {error ?? `Unable to load ${label.toLowerCase()}.`}
        </p>
      </div>
    );
  }

  return children;
};

export default AsyncResult;
