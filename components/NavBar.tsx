// components/navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { Menu, ReceiptText, PackageOpenIcon, MailIcon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import Image from "next/image";
import { LogoutButton } from '@/components/LogoutButton';

const baseNavItems = [
  { label: 'Recibos', href: '/payslips', icon: <Wallet className="w-4 h-4 mr-2 text-indigo-500" /> },
  { label: 'Gerir Faturação', href: '/billing', icon: <ReceiptText className="w-4 h-4 mr-2 text-emerald-500" /> },
  { label: 'Sobre', href: '/about', icon: <PackageOpenIcon className="w-4 h-4 mr-2 text-amber-500" /> },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && session?.user?.role === "admin"; 

  const navItems = [...baseNavItems];
  if (isAdmin) {
    navItems.push({
      label: 'Painel Email',
      href: '/admin/enviar-email',
      icon: <MailIcon className="w-4 h-4 mr-2 text-blue-500" />,
    });
  }

  return (
    // ✨ Glassmorphism aplicado com bg-background/60 + backdrop-blur-md + Linha inferior colorida suave
    <header className="sticky top-0 z-50 w-full border-b border-indigo-500/10 bg-background/60 backdrop-blur-md transition-all">
      <nav className="mx-auto flex max-w-5xl h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200">
            <Image   
              src="/clic-ponto-transp.png" 
              alt="Clic Ponto Logomarca" 
              width={100} 
              height={30} 
              className="object-contain filter drop-shadow-sm"
              priority 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-2">
          {navItems.map((item) => (
            <Button 
              key={item.href} 
              variant="ghost" 
              className="text-sm font-medium hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200" 
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
          <div className="ml-2 h-5 w-[1px] bg-muted" />
          <div className="ml-2">
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-indigo-500/10 text-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            {/* Menu Lateral também translúcido */}
            <SheetContent side="right" className="w-[260px] border-l border-indigo-500/10 bg-background/80 backdrop-blur-lg">
              <SheetHeader>
                <SheetTitle className="text-left text-xs font-bold text-indigo-500 uppercase tracking-widest">
                  Navegação
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="flex items-center p-3 text-sm font-semibold text-foreground hover:bg-indigo-500/10 hover:text-indigo-600 rounded-xl transition-all duration-200"
                  >
                    {item.icon}
                    <span className="ml-1">{item.label}</span>
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-muted">
                  <LogoutButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
