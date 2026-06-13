import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noite de Pastéis da Copa",
  description: "Monte seu pastel e acompanhe seu pedido em tempo real.",
  openGraph: {
    title: "Noite de Pastéis da Copa",
    description: "Monte seu pastel e acompanhe seu pedido.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@pastelcopa",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
