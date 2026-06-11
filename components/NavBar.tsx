"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { Menu, ReceiptText, PackageOpenIcon, MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { LogoutButton } from '@/components/LogoutButton';

const baseNavItems = [
  { label: 'Gerir Faturação', href: '/billing', icon: <ReceiptText className="w-4 h-4 mr-2" /> },
  { label: 'Sobre', href: '/about', icon: <PackageOpenIcon className="w-4 h-4 mr-2" /> },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Agora validamos pelo papel (role) injetado com segurança pelo NextAuth
  const isAdmin = mounted && session?.user?.role === "admin"; 

  const navItems = [...baseNavItems];
  if (isAdmin) {
    navItems.push({
      label: 'Painel Email',
      href: '/admin/enviar-email',
      icon: <MailIcon className="w-4 h-4 mr-2" />,
    });
  }

  return (
    <nav className="flex w-full p-4 items-center justify-between">
      <div className="flex-1" />

      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-4">
        {navItems.map((item) => (
          <Button key={item.href} variant="ghost" asChild>
            <Link href={item.href}>
              {item.icon}
              {item.label}
            </Link>
          </Button>
        ))}
        <LogoutButton />
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon"><Menu className="h-6 w-6" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <SheetHeader><SheetTitle className="text-left">Menu</SheetTitle></SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center text-lg font-medium hover:text-primary transition-colors">
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t"><LogoutButton /></div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
