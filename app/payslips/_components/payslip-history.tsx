// app/payslips/_components/payslip-history.tsx
"use client";

import { Calendar, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayslipHistoryProps {
  payslips: any[];
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function PayslipHistoryList({ payslips }: PayslipHistoryProps) {
  // Estado de feedback se não existirem dados guardados
  if (!payslips || payslips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-indigo-500/20 rounded-2xl bg-background/40 backdrop-blur-md text-center animate-in fade-in duration-300">
        <FileText className="w-8 h-8 text-indigo-500/40 mb-2" />
        <p className="text-sm font-semibold text-muted-foreground">Nenhum recibo fechado</p>
        <p className="text-[11px] text-muted-foreground/70 max-w-[200px] mx-auto mt-0.5">
          Os seus meses confirmados e arquivados vão aparecer listados aqui.
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  return (
    <div className="space-y-2.5 animate-in fade-in duration-300">
      {payslips.map((payslip) => (
        <div
          key={payslip.id}
          className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-background/50 backdrop-blur-md border border-indigo-500/5 shadow-sm hover:border-indigo-500/20 hover:bg-background/80 transition-all duration-200 active:scale-[0.99]"
        >
          {/* Esquerda: Identificador de Tempo e Mês */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground tracking-tight">
                {MONTH_NAMES[payslip.month - 1]}
              </h4>
              <p className="text-[11px] font-medium text-muted-foreground/80">{payslip.year}</p>
            </div>
          </div>

          {/* Direita: Métricas Financeiras e Acionador Lateral */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">Líquido</p>
              <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                {formatCurrency(payslip.netSalary)}
              </p>
            </div>
            
            {/* Botão de Navegação Lateral Ultracompacto */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl bg-muted/30 hover:bg-indigo-500/10 hover:text-indigo-600 group-hover:translate-x-0.5 transition-all duration-200"
              onClick={() => {
                console.log("Abrir detalhes do recibo:", payslip.id);
              }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
