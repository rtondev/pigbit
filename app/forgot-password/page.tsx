"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button, Input, Label } from "@/components/ui";
import { AuthHeader } from "@/components/AuthHeader";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.passwordResetRequest(email);
      setSent(true);
      toast.success("Verification code sent to your email!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    try {
      await auth.passwordResetConfirm({
        email,
        codigo: code,
        novaSenha: newPassword,
      });
      setDone(true);
      toast.success("Password updated successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      setResetError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AuthHeader actionHref="/login" actionLabel="Sign in" />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md px-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo height={32} />
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Your password has been updated.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full">Go to sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AuthHeader actionHref="/login" actionLabel="Sign in" />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md px-6">
            <div className="mb-4 flex justify-center">
              <Logo height={32} />
            </div>
            <h2 className="mb-2 text-center text-xl font-semibold">Set a new password</h2>
            <p className="mb-6 text-center text-sm text-gray-600">
              Enter the code sent to your email and choose a new password.
            </p>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  disabled
                />
              </div>
              <div>
                <Label>Verification code</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  required
                />
              </div>
              <div>
                <Label>New password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 chars with letter, number, symbol"
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
              {resetError && <div className="text-sm text-red-600">{resetError}</div>}
              <Button type="submit" variant="primary" className="w-full" disabled={resetLoading}>
                {resetLoading ? "Updating..." : "Update password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AuthHeader actionHref="/login" actionLabel="Sign in" />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md px-6">
          <div className="mb-6 flex justify-center">
            <Logo height={36} />
          </div>
          <h2 className="mb-2 text-center text-xl font-semibold">Reset your password</h2>
          <p className="mb-6 text-center text-sm text-gray-600">
            Enter your registered email to receive a code.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send code"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
