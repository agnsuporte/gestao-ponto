// app/payslips/_components/payslip-view.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PayslipDraftResponse } from "../_actions/generate-draft";

interface PayslipViewProps {
  draft: PayslipDraftResponse;
}

export function PayslipView({ draft }: PayslipViewProps) {
  return (
    <div className="space-y-4">
      {/* Cartão de Destaque Líquido em Degradê */}
      <Card className="border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
        <CardHeader className="p-5 pb-2">
          <CardDescription className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wider">
            Vencimento Líquido Estimado
          </CardDescription>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {draft.netSalary.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 flex justify-between items-center text-xs text-primary-foreground/90">
          <span className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-emerald-300" /> Bruto: {draft.totalGross.toFixed(2)}€
          </span>
          <span className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4 text-rose-300" /> Descontos: {draft.totalDeductions.toFixed(2)}€
          </span>
        </CardContent>
      </Card>

      {/* Detalhes Técnicos e Discriminação */}
      <Card className="border border-muted/60 shadow-sm bg-background">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" /> Discriminação do Recibo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          
          {/* Secção de Abonos */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Abonos e Suplementos
            </span>
            {draft.lines
              .filter((l) => l.type === "ABONO")
              .map((line, idx) => (
                <div key={idx} className="flex justify-between items-start py-0.5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{line.description}</p>
                    {line.quantity && line.unitValue && (
                      <p className="text-xs text-muted-foreground">
                        {line.quantity} {line.code === "201" ? "horas" : "dias"} x {line.unitValue.toFixed(2)}€
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    +{line.totalValue.toFixed(2)}€
                  </span>
                </div>
              ))}
          </div>

          <Separator className="bg-muted/60" />

          {/* Secção de Descontos Completa */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Retenções e Descontos
            </span>
            {draft.lines
              .filter((l) => l.type === "DESCONTO")
              .map((line, idx) => (
                <div key={idx} className="flex justify-between items-start py-0.5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{line.description}</p>
                    {line.rate && (
                      <p className="text-xs text-muted-foreground">
                        Taxa de {line.rate}% sobre {line.baseValue?.toFixed(2)}€
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    -{line.totalValue.toFixed(2)}€
                  </span>
                </div>
              ))}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
