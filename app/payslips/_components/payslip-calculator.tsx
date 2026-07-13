// app/payslips/_components/payslip-calculator.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { generatePayslipDraft, PayslipDraftResponse } from "../_actions/generate-draft";
import { savePayslip } from "../_actions/save-payslip"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, History, SlidersHorizontal } from "lucide-react";

import { PayslipHeader } from "./payslip-header";
import { PayslipView } from "./payslip-view";
import { PayslipHistoryList } from "./payslip-history";
import { SalarySettingsForm } from "./salary-settings";

interface PayslipCalculatorProps {
  salarySettings: any;
  initialHistory: any[];
}

export function PayslipCalculator({ salarySettings, initialHistory }: PayslipCalculatorProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition(); 
  const [saving, setSaving] = React.useState(false);
  const [draft, setDraft] = React.useState<PayslipDraftResponse | null>(null);

  const now = new Date();
  const [month, setMonth] = React.useState<string>(String(now.getMonth() + 1));
  const [year, setYear] = React.useState<string>(String(now.getFullYear()));

  // Altere o estado inicial para '6' para abrir diretamente no mês do recibo de teste
// const [month, setMonth] = React.useState<string>("6");
// const [year, setYear] = React.useState<string>("2026");



const loadDraft = React.useCallback(() => {
  startTransition(async () => {
    try {
      // Deixe APENAS o mês e o ano. Remova o número 6!
      const data = await generatePayslipDraft(
        Number(month), 
        Number(year)
      );
      setDraft(data);
    } catch (error) {
      console.log("Erro ao gerar a previsão do recibo:", error);
      toast.error("Erro ao gerar a previsão do recibo.");
      setDraft(null);
    }
  });
}, [month, year]); // O array de dependências fica limpo e correto


  React.useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    try {
      const payload = {
        month: Number(month),
        year: Number(year),
        baseSalary: draft.baseSalary,
        totalGross: draft.totalGross,
        totalDeductions: draft.totalDeductions,
        netSalary: draft.netSalary,
        lines: draft.lines,
      };

      const result = await savePayslip(payload);

      if (result.success) {
        toast.success(`O recibo de ${month}/${year} foi guardado com sucesso!`);
        router.refresh(); 
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Não foi possível guardar o recibo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-4 pb-32 space-y-6 animate-in fade-in duration-300">
      
      <PayslipHeader 
        salarySettings={salarySettings}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        onSettingsSaved={loadDraft}
      />


      {isPending ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">A processar turnos reais ao cêntimo...</p>
        </div>
      ) : draft ? (
        <>
          <PayslipView draft={draft} />

          {/* TEXTO DE AVISO DE SIMULAÇÃO (DISCLAIMER LEGAL) */}
          <div className="rounded-xl p-3 bg-muted/40 border border-muted text-muted-foreground text-[11px] leading-relaxed text-center space-y-1">
            <p>
              ⚠️ <strong>Aviso de Simulação:</strong> Os valores apresentados são aproximados e servem exclusivamente como uma perspetiva indicativa do vencimento prático.
            </p>
            <p>
              O cálculo final pode variar dependendo de retroativos, parametrizações específicas de RH ou alterações das tabelas de retenção na fonte oficiais.
            </p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t md:relative md:bg-transparent md:border-none md:p-0 z-50">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 text-base font-medium rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> A guardar recibo...</>
              ) : (
                <><CheckCircle2 className="h-5 w-5" /> Confirmar e Fechar Mês</>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-4 px-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            ⚠️ Precisa de definir o seu salário base para calcular as horas extras e duodécimos.
          </div>
          <SalarySettingsForm onSaveSuccess={loadDraft} />
        </div>
      )}

      <div className="space-y-3 pt-4 border-t border-muted/40">
        <div className="flex items-center gap-2 text-muted-foreground px-1">
          <History className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider">Histórico de Recibos</h2>
        </div>
        <PayslipHistoryList payslips={initialHistory} />
      </div>

    </div>
  );
}
