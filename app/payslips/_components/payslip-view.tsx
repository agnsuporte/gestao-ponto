// app/payslips/_components/payslip-view.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, ArrowUpRight, ArrowDownRight, Coins } from "lucide-react";
import { PayslipDraftResponse } from "../_actions/generate-draft";

interface PayslipViewProps {
  draft: PayslipDraftResponse;
}

export function PayslipView({ draft }: PayslipViewProps) {
  // Formatador oficial de moeda para o padrão português
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* 1. CARTÃO DE DESTAQUE: Glassmorphism Líquido com Gradiente Translúcido de Fundo */}
      <Card className="relative overflow-hidden border border-indigo-500/10 bg-background/40 backdrop-blur-md shadow-lg rounded-2xl">
        {/* Detalhe estético em degradê suave no fundo para quebrar o preto no branco */}
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        
        <CardHeader className="p-5 pb-3">
          <CardDescription className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5" /> Vencimento Líquido Estimado
          </CardDescription>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground pt-1">
            {formatCurrency(draft.netSalary)}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-5 pt-0 grid grid-cols-2 gap-3 border-t border-indigo-500/5 bg-indigo-500/[0.01]">
          {/* Métricas compactas com micro-cores dedicadas */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Bruto</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(draft.totalGross)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/[0.04] border border-rose-500/10">
            <div className="p-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Descontos</p>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">{formatCurrency(draft.totalDeductions)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. DISCRIMINAÇÃO TÉCNICA: Painel Estruturado de Transparência de Vidro */}
      <Card className="border border-indigo-500/5 shadow-md bg-background/50 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b border-muted/30 bg-muted/10">
          <CardTitle className="text-xs font-bold flex items-center gap-2 text-muted-foreground/90 uppercase tracking-wider">
            <Wallet className="h-4 w-4 text-indigo-500" /> Discriminação do Recibo
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          
          {/* SECÇÃO A: Abonos e Rendimentos Reais */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
              Abonos e Suplementos
            </span>
            <div className="divide-y divide-muted/30 space-y-2">
              {draft.lines
                .filter((l) => l.type === "ABONO")
                .map((line, idx) => (
                  <div key={idx} className="flex justify-between items-start pt-2 first:pt-0">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground tracking-tight">{line.description}</p>
                      {line.quantity && line.unitValue && (
                        <p className="text-[11px] font-medium text-muted-foreground/80">
                          {line.quantity} {line.code === "201" ? "horas" : "dias"} × {formatCurrency(line.unitValue)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.06] px-2 py-0.5 rounded-lg border border-emerald-500/10">
                      +{formatCurrency(line.totalValue)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <Separator className="bg-muted/40" />

          {/* SECÇÃO B: Deduções e Retenções Fiscais */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">
              Retenções e Descontos
            </span>
            <div className="divide-y divide-muted/30 space-y-2">
              {draft.lines
                .filter((l) => l.type === "DESCONTO")
                .map((line, idx) => (
                  <div key={idx} className="flex justify-between items-start pt-2 first:pt-0">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground tracking-tight">{line.description}</p>
                      {line.rate && (
                        <p className="text-[11px] font-medium text-muted-foreground/80">
                          Taxa de {line.rate}% sobre {formatCurrency(line.baseValue ?? 0)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/[0.06] px-2 py-0.5 rounded-lg border border-rose-500/10">
                      -{formatCurrency(line.totalValue)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
