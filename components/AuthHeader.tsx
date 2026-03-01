"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Logo } from "@/components/Logo";

type AuthHeaderProps = {
  actionHref: string;
  actionLabel: string;
};

export function AuthHeader({ actionHref, actionLabel }: AuthHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <Link href="/">
        <Logo height={28} />
      </Link>
      <Link href={actionHref}>
        <Button variant="outline" size="sm">
          {actionLabel}
        </Button>
      </Link>
    </header>
  );
}
