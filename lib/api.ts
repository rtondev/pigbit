const API_BASE = "/api";

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
};

function toPageMeta<T>(page: PageResponse<T>) {
  return {
    data: page.content || [],
    meta: {
      total: page.totalElements ?? 0,
      page: (page.number ?? 0) + 1,
      totalPages: page.totalPages ?? 1,
      hasNext: page.last === false,
      hasPrev: page.first === false,
    },
  };
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = parseApiError(err, res.statusText);
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  try {
    return await res.json();
  } catch {
    return undefined as T;
  }
}

/** Extrai mensagem de erro da resposta da API para o usuário entender o que aconteceu */
function parseApiError(err: Record<string, unknown>, fallback: string): string {
  const raw = err.message;
  if (Array.isArray(raw)) return raw.join(". ");
  if (typeof raw === "string" && raw) return raw;
  if (fallback === "Internal Server Error")
    return "Servidor indisponível. Verifique se a API está rodando (mvnw spring-boot:run na pasta pigbit-api).";
  return fallback || "Erro na requisição";
}

/** Requisição pública sem token (ex: checkout) */
export async function apiPublic<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = parseApiError(err, res.statusText);
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  try {
    return await res.json();
  } catch {
    return undefined as T;
  }
}

// ============ Auth ============
export const auth = {
  cnpjLookup: (cnpj: string) =>
    apiPublic<{
      cnpj: string;
      razaoSocial: string;
      nomeFantasia?: string;
      endereco?: string;
    }>(`/auth/cnpj/${cnpj.replace(/\D/g, "")}`)
      .then((r) => ({
        cnpj: r.cnpj ?? cnpj,
        razaoSocial: r.razaoSocial ?? "",
        nomeFantasia: r.nomeFantasia ?? "",
        endereco: r.endereco ?? "",
      }))
      .catch((err) => {
        throw err;
      }),
  registerRequest: (data: {
    email: string;
    password: string;
    cnpj: string;
    telefone: string;
    nomeFantasia: string;
    razaoSocial?: string;
    endereco?: string;
  }) =>
    api<{ maskedEmail: string; expiresAt: string }>("/auth/register/request", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  registerConfirm: (data: { email: string; codigo: string }) =>
    api<{ id: string; email: string; taxId?: string; tradingName?: string }>(
      "/auth/register/confirm",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
  login: (data: { email: string; password: string }) =>
    api<
      | { token: string; user: { id: string; email: string; cnpj?: string; nomeFantasia?: string } }
      | { requires2fa: true; email: string }
    >("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  login2fa: (data: { email: string; codigo: string }) =>
    api<{ token: string; user: { id: string; email: string; cnpj?: string; nomeFantasia?: string } }>(
      "/auth/login/2fa",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
  passwordResetRequest: (email: string) =>
    api<void>("/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  passwordResetConfirm: (data: {
    email: string;
    codigo: string;
    novaSenha: string;
  }) =>
    api<void>("/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  enable2fa: () =>
    api<{ secret: string; qrCode: string }>("/auth/2fa/enable", {
      method: "POST",
      body: JSON.stringify({}),
    }).then((r) => ({
      qrCodeUrl: r.qrCode,
      manualEntryKey: r.secret,
    })),
  verifyEnable2fa: (codigo: string) =>
    api<void>("/auth/2fa/verify-enable", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    }),
  disable2fa: (codigo: string) =>
    api<void>("/auth/2fa/disable", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    }),
};

// ============ Users ============
export const users = {
  me: () =>
    api<{
      id: string;
      email: string;
      cnpj?: string;
      nomeFantasia?: string;
      razaoSocial?: string;
      telefone?: string;
      emailVerified?: boolean;
      twoFaEnabled?: boolean;
      createdAt?: string;
    }>(
      "/users/me"
    ),
  update: (data: { phone?: string; tradingName?: string }) =>
    api("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
};

// ============ API Keys ============
export const apiKeys = {
  create: (data: { name: string }) =>
    api<{ apiKey: { id: string | number; name: string; keyPrefix: string; createdAt: string; revokedAt?: string }; plainKey: string }>(
      "/api-keys",
      { method: "POST", body: JSON.stringify(data) }
    ).then((r) => ({
      id: r.apiKey.id,
      name: r.apiKey.name,
      keyPrefix: r.apiKey.keyPrefix,
      apiKey: r.plainKey,
      createdAt: r.apiKey.createdAt,
      revokedAt: r.apiKey.revokedAt,
    })),
  list: () =>
    api<
      Array<{
        id: string | number;
        name: string;
        keyPrefix: string;
        apiKey?: string;
        createdAt: string;
        revokedAt?: string;
      }>
    >("/api-keys"),
  revoke: (id: string) =>
    api<void>(`/api-keys/${id}`, { method: "DELETE" }),
};

// ============ Audit Logs ============
export interface AuditLogItem {
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const auditLogs = {
  list: (page = 1, limit = 20) =>
    api<{ data: AuditLogItem[]; meta: { total: number; page: number; totalPages: number; hasNext: boolean; hasPrev: boolean } }>(
      `/audit-logs?page=${page - 1}&size=${limit}`
    ).then((r) => ({
      data: (r.data || []).map((log: any) => ({
        action: log.action ?? log.acao ?? "-",
        ipAddress: log.ipAddress ?? log.ip ?? undefined,
        userAgent: log.userAgent ?? log.user_agent ?? undefined,
        metadata: log.metadata ?? undefined,
        createdAt: log.createdAt ?? log.created_at,
      })),
      meta: r.meta,
    })),
};

// ============ Products ============
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  priceBrl: string;
}

type ProductApi = {
  id: string | number;
  nome: string;
  descricao?: string;
  valorBrl: string;
};

function toProduct(p: ProductApi): Product {
  return {
    id: p.id,
    name: p.nome,
    description: p.descricao || undefined,
    priceBrl: p.valorBrl,
  };
}

export const products = {
  list: () =>
    api<ProductApi[] | { data: ProductApi[] }>("/products").then((r) => {
      const list = Array.isArray(r) ? r : r?.data ?? [];
      return list.map(toProduct);
    }),
  get: (id: string) =>
    api<ProductApi>(`/products/${id}`).then(toProduct),
  create: (data: { name: string; description?: string; priceBrl: number }) =>
    api<ProductApi>("/products", {
      method: "POST",
      body: JSON.stringify({
        nome: data.name,
        descricao: data.description,
        valorBrl: data.priceBrl,
      }),
    }).then(toProduct),
  update: (id: string, data: { name?: string; description?: string; priceBrl?: number }) =>
    api<ProductApi>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nome: data.name,
        descricao: data.description,
        valorBrl: data.priceBrl,
      }),
    }).then(toProduct),
  delete: (id: string) =>
    api<void>(`/products/${id}`, { method: "DELETE" }),
};

// ============ Invoices ============
export interface Invoice {
  id: string | number;
  paymentId: string;
  amountBrl: string;
  amountCrypto?: string;
  cryptoCurrency: string;
  status: string;
  payAddress?: string;
  expiresAt?: string;
}

type InvoiceApi = {
  id: string | number;
  paymentId: string;
  valorBrl: string;
  valorCripto?: string;
  moedaCripto: string;
  status: string;
  payAddress?: string;
  expiresAt?: string;
};

function toInvoice(i: InvoiceApi): Invoice {
  return {
    id: i.id,
    paymentId: i.paymentId,
    amountBrl: i.valorBrl,
    amountCrypto: i.valorCripto,
    cryptoCurrency: i.moedaCripto,
    status: i.status,
    payAddress: i.payAddress,
    expiresAt: i.expiresAt,
  };
}

export const invoices = {
  currencies: () => Promise.resolve(["btc", "eth", "usdttrc20"]),
  list: (page = 1, limit = 20) =>
    api<{ data: InvoiceApi[]; meta: { total: number; page: number; totalPages: number; hasNext: boolean; hasPrev: boolean } }>(
      `/invoices?page=${page - 1}&size=${limit}`
    )
      .then((r) => ({
        data: (r.data || []).map(toInvoice),
        meta: r.meta,
      })),
  get: (id: string) => api<InvoiceApi>(`/invoices/${id}`).then(toInvoice),
  create: (data: {
    valorBrl: number;
    moedaCripto: string;
    productId?: string;
  }) =>
    api<InvoiceApi>("/invoices", { method: "POST", body: JSON.stringify(data) }).then(toInvoice),
  cancel: (id: string) =>
    api<void>(`/invoices/${id}/cancel`, { method: "PATCH" }),
  /** Checkout público - sem autenticação */
  getCheckout: (paymentId: string) =>
    apiPublic<{
      paymentId: string;
      valorBrl: string;
      payAmount?: string;
      moedaCripto: string;
      payAddress: string;
      status: string;
      expiresAt?: string;
    }>(`/invoices/checkout/${paymentId}`).then((r) => ({
      paymentId: r.paymentId,
      amountBrl: r.valorBrl,
      amountCrypto: r.payAmount,
      cryptoCurrency: r.moedaCripto,
      payAddress: r.payAddress,
      status: r.status,
      expiresAt: r.expiresAt,
    })),
};

// ============ Webhook Events ============
export const webhookEvents = {
  list: (page = 1, limit = 20) =>
    api<PageResponse<{ paymentId: string; validSignature: boolean; processedAt?: string; createdAt: string }>>(
      `/webhook-events?page=${page - 1}&size=${limit}`
    ).then(toPageMeta),
};

// ============ Wallets ============
export const wallets = {
  list: () =>
    api<
      Array<{
        id: string | number;
        address: string;
        currency: string;
        isActive: boolean;
      }>
    >("/wallets").then((r: any) =>
      (Array.isArray(r) ? r : []).map((w) => ({
        id: w.id,
        address: w.address ?? w.endereco,
        currency: w.currency ?? w.moeda,
        isActive: w.isActive ?? w.ativo,
      }))
    ),
  create: (data: { address: string; currency: string }) =>
    api("/wallets", {
      method: "POST",
      body: JSON.stringify({ endereco: data.address, moeda: data.currency }),
    }),
  update: (
    id: string,
    data: { address?: string; currency?: string; isActive?: boolean }
  ) =>
    api(`/wallets/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        endereco: data.address,
        moeda: data.currency,
        ativo: data.isActive,
      }),
    }),
  delete: (id: string) =>
    api<void>(`/wallets/${id}`, { method: "DELETE" }),
};

// ============ Withdrawals ============
export interface Withdrawal {
  id: string | number;
  amountBrl: string;
  feeApplied?: string;
  status: string;
  txHash?: string;
  createdAt: string;
}

export const withdrawals = {
  list: (page = 1, limit = 20) =>
    api<PageResponse<Withdrawal>>(`/withdrawals?page=${page - 1}&size=${limit}`).then(toPageMeta),
  get: (id: string) => api<Withdrawal>(`/withdrawals/${id}`),
  create: (data: { walletId: string; amountBrl: number; password: string; appCode?: string }) =>
    api<Withdrawal>("/withdrawals", { method: "POST", body: JSON.stringify(data) }),
};

// ============ Dashboard ============
export interface Transaction {
  id: string | number;
  amountBrl: string;
  amountCrypto?: string;
  status: string;
  txHash?: string;
  confirmedAt?: string;
}

export const dashboard = {
  metrics: () =>
    api<{
      totalProcessedBrl: number;
      activeInvoicesCount: number;
      availableBalanceBrl: number;
      lastSevenDaysVolume: number[];
    }>("/dashboard/metrics"),
  transactions: (page = 1, limit = 20) =>
    api<PageResponse<Transaction>>(
      `/dashboard/transactions?page=${page - 1}&size=${limit}`
    ).then(toPageMeta),
  getTransaction: (id: string) =>
    api<Transaction>(`/dashboard/transactions/${id}`),
};
