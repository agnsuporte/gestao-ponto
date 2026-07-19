// app/payslips/_components/payslip-calculator.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { generatePayslipDraft, PayslipDraftResponse } from "../_actions/generate-draft";
import { savePayslip } from "../_actions/save-payslip"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, History } from "lucide-react";

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

  // Bloqueio preventivo se não existirem definições
  const hasSettings = !!salarySettings;

  const loadDraft = React.useCallback(() => {
    if (!hasSettings) return; // 🛑 Impede chamadas absurdas sem definições salariais configuradas
    
    startTransition(async () => {
      try {
        const data = await generatePayslipDraft(Number(month), Number(year));
        setDraft(data);
      } catch (error) {
        console.log("Erro ao gerar a previsão do recibo:", error);
        toast.error("Erro ao gerar a previsão do recibo.");
        setDraft(null);
      }
    });
  }, [month, year, hasSettings]);

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

  // 🛡️ SE NÃO HOUVER CONFIGURAÇÕES, EXIBE APENAS O FORMULÁRIO DE ENTRADA IMEDIATAMENTE
  if (!hasSettings) {
    return (
      <div className="container max-w-md mx-auto p-4 pt-8 space-y-4 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuração Inicial</h1>
          <p className="text-sm text-muted-foreground">
            Insira os seus dados salariais base para ativar o motor de rascunhos automáticos.
          </p>
        </div>
        <SalarySettingsForm initialData={null} onSaveSuccess={() => router.refresh()} />
      </div>
    );
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
          <p className="text-sm">A processar...</p>
        </div>
      ) : draft ? (
        <>
          <PayslipView draft={draft} />

          <div className="rounded-xl p-3 bg-muted/40 border border-muted text-muted-foreground text-[11px] leading-relaxed text-center space-y-1">
            <p>
              ⚠️ <strong>Aviso de Simulação:</strong> Os valores apresentados são aproximados e servem exclusivamente como uma perspetiva indicativa do vencimento prático.
            </p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t md:relative md:bg-transparent md:border-none md:p-0 z-50">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 text-base font-medium rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> A guardar...</>
              ) : (
                <><CheckCircle2 className="h-5 w-5" /> Confirmar e Fechar Mês</>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-4 px-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            ⚠️ Erro ao processar rascunho de simulação.
          </div>
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