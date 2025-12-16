import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compliance Accounts",
  description: "Accounts impacted by compliance events, with SSR and sorting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-background text-foreground antialiased"
      >
        {children}
      </body>
    </html>
  );
}
