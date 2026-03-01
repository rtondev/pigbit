"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow } from "@/components/ui";
import { auditLogs, type AuditLogItem } from "@/lib/api";

const ACAO_LABEL: Record<string, string> = {
  REGISTER_REQUEST: "Cadastro iniciado",
  REGISTER_CONFIRM: "Cadastro confirmado",
  LOGIN_FAILED: "Falha no login",
  LOGIN_EMAIL_CODE_SENT: "Código de login enviado",
  LOGIN_SUCCESS: "Login realizado",
  PASSWORD_RESET: "Senha redefinida",
  WITHDRAWAL_REQUEST: "Saque solicitado",
  WITHDRAWAL_UPDATED: "Saque atualizado",
  WALLET_CREATED: "Carteira criada",
  WALLET_DELETED: "Carteira removida",
  criacao_conta: "Cadastro confirmado",
  login: "Login realizado",
  login_falha: "Falha no login",
  senha_alterada: "Senha alterada",
  alteracao_perfil: "Perfil atualizado",
  alteracao_email: "E-mail atualizado",
  alteracao_cnpj: "CNPJ atualizado",
  saque_solicitado: "Saque solicitado",
  saque_atualizado: "Saque atualizado",
  config_wallet: "Carteira configurada",
  troca_wallet: "Carteira alterada",
};

function getEntityInfo(log: AuditLogItem): { entity: string; entityId?: string } {
  const meta = log.metadata || {};
  if (meta.withdrawalId) return { entity: "Saque", entityId: String(meta.withdrawalId) };
  if (meta.walletId) return { entity: "Carteira", entityId: String(meta.walletId) };
  const action = (log.action || "").toLowerCase();
  if (action.includes("login")) return { entity: "Sessão" };
  if (action.includes("register") || action.includes("criacao_conta")) return { entity: "Conta" };
  if (action.includes("senha") || action.includes("password")) return { entity: "Senha" };
  if (action.includes("perfil") || action.includes("email") || action.includes("cnpj"))
    return { entity: "Perfil" };
  return { entity: "-" };
}

export default function AuditoriaPage() {
  const [data, setData] = useState<{ data: AuditLogItem[]; meta: { total: number; page: number; totalPages?: number } }>({
    data: [],
    meta: { total: 0, page: 1 },
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    auditLogs
      .list(page, 20)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const { data: items, meta } = data;
  const totalPages = (meta.totalPages ?? Math.ceil(meta.total / 20)) || 1;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">Auditoria</h1>
        <p className="text-sm text-gray-500">
          Histórico de ações críticas realizadas na sua conta.
        </p>
      </div>
      {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white py-8 text-center text-gray-500">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
            <Inbox className="mb-2 h-12 w-12 opacity-50" />
            <p>Nenhum registro de auditoria</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableHeadRow>
                  <TableHeadCell>Ação</TableHeadCell>
                  <TableHeadCell>Entidade</TableHeadCell>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>IP</TableHeadCell>
                  <TableHeadCell>Data</TableHeadCell>
                </TableHeadRow>
              </TableHead>
              <TableBody>
                {items.map((log, idx) => {
                  const { entity, entityId } = getEntityInfo(log);
                  const label = ACAO_LABEL[log.action] || log.action || "-";
                  return (
                    <TableRow key={`${log.createdAt}-${idx}`}>
                      <TableCell>
                        <Badge variant="info">{label}</Badge>
                      </TableCell>
                      <TableCell>{entity}</TableCell>
                      <TableCell className="font-mono text-xs">{entityId || "-"}</TableCell>
                      <TableCell className="text-sm">{log.ipAddress || "-"}</TableCell>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  className="rounded bg-gray-200 px-3 py-1 text-sm  disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span className="py-1 text-sm">
                  Página {page} de {totalPages}
                </span>
                <button
                  className="rounded bg-gray-200 px-3 py-1 text-sm  disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
}
