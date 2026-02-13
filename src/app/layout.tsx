import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flash ToDo - Quebre tarefas em passos simples com IA",
  description:
    "Transforme tarefas complexas em passos simples e gerenciáveis usando inteligência artificial Gemini. Criado por Rogério Bezerra.",
  keywords: ["todo", "tarefas", "produtividade", "AI", "gemini", "lista", "flash"],
  authors: [{ name: "Rogério Bezerra", url: "https://sbfrogerio.github.io/Rogerio-Bezerra/" }],
  openGraph: {
    title: "⚡ Flash ToDo - Quebre tarefas em passos simples com IA",
    description:
      "Transforme tarefas complexas em passos simples usando IA Gemini.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
