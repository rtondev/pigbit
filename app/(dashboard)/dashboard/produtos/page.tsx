"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow } from "@/components/ui";
import { Plus, Pencil, Trash2, Inbox } from "lucide-react";
import { products, type Product } from "@/lib/api";

export default function ProdutosPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorBrl, setValorBrl] = useState("");

  function load() {
    products.list().then(setItems).catch(console.error);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setEditing(null);
    setNome("");
    setDescricao("");
    setValorBrl("");
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valor = parseFloat(valorBrl);
    if (editing) {
      products
        .update(String(editing.id), { name: nome, description: descricao || undefined, priceBrl: valor })
        .then(() => {
        resetForm();
        load();
        toast.success("Produto atualizado!");
      }).catch((err) => toast.error(err instanceof Error ? err.message : "Erro ao atualizar"));
    } else {
      products
        .create({ name: nome, description: descricao || undefined, priceBrl: valor })
        .then(() => {
        resetForm();
        load();
        toast.success("Produto criado!");
      }).catch((err) => toast.error(err instanceof Error ? err.message : "Erro ao criar"));
    }
  }

  function handleDelete(id: string | number) {
    if (confirm("Excluir produto?")) {
      products
        .delete(String(id))
        .then(() => {
          load();
          toast.success("Produto excluído!");
        })
        .catch((err) => toast.error(err instanceof Error ? err.message : "Erro ao excluir"));
    }
  }

  function openEdit(p: Product) {
    setEditing(p);
    setNome(p.name);
    setDescricao(p.description || "");
    setValorBrl(p.priceBrl);
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Produtos</h1>
        <Button variant="primary" onClick={() => { resetForm(); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo produto
        </Button>
      </div>
      {items.length > 0 ? (
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Nome</TableHeadCell>
              <TableHeadCell>Descrição</TableHeadCell>
              <TableHeadCell>Valor (R$)</TableHeadCell>
              <TableHeadCell />
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell className="max-w-xs truncate">{p.description || "-"}</TableCell>
                <TableCell>R$ {parseFloat(p.priceBrl).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" variant="gray" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="xs" variant="failure" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
          <Inbox className="mb-2 h-12 w-12 opacity-50" />
          <p>Nenhum produto</p>
        </div>
      )}
      <Modal show={open} onClose={resetForm}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{editing ? "Editar produto" : "Novo produto"}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <Label>Digite o nome do produto</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Plano Premium" required />
              </div>
              <div>
                <Label>Digite a descrição</Label>
                <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do produto (opcional)" />
              </div>
              <div>
                <Label>Digite o valor em reais</Label>
                <Input type="number" step="0.01" value={valorBrl} onChange={(e) => setValorBrl(e.target.value)} placeholder="0,00" required />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" variant="primary">Salvar</Button>
            <Button variant="gray" onClick={resetForm}>Cancelar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
