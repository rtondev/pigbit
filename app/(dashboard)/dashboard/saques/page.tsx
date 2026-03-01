"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Select,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from "@/components/ui";
import toast from "react-hot-toast";
import { Plus, Inbox } from "lucide-react";
import { withdrawals, wallets, dashboard, type Withdrawal } from "@/lib/api";

export default function SaquesPage() {
  const [data, setData] = useState<{ data: Withdrawal[]; meta: { total: number; page: number } }>({
    data: [],
    meta: { total: 0, page: 1 },
  });
  const [walletList, setWalletList] = useState<{ id: string | number; address: string; currency: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [amountBrl, setAmountBrl] = useState("");
  const [password, setPassword] = useState("");
  const [appCode, setAppCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);

  function load() {
    withdrawals.list(1, 20).then(setData).catch(console.error);
  }

  useEffect(() => {
    load();
    wallets.list().then((w) => setWalletList(w)).catch(() => {});
    dashboard
      .metrics()
      .then((m) => setAvailableBalance(m.availableBalanceBrl ?? 0))
      .catch(() => setAvailableBalance(0));
  }, []);

  function formatBrl(value: number | null) {
    if (value == null || Number.isNaN(value)) return "0.00";
    return value.toFixed(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valor = parseFloat(amountBrl);
    if (!walletId || !password || Number.isNaN(valor) || valor <= 0) return;
    if (availableBalance != null && valor > availableBalance) {
      toast.error("Valor acima do disponível para saque.");
      return;
    }
    setLoading(true);
    try {
      await withdrawals.create({
        walletId: String(walletId),
        amountBrl: valor,
        password,
        appCode: appCode || undefined,
      });
      setOpen(false);
      setWalletId("");
      setAmountBrl("");
      setPassword("");
      setAppCode("");
      load();
      toast.success("Saque solicitado!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao solicitar saque");
    } finally {
      setLoading(false);
    }
  }

  const items = data.data || [];
  const amountValue = parseFloat(amountBrl);
  const amountInvalid = !amountBrl || Number.isNaN(amountValue) || amountValue <= 0;
  const exceedsBalance =
    availableBalance != null && !Number.isNaN(amountValue) && amountValue > availableBalance;
  const canSubmit = !!walletId && !!password && !amountInvalid && !exceedsBalance;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Saques</h1>
          <p className="text-sm text-gray-500">
            Disponível para saque: R$ {formatBrl(availableBalance)}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setOpen(true)}
          disabled={walletList.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Solicitar saque
        </Button>
      </div>
      {items.length > 0 ? (
      <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Valor</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Data</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell>R$ {parseFloat(s.amountBrl).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      s.status === "completed"
                        ? "success"
                        : s.status === "failed"
                          ? "failure"
                          : "warning"
                    }
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
          <Inbox className="mb-2 h-12 w-12 opacity-50" />
          <p>Nenhum saque</p>
        </div>
      )}

      <Modal show={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Solicitar saque</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <Label>Selecione a carteira de destino</Label>
                <Select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="mt-1"
                  required
                >
                  <option value="">Selecione...</option>
                  {walletList.filter((w) => w).map((w) => (
                    <option key={String(w.id)} value={String(w.id)}>
                      {w.currency.toUpperCase()} - {w.address.slice(0, 12)}...
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Digite o valor em reais</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amountBrl}
                  onChange={(e) => setAmountBrl(e.target.value)}
                  placeholder="0,00"
                  required
                />
                {amountInvalid && (
                  <p className="mt-1 text-xs text-red-600">Informe um valor maior que 0.</p>
                )}
                {exceedsBalance && (
                  <p className="mt-1 text-xs text-red-600">
                    Valor acima do disponível para saque.
                  </p>
                )}
              </div>
              <div>
                <Label>Digite sua senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
              </div>
              <div>
                <Label>Código 2FA (se ativado)</Label>
                <Input
                  value={appCode}
                  onChange={(e) => setAppCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" variant="primary" disabled={loading || !canSubmit}>
              {loading ? "Enviando..." : "Solicitar"}
            </Button>
            <Button variant="gray" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
