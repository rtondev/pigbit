"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Receipt, DollarSign } from "lucide-react";
import { publicApi } from "@/lib/api";
import { Card } from "@/components/ui";

interface PublicStats {
  totalClients: number;
  totalTransactions: number;
  totalInvoices: number;
  totalVolumeBrl: number;
}

export function PublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await publicApi.stats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas públicas:", error);
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

  if (loading || !stats) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Números da plataforma
        </h2>
        <p className="text-gray-600">Confira nossa comunidade em crescimento</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <Users className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalClients.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <TrendingUp className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Transações</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTransactions.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <Receipt className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Faturas</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalInvoices.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#E84A86]/10 p-3">
              <DollarSign className="h-6 w-6 text-[#E84A86]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Volume</p>
              <p className="text-xl font-bold text-[#E84A86]">
                {formatCurrency(stats.totalVolumeBrl)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

