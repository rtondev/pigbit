"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  ArrowDownCircle,
  Package,
  Key,
  FileText,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

const items = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    iconBg: "bg-[#6EA8FF]",
    iconColor: "text-[#1E3A8A]",
  },
  {
    href: "/dashboard/faturas",
    icon: Receipt,
    label: "Faturas (Cobrar)",
    iconBg: "bg-[#7DE3A2]",
    iconColor: "text-[#166534]",
  },
  {
    href: "/dashboard/produtos",
    icon: Package,
    label: "Produtos",
    iconBg: "bg-[#FFB86B]",
    iconColor: "text-[#9A3412]",
  },
  {
    href: "/dashboard/transacoes",
    icon: FileText,
    label: "Transações",
    iconBg: "bg-[#8FD3FF]",
    iconColor: "text-[#075985]",
  },
  {
    href: "/dashboard/carteiras",
    icon: Wallet,
    label: "Carteiras",
    iconBg: "bg-[#B59BFF]",
    iconColor: "text-[#4C1D95]",
  },
  {
    href: "/dashboard/saques",
    icon: ArrowDownCircle,
    label: "Saques",
    iconBg: "bg-[#FFD16A]",
    iconColor: "text-[#92400E]",
  },
  {
    href: "/dashboard/chaves-api",
    icon: Key,
    label: "Chaves API",
    iconBg: "bg-[#FF89B5]",
    iconColor: "text-[#9D174D]",
  },
  {
    href: "/dashboard/auditoria",
    icon: FileText,
    label: "Auditoria",
    iconBg: "bg-[#6DD6E5]",
    iconColor: "text-[#0E7490]",
  },
  {
    href: "/dashboard/perfil",
    icon: User,
    label: "Perfil",
    iconBg: "bg-[#FFA3A3]",
    iconColor: "text-[#9F1239]",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-gray-200 bg-white text-gray-900">
      <Link
        href="/dashboard"
        className="flex items-center border-b border-gray-200 px-6 py-5"
      >
        <Logo height={28} />
      </Link>
      <nav className="flex-1 space-y-2 overflow-y-auto px-5 py-6">
        {items.map(({ href, icon: Icon, label, iconBg, iconColor }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#FDF2F8] text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg} ${iconColor} shadow-sm`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
