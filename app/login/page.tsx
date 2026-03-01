"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { AuthHeader } from "@/components/AuthHeader";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [requiresEmailCode, setRequiresEmailCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await auth.login({ email, password });
      if ("token" in res && res.token) {
        login(res.token, res.user);
        router.push(redirect);
      } else if ("requires2fa" in res && res.requires2fa) {
        setRequiresEmailCode(true);
        setError("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handle2faSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await auth.login2fa({
        email,
        codigo: emailCode,
      });
      if (res.token) {
        login(res.token, res.user);
        router.push(redirect);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AuthHeader actionHref="/register" actionLabel="Create account" />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md px-6">
        <div className="mb-6 flex justify-center">
          <Logo height={36} />
        </div>
        <h2 className="mb-6 text-center text-xl font-semibold">
          {requiresEmailCode ? "Access verification" : "Welcome back"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={requiresEmailCode}
              required
            />
          </div>
          {!requiresEmailCode && (
            <>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-[#E84A86] hover:underline">
                  Forgot password?
                </Link>
                <Link href="/register" className="text-[#E84A86] hover:underline">
                  Create account
                </Link>
              </div>
            </>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Loading..." : requiresEmailCode ? "Verify" : "Continue"}
          </Button>
        </form>
        </div>
      </div>

      <Modal
        show={requiresEmailCode}
        onClose={() => {
          setRequiresEmailCode(false);
          setEmailCode("");
        }}
      >
        <form onSubmit={handle2faSubmit}>
          <ModalHeader>Two-factor verification</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the code sent to your email to continue.
              </p>
              <div>
                <Label htmlFor="code">Email verification code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" variant="primary" disabled={loading || !emailCode}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
            <Button
              type="button"
              variant="gray"
              onClick={() => {
                setRequiresEmailCode(false);
                setEmailCode("");
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E84A86] border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
