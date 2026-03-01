import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/Toaster";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Pigbit - Pagamentos em Criptomoedas",
  description: "Plataforma SaaS de pagamentos em criptomoedas",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <body className={`${outfit.className} antialiased bg-white text-gray-900`}>
        <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
      </body>
    </html>
  );
}
