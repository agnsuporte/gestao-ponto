import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <div className="flex justify-start">
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="gap-2 h-10 px-3 text-muted-foreground hover:text-foreground transition-transform active:scale-95"
        >
          <Link href="/time-record">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </Link>
        </Button>
    </div>
  );
}

     