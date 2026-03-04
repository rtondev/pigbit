"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Zap, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { dashboard } from "@/lib/api";

interface Transaction {
  id: string | number;
  amountBrl: string;
  amountCrypto?: string;
  status: string;
  txHash?: string;
  confirmedAt?: string;
}

interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalVolumeBrl: number;
}

export function TransactionsStats() {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      // Fetch first page with larger limit to get enough transactions for analysis
      const response = await dashboard.transactions(1, 100);
      const transactions = response.data || [];

      const stats: TransactionStats = {
        total: response.meta.total || transactions.length,
        completed: transactions.filter((t: Transaction) => t.status === "completed" || t.status === "confirmed").length,
        pending: transactions.filter((t: Transaction) => t.status === "pending").length,
        failed: transactions.filter((t: Transaction) => t.status === "failed" || t.status === "cancelled").length,
        totalVolumeBrl: transactions.reduce((sum: number, t: Transaction) => {
          const amount = typeof t.amountBrl === "string" ? parseFloat(t.amountBrl) : t.amountBrl;
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0),
      };

      setStats(stats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas de transações:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatBrl(value: number | null | undefined) {
    const safe = typeof value === "number" && !Number.isNaN(value) ? value : 0;
    return safe.toFixed(2);
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-gray-200">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E84A86] border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-gray-900">Resumo de Transações</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total de Transações */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Total de transações</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        {/* Transações Concluídas */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </Card>

        {/* Transações Pendentes */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-50 p-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </Card>

        {/* Transações Falhadas */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Falhadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Volume Total em BRL */}
      {stats.totalVolumeBrl > 0 && (
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Volume total em transações</p>
              <p className="mt-1 text-3xl font-bold text-[#E84A86]">
                R$ {formatBrl(stats.totalVolumeBrl)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Taxa de conclusão</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">
                {stats.total > 0
                  ? ((stats.completed / stats.total) * 100).toFixed(1)
                  : "0"}
                %
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
