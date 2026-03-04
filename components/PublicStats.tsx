"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Receipt, DollarSign } from "lucide-react";

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
        const response = await fetch("/api/public/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
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
          Já somos confiados por milhares
        </h2>
        <p className="text-lg text-gray-600">
          Veja os números da nossa plataforma de pagamentos em criptomoedas
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Clientes */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="mb-2 text-4xl font-bold text-gray-900">
            {stats.totalClients.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-700">Clientes ativos</p>
        </div>

        {/* Transações */}
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <p className="mb-2 text-4xl font-bold text-gray-900">
            {stats.totalTransactions.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-700">Transações concluídas</p>
        </div>

        {/* Faturas */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
            <Receipt className="h-8 w-8 text-white" />
          </div>
          <p className="mb-2 text-4xl font-bold text-gray-900">
            {stats.totalInvoices.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-700">Faturas emitidas</p>
        </div>

        {/* Volume */}
        <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-600">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <p className="mb-2 text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalVolumeBrl)}
          </p>
          <p className="text-sm font-medium text-gray-700">Volume processado</p>
        </div>
      </div>
    </section>
  );
}
