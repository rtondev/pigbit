import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { PublicStats } from "@/components/PublicStats";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Pigbit" width={120} height={28} priority />
        </Link>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">Cadastrar</Button>
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
          Aceite criptomoedas
          <br />
          <span className="text-[#E84A86]">no seu negócio</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base text-gray-600 md:text-lg">
          Plataforma completa para lojistas receberem pagamentos em Bitcoin,
          Ethereum e outras criptomoedas. Simples, seguro e integrado.
        </p>
        <div className="mb-14 flex justify-center gap-4 md:mb-20">
          <Link href="/register">
            <Button size="xl" variant="primary">
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <PublicStats />

        <div className="grid gap-5 text-left md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-semibold text-[#E84A86]">Quem pode usar</p>
            <h3 className="mt-2 text-base font-semibold text-gray-900 md:text-lg">Lojistas e SaaS</h3>
            <p className="mt-2 text-sm text-gray-600">
              E‑commerce, marketplaces, apps de assinatura e serviços digitais.
              Se você cobra online, dá para plugar.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-semibold text-[#E84A86]">API para devs</p>
            <h3 className="mt-2 text-base font-semibold text-gray-900 md:text-lg">Integração rápida</h3>
            <p className="mt-2 text-sm text-gray-600">
              Endpoints claros, webhooks e tokens prontos para produção.
              Veja a doc completa em{" "}
              <a
                href="https://api.pigbit.site/api/docs"
                target="_blank"
                rel="noreferrer"
                className="text-[#E84A86] underline"
              >
                api.pigbit.site/api/docs
              </a>
              .
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-semibold text-[#E84A86]">Segurança</p>
            <h3 className="mt-2 text-base font-semibold text-gray-900 md:text-lg">Conta protegida</h3>
            <p className="mt-2 text-sm text-gray-600">
              2FA, trilha de auditoria e criptografia ponta a ponta nas operações
              críticas.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
