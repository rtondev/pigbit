import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Zap,
  Shield,
  Webhook,
  LayoutDashboard,
  KeyRound,
  FileCheck,
  Check,
  Wallet,
  Plug,
  ShieldCheck,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui";
import { PublicStats } from "@/components/PublicStats";

const DOCS_URL = "https://api.pigbit.site/api/docs";

const features = [
  {
    icon: Zap,
    title: "Checkout em cripto",
    desc: "Gere cobranças em BRL convertidas para BTC, ETH, USDT e outras moedas. Link de pagamento pronto para enviar ao cliente.",
  },
  {
    icon: Webhook,
    title: "Webhooks NOWPayments",
    desc: "Confirmação automática quando o pagamento cai. Sua fatura e extrato atualizam sem intervenção manual.",
  },
  {
    icon: KeyRound,
    title: "API + chaves",
    desc: "JWT para o painel e API Key para integrações server-to-server. Stateless, documentado no Swagger.",
  },
  {
    icon: Shield,
    title: "2FA e auditoria",
    desc: "Autenticação em dois fatores e trilha de auditoria para operações sensíveis. Conta alinhada a boas práticas.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard completo",
    desc: "Faturas, produtos, carteiras, saques e transações em um só lugar. Visão operacional do seu negócio.",
  },
  {
    icon: FileCheck,
    title: "Contratos e validação",
    desc: "DTOs validados e OpenAPI gerado a partir do código. Integração previsível para o time de dev.",
  },
];

const steps = [
  {
    n: "1",
    title: "Cadastre-se",
    desc: "Crie sua conta de lojista e configure empresa e perfil em poucos minutos.",
  },
  {
    n: "2",
    title: "Crie produto ou valor",
    desc: "Cadastre produtos ou emita fatura avulsa. Escolha a moeda cripto de recebimento.",
  },
  {
    n: "3",
    title: "Receba e acompanhe",
    desc: "Compartilhe o checkout; o webhook confirma o pagamento e o saldo fica disponível conforme as regras da carteira.",
  },
];

const faq: { q: string; a: string; icon: LucideIcon }[] = [
  {
    icon: Wallet,
    q: "Preciso de carteira própria?",
    a: "A Pigbit orquestra o fluxo com o gateway NOWPayments. Você gerencia faturas e extratos pelo painel; a liquidação segue o fluxo configurado na plataforma.",
  },
  {
    icon: Plug,
    q: "Como integro no meu sistema?",
    a: "Use a API REST documentada no Swagger. Autenticação via Bearer (JWT) ou X-API-KEY. Webhook POST notifica mudança de status da fatura.",
  },
  {
    icon: ShieldCheck,
    q: "É seguro?",
    a: "Senhas com hash, 2FA opcional, auditoria de ações e validação HMAC nos webhooks. Comunicação HTTPS; tokens stateless.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav — sticky, padrão landing */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Pigbit" width={120} height={28} priority />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#como-funciona" className="hover:text-[#E84A86]">
              Como funciona
            </a>
            <a href="#recursos" className="hover:text-[#E84A86]">
              Recursos
            </a>
            <a href="#faq" className="hover:text-[#E84A86]">
              FAQ
            </a>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#E84A86]"
            >
              API Docs
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — hierarquia clara, um foco principal */}
        <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
            <p className="mb-4 inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
              Pagamentos em criptomoedas para o seu negócio
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Aceite cripto{" "}
              <span className="text-[#E84A86]">com segurança e escala</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
              Plataforma SaaS focada em lojistas: faturas, checkout, webhooks e
              API documentada. Um fluxo só — do pedido à confirmação on-chain.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button size="xl" variant="primary">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href={DOCS_URL} target="_blank" rel="noreferrer">
                <Button size="xl" variant="outline">
                  Ver documentação
                </Button>
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Gateway NOWPayments
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Webhook + tempo real
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                OpenAPI / Swagger
              </li>
            </ul>
          </div>
        </section>

        {/* Como funciona — passos numerados (padrão conversão) */}
        <section id="como-funciona" className="scroll-mt-20 border-b border-gray-100 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Como funciona
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
              Três etapas do cadastro à confirmação do pagamento.
            </p>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-2xl border border-gray-100 bg-gray-50/50 p-8 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E84A86] text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recursos — grid temático alinhado ao POS / integração */}
        <section id="recursos" className="scroll-mt-20 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              O que a Pigbit entrega
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
              Temas de Programação Orientada a Serviços na prática: stateless,
              webhooks, contratos e monitoramento.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E84A86]/10 text-[#E84A86]">
                    <f.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Números — prova social */}
        <section className="border-y border-gray-100 bg-gray-50 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <header className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Números da plataforma
              </h2>
              <p className="mt-2 text-gray-600">
                Dados públicos agregados — transparência para quem confia na Pigbit
              </p>
            </header>
            <PublicStats embedded />
          </div>
        </section>

        {/* Para quem é */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  Feita para quem cobra online
                </h2>
                <p className="mt-4 text-gray-600">
                  E-commerce, SaaS, marketplaces e prestadores de serviço. Se você
                  precisa de um fluxo de pagamento em cripto com reconciliação
                  automática, a stack foi pensada para isso.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#E84A86]" />
                    Fatura com prazo e endereço único de pagamento
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#E84A86]" />
                    Atualização de status via webhook (sem polling obrigatório)
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#E84A86]" />
                    Painel para produtos, carteiras e auditoria
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#E84A86]">
                  Integração técnica
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  A API segue contratos explícitos (DTOs + Swagger). Autenticação
                  stateless com JWT ou API Key. O catálogo de endpoints cobre
                  auth, produtos, faturas, webhooks e logs — ideal para disciplinas
                  de serviços e arquitetura orientada a eventos.
                </p>
                <Link
                  href={DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-[#E84A86] hover:underline"
                >
                  Abrir Swagger
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — ícones Lucide + linhas entre itens, sem caixa ao redor */}
        <section id="faq" className="scroll-mt-20 border-t border-gray-100 bg-gray-50 py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Perguntas frequentes
            </h2>
            <div className="bg-transparent">
              {faq.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === faq.length - 1;
                return (
                  <details
                    key={item.q}
                    className={`group py-5 ${!isLast ? "border-b border-gray-200" : ""}`}
                  >
                    <summary className="cursor-pointer list-none font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E84A86]/10 text-[#E84A86]">
                          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </span>
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span>{item.q}</span>
                          <ChevronDown
                            className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                            aria-hidden
                          />
                        </span>
                      </span>
                    </summary>
                    <p className="mt-3 pl-12 text-sm leading-relaxed text-gray-600">
                      {item.a}
                    </p>
                  </details>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#E84A86] py-16 text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Pronto para receber em cripto?
            </h2>
            <p className="mt-3 text-white/90">
              Cadastro rápido. Documentação aberta. Comece em minutos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button
                  size="xl"
                  className="!bg-white !text-[#E84A86] hover:!bg-gray-100"
                >
                  Criar conta
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="xl"
                  variant="outline"
                  className="!border-white !text-white hover:!bg-white/10"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — organizado em colunas */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Image src="/logo.svg" alt="Pigbit" width={100} height={24} />
              <p className="mt-4 max-w-sm text-sm text-gray-600">
                Pagamentos em criptomoedas para lojistas. API, webhooks e painel em
                um só ecossistema.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Produto
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-[#E84A86]">
                    Cadastrar
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-[#E84A86]">
                    Entrar
                  </Link>
                </li>
                <li>
                  <a
                    href={DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-[#E84A86]"
                  >
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Conteúdo
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#como-funciona" className="text-gray-600 hover:text-[#E84A86]">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#recursos" className="text-gray-600 hover:text-[#E84A86]">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-600 hover:text-[#E84A86]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200 pt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Pigbit. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
