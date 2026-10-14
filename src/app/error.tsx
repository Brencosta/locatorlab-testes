"use client";

import { RouteError } from "@/components/shared/route-error";

export default function RootError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <RouteError {...props} />
      </div>
    </main>
  );
}
