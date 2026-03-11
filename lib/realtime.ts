/**
 * WebSocket (Socket.IO) — comunicação assíncrona além do HTTP/JSON.
 * Conecta direto na API (rewrites do Next não fazem upgrade WS).
 * Defina NEXT_PUBLIC_API_URL=http://localhost:4000 (mesma base do API_URL).
 */
import { io, Socket } from "socket.io-client";

export type InvoiceStatusEvent = {
  paymentId: string;
  status: string;
  txHash?: string;
};

function getApiBase(): string {
  if (typeof window === "undefined") return "";
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.API_URL as string | undefined) ||
    "";
  return base.replace(/\/$/, "");
}

/**
 * Inscreve na sala do checkout e escuta mudanças de status do pedido (carrinho) em tempo real.
 */
export function subscribeCheckout(
  paymentId: string,
  onStatus: (payload: InvoiceStatusEvent) => void
): () => void {
  const base = getApiBase();
  if (!base) {
    console.warn("NEXT_PUBLIC_API_URL não definido; WebSocket desativado");
    return () => {};
  }

  const socket: Socket = io(`${base}/realtime`, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    socket.emit("subscribeCheckout", paymentId);
  });

  socket.on("invoiceStatus", (payload: InvoiceStatusEvent) => {
    if (payload?.paymentId === paymentId) onStatus(payload);
  });

  return () => {
    socket.disconnect();
  };
}
