"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="text-muted-foreground hover:text-destructive gap-2"
      asChild // IMPORTANTE: permite que o Link se comporte como o Button
    >
      <Link href="/signout">
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </Link>
    </Button>
  )
}
