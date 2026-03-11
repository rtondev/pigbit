"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Receipt, DollarSign } from "lucide-react";
import { publicApi } from "@/lib/api";
import { Card } from "@/components/ui";

interface PublicStatsData {
  totalClients: number;
  totalTransactions: number;
  totalInvoices: number;
  totalVolumeBrl: number;
}

type PublicStatsProps = {
  /** Quando true, não envolve em section com padding extra (uso embutido na landing) */
  embedded?: boolean;
  className?: string;
};

export function PublicStats({ embedded, className = "" }: PublicStatsProps) {
  const [stats, setStats] = useState<PublicStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await publicApi.stats();
        setStats(data);
      } catch {
        // silencioso na landing
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  }

  if (loading || !stats) return null;

  const grid = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gray-100 p-3">
            <Users className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Clientes</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalClients.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </Card>
      <Card className="border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gray-100 p-3">
            <TrendingUp className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Transações</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalTransactions.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </Card>
      <Card className="border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gray-100 p-3">
            <Receipt className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Faturas</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalInvoices.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </Card>
      <Card className="border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#E84A86]/10 p-3">
            <DollarSign className="h-6 w-6 text-[#E84A86]" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Volume</p>
            <p className="text-xl font-bold text-[#E84A86]">
              {formatCurrency(stats.totalVolumeBrl)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  if (embedded) {
    return <div className={className}>{grid}</div>;
  }

  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Números da plataforma
          </h2>
          <p className="mt-2 text-gray-600">
            Transparência em tempo real da comunidade Pigbit
          </p>
        </header>
        {grid}
      </div>
    </section>
  );
}
