"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  Input,
  Label,
  Tabs,
  TabItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, ShieldCheck, ShieldOff, Check, X, UserRound } from "lucide-react";
import { auth, users } from "@/lib/api";

function formatCnpj(t?: string | null) {
  if (!t) return "-";
  const d = t.replace(/\D/g, "");
  if (d.length === 14) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  return t;
}

export default function PerfilPage() {
  const { user, logout, setUser } = useAuth();
  const [dados, setDados] = useState<{
    email?: string;
    cnpj?: string;
    nomeFantasia?: string;
    razaoSocial?: string;
    createdAt?: string;
    emailVerified?: boolean;
    twoFaEnabled?: boolean;
  } | null>(null);

  function refreshUser() {
    users
      .me()
      .then((u) => {
        setDados(u);
        setUser(u as any);
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshUser();
  }, []);
  // 2FA
  const [twoFaStep, setTwoFaStep] = useState<"idle" | "qr" | "verify">("idle");
  const [twoFaQr, setTwoFaQr] = useState<string | null>(null);
  const [twoFaManualKey, setTwoFaManualKey] = useState<string | null>(null);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [showDisable2fa, setShowDisable2fa] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const qrSrc =
    twoFaQr?.startsWith("data:image")
      ? twoFaQr
      : twoFaQr
        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(twoFaQr)}`
        : null;

  async function handle2faEnable() {
    setTwoFaLoading(true);
    try {
      const r = await auth.enable2fa();
      setTwoFaQr(r.qrCodeUrl ?? "");
      setTwoFaManualKey(r.manualEntryKey ?? null);
      setTwoFaStep("qr");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao ativar 2FA");
    } finally {
      setTwoFaLoading(false);
    }
  }

  async function handle2faVerify(e: React.FormEvent) {
    e.preventDefault();
    setTwoFaLoading(true);
    try {
      await auth.verifyEnable2fa(twoFaCode);
      setTwoFaStep("idle");
      setTwoFaQr(null);
      setTwoFaManualKey(null);
      setTwoFaCode("");
      setDados((prev) => ({ ...prev, twoFaEnabled: true }));
      refreshUser();
      toast.success("2FA ativado!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido");
    } finally {
      setTwoFaLoading(false);
    }
  }

  async function handle2faDisable() {
    setTwoFaLoading(true);
    try {
      await auth.disable2fa(disableCode);
      refreshUser();
      setDados((prev) => ({ ...prev, twoFaEnabled: false }));
      setShowDisable2fa(false);
      setDisableCode("");
      toast.success("2FA desativado!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido");
    } finally {
      setTwoFaLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Perfil</h1>
      <Tabs>
        <TabItem
          title={(
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              Dados
            </span>
          )}
          active
        >
          <Card>
            <div className="space-y-4">
              <div>
                <Label>E-mail</Label>
                <Input value={dados?.email ?? user?.email ?? ""} disabled />
              </div>
              <div>
                <Label>CNPJ</Label>
                <Input value={formatCnpj(dados?.cnpj)} disabled />
              </div>
              <div>
                <Label>Nome fantasia</Label>
                <Input value={dados?.nomeFantasia ?? "-"} disabled />
              </div>
              <div>
                <Label>Razão social</Label>
                <Input value={dados?.razaoSocial ?? "-"} disabled />
              </div>
              {dados?.createdAt && (
                <div>
                  <Label>Conta criada em</Label>
                  <Input value={new Date(dados.createdAt).toLocaleDateString("pt-BR")} disabled />
                </div>
              )}
              <Button
                type="button"
                variant="failure"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </Card>
        </TabItem>
        <TabItem
          title={(
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Autenticação 2FA
            </span>
          )}
        >
          <Card>
            {twoFaStep === "idle" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Use um app como Google Authenticator ou Authy. Ao ativar, escaneie o QR Code no app.
                </p>
                <div className="flex flex-wrap gap-2">
                  {!dados?.twoFaEnabled ? (
                    <Button
                      variant="primary"
                      onClick={handle2faEnable}
                      disabled={twoFaLoading}
                      className="flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {twoFaLoading ? "..." : "Ativar 2FA"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="failure"
                      onClick={() => setShowDisable2fa(true)}
                      disabled={twoFaLoading}
                      className="flex items-center gap-2"
                    >
                      <ShieldOff className="h-4 w-4" />
                      Desativar 2FA
                    </Button>
                  )}
                </div>
              </div>
            )}
            {twoFaStep === "qr" && twoFaQr && (
              <form onSubmit={handle2faVerify} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Escaneie o QR Code no app Google Authenticator ou Authy:
                </p>
                <div className="flex justify-center">
                  <img
                    src={qrSrc ?? ""}
                    alt="QR Code 2FA"
                    className="h-48 w-48"
                  />
                </div>
                <div>
                  <Label>Digite o código gerado pelo app para confirmar</Label>
                  <Input
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" disabled={twoFaLoading} className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Confirmar
                  </Button>
                  <Button
                    type="button"
                    variant="gray"
                    onClick={() => {
                      setTwoFaStep("idle");
                      setTwoFaQr(null);
                      setTwoFaManualKey(null);
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </TabItem>
      </Tabs>

      <Modal show={showDisable2fa} onClose={() => { setShowDisable2fa(false); setDisableCode(""); }}>
        <form onSubmit={(e) => { e.preventDefault(); handle2faDisable(); }}>
          <ModalHeader>Desativar 2FA</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Digite o código do Authenticator para desativar o 2FA.
              </p>
              <div>
                <Label>Código do Authenticator</Label>
                <Input
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" variant="failure" disabled={twoFaLoading || disableCode.length < 6}>
              {twoFaLoading ? "Desativando..." : "Desativar 2FA"}
            </Button>
            <Button
              type="button"
              variant="gray"
              onClick={() => { setShowDisable2fa(false); setDisableCode(""); }}
              disabled={twoFaLoading}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
