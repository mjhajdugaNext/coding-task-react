"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

const logErrors = process.env.LOG_ERROR_LOGS === "true";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    if (logErrors) {
      console.error("Error boundary caught an error:", error);
    }
  }, [error]);

  const title = "Something went wrong";
  const description = "We could not load this page right now. Please try again or contact support if the problem persists.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="default" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
