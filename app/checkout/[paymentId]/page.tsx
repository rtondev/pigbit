"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";
import { invoices } from "@/lib/api";
import { subscribeCheckout } from "@/lib/realtime";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const paymentId = params.paymentId as string;
  const [data, setData] = useState<{
    paymentId: string;
    amountBrl: string;
    amountCrypto?: string;
    cryptoCurrency: string;
    payAddress: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    invoices
      .getCheckout(paymentId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erro ao carregar"));
  }, [paymentId]);

  // Comunicação assíncrona em tempo real: webhook atualiza status → API emite → UI sem polling
  useEffect(() => {
    if (!paymentId || !data) return;
    const done =
      data.status === "finished" ||
      data.status === "expired" ||
      data.status === "failed";
    if (done) return;
    const unsubscribe = subscribeCheckout(paymentId, (payload) => {
      setData((prev) =>
        prev ? { ...prev, status: payload.status } : prev
      );
      if (payload.status === "finished" || payload.status === "confirmed") {
        toast.success("Pagamento atualizado!");
      }
    });
    return unsubscribe;
  }, [paymentId, data?.status]);

  function copyAddress() {
    if (data?.payAddress) {
      navigator.clipboard.writeText(data.payAddress);
      toast.success("Endereço copiado!");
    }
  }

  function copyAmount() {
    if (data?.amountCrypto) {
      navigator.clipboard.writeText(data.amountCrypto);
      toast.success("Valor copiado!");
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <h1 className="text-xl font-bold text-red-600">Pagamento não encontrado</h1>
          <p className="text-gray-600">{error}</p>
          <Link href="/" className="text-[#E84A86] hover:underline">
            Voltar ao início
          </Link>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E84A86] border-t-transparent" />
      </div>
    );
  }

  const currencyLabel = data.cryptoCurrency ? data.cryptoCurrency.toUpperCase() : "-";
  const isPaid =
    data.status === "finished" ||
    data.status === "confirming" ||
    data.status === "confirmed" ||
    data.status === "sending";
  const isExpired = data.status === "expired";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className={`grid w-full gap-6 ${!isPaid && !isExpired ? "max-w-2xl lg:grid-cols-2" : "max-w-md"}`}>
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="mb-6">
            <Image src="/logo.svg" alt="Pigbit" width={100} height={24} />
          </Link>
          <Card className="w-full">
            <h1 className="text-xl font-bold">Pagamento</h1>
            <p className="mt-2 text-3xl font-bold text-[#E84A86]">
              R$ {parseFloat(data.amountBrl).toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {currencyLabel} • ID: {data.paymentId}
            </p>
            {isPaid && (
              <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-800">
                ✓ Pagamento confirmado ou em confirmação
              </div>
            )}
            {isExpired && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-800">
                Este pagamento expirou
              </div>
            )}
          </Card>
        </div>
        {!isPaid && !isExpired && (
          <Card className="w-full">
            <h2 className="text-lg font-bold">Dados para pagar</h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">Envie exatamente:</p>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <span className="flex-1 font-mono text-xl font-bold tabular-nums">
                    {data.amountCrypto || "-"}
                  </span>
                  <span className="text-gray-500">{currencyLabel}</span>
                  <button
                    type="button"
                    onClick={copyAmount}
                    className="rounded-lg bg-[#E84A86] p-2 text-white hover:bg-[#d63d75]"
                    disabled={!data.amountCrypto}
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">Para o endereço:</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={data.payAddress}
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="shrink-0 rounded-lg bg-[#E84A86] p-2 text-white hover:bg-[#d63d75]"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
