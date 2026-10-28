import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/lib/demo-data/store";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "UniCore — Nigerian University Management SaaS Demo MVP",
  description:
    "An interactive enterprise multi-role demonstration prototype for Nigerian higher education institutions, polytechnics, and colleges of education.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <DemoProvider>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading UniCore Demonstration...</div>}>
            {children}
          </Suspense>
        </DemoProvider>
      </body>
    </html>
  );
}
