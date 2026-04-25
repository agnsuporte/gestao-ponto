import type { Metadata } from "next";
import { Providers, AuthProvider} from './providers';

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://alegomes.eu'),
  title: {
    default: 'Ponto Inteligente',
    template: '%s | Ponto Inteligente',
  },
  description: 'Software simples de controlo de ponto e registo de horas para pequenas equipas em Portugal.',
  keywords: ['trabalho', 'tempo', 'ponto', 'produtividade', 'gestão de tempo'],
  openGraph: {
    title: 'Ponto Inteligente',
    description: 'Software simples de controlo de ponto e registo de horas para pequenas equipas em Portugal.',
    url: 'https://alegomes.eu',
    siteName: 'Ponto Inteligente',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Ponto Inteligente',
      },
    ],
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ponto Inteligente',
    description: 'Software simples de controlo de ponto e registo de horas para pequenas equipas em Portugal.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body>
       <AuthProvider> <Providers>{children}</Providers> </AuthProvider>
      </body>
    </html>
  );
}
