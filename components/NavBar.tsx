import Link from "next/link";
import { Menu, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { LogoutButton } from "@/components/LogoutButton"; // Teu componente atual

const navItems = [
  { label: "Gerir Faturação", href: "/billing", icon: <ReceiptText className="w-4 h-4 mr-2" /> },
];

export function Navbar() {
  return (
    <nav className="flex w-full p-4 items-center justify-between">
      {/* Logo ou Espaçador à esquerda se necessário */}
      <div className="flex-1" />

      {/* Desktop Menu */}
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

      {/* Mobile Menu (Hambúrguer) */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-62.5">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-lg font-medium hover:text-primary transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                <LogoutButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
