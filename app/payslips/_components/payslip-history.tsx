// app/payslips/_components/payslip-history.tsx
"use client";

import { Calendar, ChevronRight, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PayslipHistoryProps {
  payslips: any[]; // Substitua pelo tipo gerado pelo Prisma se preferir (Payslip[])
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function PayslipHistoryList({ payslips }: PayslipHistoryProps) {
  if (!payslips || payslips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-muted/30 text-center">
        <FileText className="w-8 h-8 text-muted-foreground/60 mb-2" />
        <p className="text-sm font-medium text-muted-foreground">Nenhum recibo guardado</p>
        <p className="text-xs text-muted-foreground/80">Os seus meses confirmados vão aparecer aqui.</p>
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
    <div className="space-y-3">
      {payslips.map((payslip) => (
        <div
          key={payslip.id}
          className="group relative flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm hover:border-primary/30 transition-all active:scale-[0.99]"
        >
          {/* Esquerda: Mês e Ano */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                {MONTH_NAMES[payslip.month - 1]}
              </h4>
              <p className="text-xs text-muted-foreground">{payslip.year}</p>
            </div>
          </div>

          {/* Direita: Valor Líquido e Ação */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Líquido</p>
              <p className="font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                {formatCurrency(payslip.netSalary)}
              </p>
            </div>
            
            {/* Botão de Ação Otimizado para Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted group-hover:text-primary transition-colors"
              onClick={() => {
                // Lógica futura para abrir detalhes ou PDF
                console.log("Abrir recibo:", payslip.id);
              }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
