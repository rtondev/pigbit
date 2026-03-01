"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow } from "@/components/ui";
import { Inbox } from "lucide-react";
import { dashboard } from "@/lib/api";

export default function TransacoesPage() {
  const [data, setData] = useState<{ data: unknown[] }>({ data: [] });

  useEffect(() => {
    dashboard.transactions(1, 20).then(setData).catch(console.error);
  }, []);

  const items = (data.data || []) as Array<{
    id: string;
    amountBrl: string;
    amountCrypto?: string;
    status: string;
    confirmedAt?: string;
    txHash?: string;
  }>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Transações</h1>
      {items.length > 0 ? (
      <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Valor BRL</TableHeadCell>
              <TableHeadCell>Cripto</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Data</TableHeadCell>
              <TableHeadCell>TX Hash</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>R$ {parseFloat(t.amountBrl).toFixed(2)}</TableCell>
                <TableCell>{t.amountCrypto ? t.amountCrypto : "-"}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>
                  {t.confirmedAt ? new Date(t.confirmedAt).toLocaleDateString("pt-BR") : "-"}
                </TableCell>
                <TableCell className="font-mono text-xs">{t.txHash || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
          <Inbox className="mb-2 h-12 w-12 opacity-50" />
          <p>Nenhuma transação</p>
        </div>
      )}
    </div>
  );
}
