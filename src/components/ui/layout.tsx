import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: Props) {
  return (
    <main className={cn("min-h-screen bg-gradient-to-b from-slate-50 to-white", className)}>
      {children}
    </main>
  );
}

export function PageContainer({ children, className }: Props) {
  return <div className={cn("container space-y-8 py-10", className)}>{children}</div>;
}

export function PageHeader({ children, className }: Props) {
  return <header className={cn("space-y-3", className)}>{children}</header>;
}

export function PageEyebrow({ children, className }: Props) {
  return (
    <p className={cn("text-xs uppercase tracking-wide text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1 className={cn("text-3xl font-semibold tracking-tight text-foreground", className)}>
      {children}
    </h1>
  );
}

export function PageDescription({ children, className }: Props) {
  return (
    <p className={cn("max-w-2xl text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function Section({ children, className }: Props) {
  return <section className={cn("space-y-4", className)}>{children}</section>;
}
