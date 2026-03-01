"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
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
import { Plus, Copy, Trash2, Inbox } from "lucide-react";
import { apiKeys } from "@/lib/api";

interface ApiKeyItem {
  id: string | number;
  name: string;
  keyPrefix: string;
  createdAt: string;
  revokedAt?: string;
}

export default function ChavesApiPage() {
  const [items, setItems] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [plainKey, setPlainKey] = useState<string | null>(null);
  const [newKeyId, setNewKeyId] = useState<string | null>(null);

  function load() {
    apiKeys
      .list()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiKeys.create({ name });
      setPlainKey(res.apiKey || null);
      setNewKeyId(String(res.id));
      load();
      setName("");
      toast.success("Chave criada! Copie-a agora.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar chave");
    }
  }

  function handleClose() {
    setOpen(false);
    setPlainKey(null);
    setNewKeyId(null);
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revogar esta chave? Ela deixará de funcionar imediatamente.")) return;
    try {
      await apiKeys.revoke(id);
      load();
      toast.success("Chave revogada!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao revogar");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Chave copiada!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Chaves API</h1>
          <p className="text-sm text-gray-500">
            Use chaves API para integrar sistemas externos. A chave completa é exibida apenas uma vez na criação.
          </p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova chave
        </Button>
      </div>
      {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white py-8 text-center text-gray-500">Carregando...</div>
        ) : items.length > 0 ? (
          <Table>
            <TableHead>
              <TableHeadRow>
                <TableHeadCell>Nome</TableHeadCell>
                <TableHeadCell>Prefixo</TableHeadCell>
                <TableHeadCell>Criada em</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell></TableHeadCell>
              </TableHeadRow>
            </TableHead>
            <TableBody>
              {items.map((k) => (
                <TableRow key={String(k.id)}>
                  <TableCell>{k.name}</TableCell>
                  <TableCell className="font-mono text-sm">{k.keyPrefix}...</TableCell>
                  <TableCell>{new Date(k.createdAt).toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    {k.revokedAt ? "Revogada" : "Ativa"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      variant="failure"
                      onClick={() => handleRevoke(String(k.id))}
                    >
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
            <p>Nenhuma chave cadastrada</p>
          </div>
        )}

      <Modal show={open} onClose={handleClose}>
        {plainKey ? (
          <>
            <ModalHeader>Chave criada</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <Label>Copie a chave agora – ela não será exibida novamente</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      readOnly
                      value={plainKey}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="gray"
                      onClick={() => copyToClipboard(plainKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={handleClose}>
                Entendi
              </Button>
            </ModalFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <ModalHeader>Nova chave API</ModalHeader>
            <ModalBody>
              <div>
                <Label htmlFor="name">Digite um nome para identificar a chave</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Servidor produção"
                  required
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" variant="primary" disabled={!name}>
                Gerar chave
              </Button>
              <Button variant="gray" onClick={handleClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        )}
      </Modal>
    </div>
  );
}
