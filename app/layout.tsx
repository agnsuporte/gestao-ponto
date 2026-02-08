import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers, AuthProvider} from './providers';

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
  title: "Ponto Inteligente",
  description: "By AGdNascimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ptBR">
      <body
      >
       <AuthProvider> <Providers>{children}</Providers> </AuthProvider>
      </body>
    </html>
  );
}
