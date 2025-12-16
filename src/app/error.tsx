"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportClientError } from "@/lib/monitoring";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    reportClientError(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          We could not load the accounts. Please try again or contact support if the problem
          persists.
        </p>
      </div>
      <Button variant="default" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
