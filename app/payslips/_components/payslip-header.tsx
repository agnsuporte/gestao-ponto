// app/payslips/_components/payslip-header.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { SalarySettingsForm } from "./salary-settings";

interface PayslipHeaderProps {
  salarySettings: any;
  month: string;
  setMonth: (m: string) => void;
  year: string;
  setYear: (y: string) => void;
  onSettingsSaved: () => void;
}

export function PayslipHeader({ salarySettings, month, setMonth, year, setYear, onSettingsSaved }: PayslipHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Escape superior com Voltar e Fechar para /time-record */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Botão Clássico de Voltar */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()} 
            className="text-muted-foreground hover:text-foreground text-xs gap-1.5 pl-1 rounded-xl h-8"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>

          <div className="h-4 w-[1px] bg-muted/60 mx-1" />

          {/* ✨ NOVO BOTÃO: Fechar e saltar para o Registo de Horas
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/time-record")} 
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 text-xs gap-1 rounded-xl h-8"
          >
            <X className="h-4 w-4" /> Fechar
          </Button> */}
        </div>

        {/* Modal de Preferências Salariais */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-xl border-indigo-500/10 bg-background/50 hover:bg-indigo-500/10">
              <Settings2 className="h-3.5 w-3.5 text-indigo-500" /> Preferências
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none sm:rounded-2xl">
            <DialogTitle className="sr-only">Configurações do Ordenado</DialogTitle>
            <SalarySettingsForm initialData={salarySettings} onSaveSuccess={onSettingsSaved} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Título e Seletores de Data */}
      <div className="flex items-center justify-between bg-background/40 backdrop-blur-md p-3.5 rounded-2xl border border-indigo-500/5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">Recibo Prático</h1>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Previsão Mensal</p>
        </div>
        
        <div className="flex items-center gap-1.5">
          <select 
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-input bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => (
              <option key={m} value={m}>{m.padStart(2, '0')}</option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-input bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>
    </div>
  );
}
