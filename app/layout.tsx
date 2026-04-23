import type { Metadata } from "next";
import { Providers, AuthProvider} from './providers';

import "./globals.css";

export const metadata: Metadata = {
  // Define a URL base para resolver caminhos relativos de imagens e links
  metadataBase: new URL('https://alegomes.eu'),
  
  // O título que aparece na aba do navegador e no Google
  title: {
    default: 'Ponto Inteligente',
    template: '%s | AGdNascimento', // Adiciona o sufixo em outras páginas
  },
  
  // Resumo do conteúdo (ideal entre 150-160 caracteres)
  description: 'Acompanhe o seu tempo, horas extras e produtividade em tempo real..',
  
  // Palavras-chave relevantes (uso moderado)
  keywords: ['trabalho', 'tempo', 'ponto', 'produtividade', 'gestão de tempo'],

  // Configurações para Redes Sociais (Open Graph)
  openGraph: {
    title: 'Ponto Inteligente',
    description: 'Registo simples e fiável da jornada de trabalho.',
    url: 'https://alegomes.eu',
    siteName: 'Ponto Inteligente',
    images: [
      {
        url: '/og-image.jpg', // Caminho da imagem na pasta public
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  // Instruções para robôs de busca (Google, Bing)
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
    <html lang="ptBR">
      <body
      >
       <AuthProvider> <Providers>{children}</Providers> </AuthProvider>
      </body>
    </html>
  );
}
