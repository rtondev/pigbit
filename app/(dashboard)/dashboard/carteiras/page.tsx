"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge, Button, Input, Select, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow } from "@/components/ui";
import { Plus, Trash2, Inbox } from "lucide-react";
import { wallets } from "@/lib/api";

interface Wallet {
  id: string | number;
  address: string;
  currency: string;
  isActive: boolean;
}

export default function CarteirasPage() {
  const [items, setItems] = useState<Wallet[]>([]);
  const [open, setOpen] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [moeda, setMoeda] = useState("btc");

  function load() {
    wallets.list().then(setItems).catch(console.error);
  }

  useEffect(() => {
    load();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    wallets.create({ address: endereco, currency: moeda }).then(() => {
      setOpen(false);
      setEndereco("");
      setMoeda("btc");
      load();
      toast.success("Carteira adicionada!");
    }).catch((err) => toast.error(err instanceof Error ? err.message : "Erro ao salvar"));
  }

  function handleDelete(id: string) {
    if (confirm("Remover carteira?")) wallets.delete(id).then(() => { load(); toast.success("Carteira removida!"); }).catch((err) => toast.error(err instanceof Error ? err.message : "Erro ao remover"));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Carteiras</h1>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova carteira
        </Button>
      </div>
      {items.length > 0 ? (
      <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Moeda</TableHeadCell>
              <TableHeadCell>Endereço</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell />
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {items.map((w) => (
              <TableRow key={String(w.id)}>
                <TableCell className="uppercase">{w.currency}</TableCell>
                <TableCell className="max-w-xs truncate font-mono text-sm">{w.address}</TableCell>
                <TableCell>
                  <Badge variant={w.isActive ? "success" : "failure"}>{w.isActive ? "Ativa" : "Inativa"}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="xs" variant="failure" onClick={() => handleDelete(String(w.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
          <Inbox className="mb-2 h-12 w-12 opacity-50" />
          <p>Nenhuma carteira</p>
        </div>
      )}
      <Modal show={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Nova carteira</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <Label>Selecione a moeda</Label>
                <Select
                  value={moeda}
                  onChange={(e) => setMoeda(e.target.value)}
                  className="mt-1"
                >
                  <option value="btc">BTC</option>
                  <option value="eth">ETH</option>
                  <option value="usdttrc20">USDT TRC20</option>
                </Select>
              </div>
              <div>
                <Label>Digite o endereço da carteira</Label>
                <Input value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço blockchain" required />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" variant="primary">Salvar</Button>
            <Button variant="gray" onClick={() => setOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
