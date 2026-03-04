"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { DollarSign, ShoppingCart, TrendingUp, Receipt, Package, Wallet, ArrowDownCircle } from "lucide-react";
import { dashboard } from "@/lib/api";
import Link from "next/link";
import { TransactionsStats } from "@/components/TransactionsStats";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<{
    totalProcessedBrl: number;
    activeInvoicesCount: number;
    availableBalanceBrl: number;
    lastSevenDaysVolume: number[];
  } | null>(null);

  useEffect(() => {
    dashboard.metrics().then(setMetrics).catch(console.error);
  }, []);

  function formatBrl(value: number | null | undefined, hideZero = false) {
    const safe = typeof value === "number" && !Number.isNaN(value) ? value : null;
    if (safe === null) return "0.00";
    if (hideZero && safe === 0) return "0.00";
    return safe.toFixed(2);
  }

  const hasVolumeData =
    Array.isArray(metrics?.lastSevenDaysVolume) &&
    metrics.lastSevenDaysVolume.some((v) => Number(v) > 0);

  if (!metrics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E84A86] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#E84A86]/15 p-2">
              <DollarSign className="h-6 w-6 text-[#E84A86]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Volume transacionado</p>
              <p className="text-xl font-semibold">R$ {formatBrl(metrics.totalProcessedBrl)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-50 p-2">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Faturas ativas</p>
              <p className="text-xl font-semibold">
                {metrics.activeInvoicesCount ?? "0"}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-amber-50 p-2">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Saldo disponível</p>
              <p className="text-xl font-semibold">R$ {formatBrl(metrics.availableBalanceBrl)}</p>
            </div>
          </div>
        </Card>
      </div>

      <TransactionsStats />

      <Card>
        <h2 className="mb-4 text-base font-semibold">Volume últimos 7 dias</h2>
        {hasVolumeData ? (
          <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
            {(metrics.lastSevenDaysVolume ?? []).map((v, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <span className="text-gray-500">Dia {idx + 1}:</span>{" "}
                <span className="font-semibold text-gray-900">
                  R$ {formatBrl(Number(v), true)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            Sem dados nos últimos 7 dias.
          </div>
        )}
      </Card>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">Acesso rápido</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/faturas"
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF2F8] text-[#E84A86]">
              <Receipt className="h-4 w-4" />
            </span>
            Faturas
          </Link>
          <Link
            href="/dashboard/produtos"
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Package className="h-4 w-4" />
            </span>
            Produtos
          </Link>
          <Link
            href="/dashboard/carteiras"
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <Wallet className="h-4 w-4" />
            </span>
            Carteiras
          </Link>
          <Link
            href="/dashboard/saques"
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <ArrowDownCircle className="h-4 w-4" />
            </span>
            Saques
          </Link>
        </div>
      </div>
    </div>
  );
}
