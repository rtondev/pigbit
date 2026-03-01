"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/api";
import toast from "react-hot-toast";
import { Button, Input, Label } from "@/components/ui";
import { AuthHeader } from "@/components/AuthHeader";
import { Check, X, CheckCircle, Search, Wand2, Eye, EyeOff } from "lucide-react";

const PWD_CHECKS = [
  { key: "length", label: "At least 8 characters", test: (s: string) => s.length >= 8 },
  { key: "upper", label: "At least 1 uppercase letter", test: (s: string) => /[A-Z]/.test(s) },
  { key: "number", label: "At least 1 number", test: (s: string) => /\d/.test(s) },
  { key: "special", label: "At least 1 symbol (@$!%*?&#)", test: (s: string) => /[@$!%*?&#]/.test(s) },
] as const;

type Step = "form" | "confirm" | "code" | "success";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [cnpj, setCnpj] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);

  function formatPhone(v: string) {
    const d = v.replace(/\D/g, "");
    if (d.length <= 2) return d ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  }

  function formatCnpj(v: string) {
    const d = v.replace(/\D/g, "");
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
  }

  function generatePassword() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "@$!%*?&#";
    const all = `${upper}${lower}${numbers}${symbols}`;
    const pick = (set: string) => set[Math.floor(Math.random() * set.length)];
    const chars = [pick(upper), pick(lower), pick(numbers), pick(symbols)];
    while (chars.length < 12) {
      chars.push(pick(all));
    }
    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
  }

  async function handleBuscarCnpj() {
    const digits = cnpj.replace(/\D/g, "");
    if (digits.length !== 14) {
      toast.error("CNPJ must have 14 digits");
      return;
    }
    setCnpjLoading(true);
    setError("");
    try {
      const r = await auth.cnpjLookup(cnpj);
      setRazaoSocial(r.razaoSocial || "");
      setNomeFantasia(r.nomeFantasia || "");
      setEndereco(r.endereco || "");
      toast.success("CNPJ found!");
    } catch {
      setError("CNPJ not found");
      toast.error("CNPJ not found");
    } finally {
      setCnpjLoading(false);
    }
  }

  const canSubmit =
    email &&
    cnpj.replace(/\D/g, "").length === 14 &&
    telefone.replace(/\D/g, "").length >= 10 &&
    nomeFantasia.length >= 2 &&
    password.length >= 8;
  const pwdOk = PWD_CHECKS.every(({ test }) => test(password));

  async function handleConfirmarDados(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!canSubmit || !pwdOk) return;
    setLoading(true);
    try {
      await auth.registerRequest({
        email,
        cnpj: cnpj.replace(/\D/g, ""),
        telefone: telefone.replace(/\D/g, ""),
        nomeFantasia,
        razaoSocial: razaoSocial || undefined,
        endereco: endereco || undefined,
        password,
      });
      toast.success("Verification code sent to your email!");
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.registerConfirm({ email, codigo });
      setStep("success");
      toast.success("Account created successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm");
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AuthHeader actionHref="/login" actionLabel="Sign in" />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md px-6">
          {step === "form" && (
            <>
              <h2 className="mb-1 text-center text-xl font-semibold">Create your account</h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter your business details
              </p>
              <form onSubmit={(e) => { e.preventDefault(); if (canSubmit && pwdOk) setStep("confirm"); }} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                      maxLength={18}
                    />
                  </div>
                  <Button type="button" variant="gray" onClick={handleBuscarCnpj} disabled={cnpjLoading} className="mt-6">
                    {cnpjLoading ? (
                      "..."
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Lookup
                      </>
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div>
                  <Label htmlFor="nomeFantasia">Trading name</Label>
                  <Input
                    id="nomeFantasia"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    placeholder="How your business is known"
                    required
                  />
                </div>
                {razaoSocial && (
                  <div>
                    <Label htmlFor="razaoSocial">Legal name (Receita)</Label>
                    <Input id="razaoSocial" value={razaoSocial} disabled />
                  </div>
                )}
                <div>
                  <Label htmlFor="endereco">Address</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Street, number, city, state"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Phone</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    maxLength={15}
                    required
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setPassword(generatePassword())}
                      className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#E84A86] hover:underline"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      Generate
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 chars with letter, number, symbol"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs">
                    {PWD_CHECKS.map(({ key, label, test }) => (
                      <li key={key} className={`flex items-center gap-2 ${test(password) ? "text-green-600" : "text-gray-500"}`}>
                        {test(password) ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={!canSubmit || !pwdOk}>
                  Continue
                </Button>
              </form>
            </>
          )}

          {step === "confirm" && (
            <>
              <h2 className="mb-1 text-center text-xl font-semibold">Confirm your details</h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Review before sending the verification code
              </p>
              <div className="mb-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                <p><strong>CNPJ:</strong> {cnpj}</p>
                <p><strong>Trading name:</strong> {nomeFantasia}</p>
                {razaoSocial && <p><strong>Legal name:</strong> {razaoSocial}</p>}
                {endereco && <p><strong>Address:</strong> {endereco}</p>}
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone:</strong> {telefone || "-"}</p>
              </div>
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              <form onSubmit={handleConfirmarDados} className="space-y-4">
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? "Sending code..." : "Confirm and send code"}
                </Button>
                <Button
                  type="button"
                  variant="gray"
                  className="w-full"
                  onClick={() => setStep("form")}
                >
                  Back
                </Button>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <h2 className="mb-1 text-center text-xl font-semibold">Verify your email</h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter the 6-digit code sent to {email}
              </p>
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              <form onSubmit={handleConfirmarCodigo} className="space-y-4">
                <div>
                  <Label>Code</Label>
                  <Input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={loading || codigo.length < 6}>
                  {loading ? "Creating account..." : "Confirm and create account"}
                </Button>
                <Button
                  type="button"
                  variant="gray"
                  className="w-full"
                  onClick={async () => {
                    setError("");
                    setLoading(true);
                    try {
                      await auth.registerRequest({
                        email,
                        cnpj: cnpj.replace(/\D/g, ""),
                        telefone: telefone.replace(/\D/g, ""),
                        nomeFantasia,
                        razaoSocial: razaoSocial || undefined,
                        endereco: endereco || undefined,
                        password,
                      });
                      toast.success("Code resent!");
                    } catch {
                      toast.error("Failed to resend");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  Resend code
                </Button>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Account created successfully!</h2>
              <p className="text-sm text-gray-600">
                Your account is ready. Sign in to access the dashboard.
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Go to sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
