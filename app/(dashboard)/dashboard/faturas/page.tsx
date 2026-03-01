"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from "@/components/ui";
import { ExternalLink, Inbox } from "lucide-react";
import { invoices, products, type Invoice, type Product } from "@/lib/api";

export default function FaturasPage() {
  const [moedas, setMoedas] = useState<string[]>(["btc", "eth"]);
  const [data, setData] = useState<{ data: Invoice[]; meta: { total: number; page: number } }>({
    data: [],
    meta: { total: 0, page: 1 },
  });
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [valorBrl, setValorBrl] = useState("");
  const [moedaCripto, setMoedaCripto] = useState("btc");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  function load() {
    invoices.list(1, 20).then(setData).catch(console.error);
  }

  useEffect(() => {
    load();
    products.list().then(setProductsList).catch(() => {});
    invoices.currencies().then((c) => {
        const list = c?.length ? c : ["btc", "eth"];
        setMoedas(list);
        setMoedaCripto((prev) => (list.includes(prev) ? prev : list[0] || "btc"));
      }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedProduct = productsList.find((p) => String(p.id) === productId);
      const amountFromProduct = selectedProduct ? parseFloat(selectedProduct.priceBrl) : 0;
      const amountManual = parseFloat(valorBrl.replace(",", ".") || "0");
      const amountBrl = productId ? amountFromProduct : amountManual;
      const inv = await invoices.create({
        valorBrl: amountBrl,
        moedaCripto: moedaCripto,
        productId: productId ? String(productId) : undefined,
      });
      setValorBrl("");
      setProductId("");
      load();
      toast.success("Fatura criada!");
      if (inv.paymentId) {
        window.open(`/checkout/${inv.paymentId}`, "_blank");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar fatura");
    } finally {
      setLoading(false);
    }
  }

  const valorNum = valorBrl ? parseFloat(valorBrl.replace(",", ".")) : 0;
  const canSubmit = productId || (valorBrl && valorNum > 0);
  const items = data.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Faturas</h1>
      <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Nova fatura</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Produto (opcional)</Label>
            <Select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                if (e.target.value) setValorBrl("");
              }}
              className="mt-1"
            >
              <option value="">Valor manual</option>
              {Array.isArray(productsList) && productsList.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {p.name} - R$ {parseFloat(p.priceBrl).toFixed(2)}
                </option>
              ))}
            </Select>
          </div>

          {!productId && (
            <div>
              <Label>Valor em reais</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={valorBrl}
                onChange={(e) => setValorBrl(e.target.value)}
                placeholder="0,00"
                disabled={!!productId}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label>Moeda</Label>
            <Select
              value={moedaCripto}
              onChange={(e) => setMoedaCripto(e.target.value)}
              className="mt-1"
            >
              {moedas.map((m) => (
                <option key={m} value={m}>
                  {m.toUpperCase()}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !canSubmit}
          >
            {loading ? "Criando..." : "Criar fatura"}
          </Button>
        </form>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Faturas</h2>
          {items.length > 0 ? (
            <Table>
              <TableHead>
                <TableHeadRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Valor</TableHeadCell>
                  <TableHeadCell>Cripto</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Data</TableHeadCell>
                  <TableHeadCell></TableHeadCell>
                </TableHeadRow>
              </TableHead>
              <TableBody>
                {items.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-sm">{i.paymentId}</TableCell>
                    <TableCell>R$ {parseFloat(i.amountBrl).toFixed(2)}</TableCell>
                    <TableCell>{i.cryptoCurrency?.toUpperCase() || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          i.status === "finished"
                            ? "success"
                            : i.status === "expired"
                              ? "failure"
                              : "warning"
                        }
                      >
                        {i.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {i.expiresAt ? new Date(i.expiresAt).toLocaleDateString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/checkout/${i.paymentId}`}
                        target="_blank"
                        className="text-[#E84A86] hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
              <Inbox className="mb-2 h-12 w-12 opacity-50" />
              <p>Nenhuma fatura</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
