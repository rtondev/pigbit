"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Logo } from "@/components/Logo";
import { Menu } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="md:hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="rounded-lg border border-gray-200 p-2 text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center">
            <Logo height={22} />
          </Link>
        </header>
      </div>

      <div className="relative md:flex">
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform md:static md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </aside>

        <main className="flex-1 bg-gray-50 p-6 md:p-8">
          <div className="min-h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </div>
    </div>
  );
}
