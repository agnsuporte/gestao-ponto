// app/payslips/_components/salary-settings.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { saveSalarySettings } from "../_actions/save-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Settings2, ShieldCheck, Wallet } from "lucide-react";
import { TaxRegion, MaritalStatus, MealAllowanceType } from "@prisma/client";

interface SalarySettingsFormProps {
  initialData?: {
    baseSalary: number;
    hasHolidayBonus: boolean;
    hasChristmasBonus: boolean;
    gratification: number;
    taxRegion: TaxRegion;
    maritalStatus: MaritalStatus;
    dependentsCount: number;
    mealAllowanceValue: number;
    mealAllowanceType: MealAllowanceType;
  } | null;
  onSaveSuccess?: () => void;
}

export function SalarySettingsForm({ initialData, onSaveSuccess }: SalarySettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  // Estados base salariais
  const [baseSalary, setBaseSalary] = React.useState(initialData ? String(initialData.baseSalary) : "955.00");
  const [hasHoliday, setHasHoliday] = React.useState(initialData ? initialData.hasHolidayBonus : true);
  const [hasChristmas, setHasChristmas] = React.useState(initialData ? initialData.hasChristmasBonus : true);
  const [gratification, setGratification] = React.useState(initialData ? String(initialData.gratification) : "0.00");

  // Estados do perfil fiscal de IRS
  const [taxRegion, setTaxRegion] = React.useState<TaxRegion>(initialData ? initialData.taxRegion : TaxRegion.CONTINENTE);
  const [maritalStatus, setMaritalStatus] = React.useState<MaritalStatus>(initialData ? initialData.maritalStatus : MaritalStatus.NAO_CASADO);
  const [dependentsCount, setDependentsCount] = React.useState(initialData ? String(initialData.dependentsCount) : "0");

  // Estados do Subsídio de Alimentação
  const [mealAllowanceValue, setMealAllowanceValue] = React.useState(initialData ? String(initialData.mealAllowanceValue) : "0.00");
  const [mealAllowanceType, setMealAllowanceType] = React.useState<MealAllowanceType>(initialData ? initialData.mealAllowanceType : MealAllowanceType.CARTAO);
  const [mealAllowanceDays, setMealAllowanceDays] = React.useState(initialData ? String(initialData.mealAllowanceDays) : "22");

  // Atualiza os estados quando os dados assíncronos da BD chegam
  React.useEffect(() => {
    if (initialData) {
      setBaseSalary(String(initialData.baseSalary));
      setHasHoliday(initialData.hasHolidayBonus);
      setHasChristmas(initialData.hasChristmasBonus);
      setGratification(String(initialData.gratification));
      setTaxRegion(initialData.taxRegion);
      setMaritalStatus(initialData.maritalStatus);
      setDependentsCount(String(initialData.dependentsCount));
      setMealAllowanceValue(String(initialData.mealAllowanceValue));
      setMealAllowanceType(initialData.mealAllowanceType);
      setMealAllowanceDays(String(initialData.mealAllowanceDays ?? 22));
    }
  }, [initialData]);

  // Submissão unificada dos dados para a Server Action
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveSalarySettings({
        baseSalary: Number(baseSalary),
        hasHolidayBonus: hasHoliday,
        hasChristmasBonus: hasChristmas,
        gratification: Number(gratification),
        taxRegion,
        maritalStatus,
        dependentsCount: Number(dependentsCount),
        mealAllowanceValue: Number(mealAllowanceValue),
        mealAllowanceType,
        mealAllowanceDays: Number(mealAllowanceDays),
      });

      if (res.success) {
        toast.success("Preferências salariais e fiscais guardadas com sucesso!");
        if (onSaveSuccess) {
          onSaveSuccess();
        } else {
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao guardar configurações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full border border-muted/60 shadow-sm max-h-[85vh] overflow-y-auto">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" /> Configuração do Ordenado
        </CardTitle>
        <CardDescription>
          Insira os seus dados base e perfil fiscal para podermos estimar o seu IRS dinâmico e o seu recibo real de forma precisa.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-5 pt-0 space-y-5">
          {/* Seção 1: Configuração Base */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary" className="text-sm font-semibold">Vencimento Base (€)</Label>
              <Input
                id="baseSalary"
                type="number"
                step="0.01"
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/10">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">Sub. Férias</Label>
                  <p className="text-[10px] text-muted-foreground">Duodécimos</p>
                </div>
                <Switch checked={hasHoliday} onCheckedChange={setHasHoliday} />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/10">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">Sub. Natal</Label>
                  <p className="text-[10px] text-muted-foreground">Duodécimos</p>
                </div>
                <Switch checked={hasChristmas} onCheckedChange={setHasChristmas} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gratification" className="text-sm font-semibold">Gratificação de Resultados (€)</Label>
              <Input
                id="gratification"
                type="number"
                step="0.01"
                value={gratification}
                onChange={(e) => setGratification(e.target.value)}
                className="h-12 text-base"
                placeholder="0.00"
              />
            </div>
          </div>

          <hr className="border-muted/60" />

          {/* Seção 2: Perfil Fiscal (IRS) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> RETENÇÃO NA FONTE (IRS)
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Região Fiscal</Label>
                <select
                  value={taxRegion}
                  onChange={(e) => setTaxRegion(e.target.value as TaxRegion)}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={TaxRegion.CONTINENTE}>Continente</option>
                  <option value={TaxRegion.MADEIRA}>Madeira</option>
                  <option value={TaxRegion.ACORES}>Açores</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependentsCount" className="text-xs font-semibold">Dependentes (Filhos)</Label>
                <Input
                  id="dependentsCount"
                  type="number"
                  min="0"
                  value={dependentsCount}
                  onChange={(e) => setDependentsCount(e.target.value)}
                  className="h-11 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Estado Civil e Titularidade</Label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={MaritalStatus.NAO_CASADO}>Não Casado (Solteiro / Divorciado / Viúvo)</option>
                <option value={MaritalStatus.CASADO_UNICO_TITULAR}>Casado, Único Titular</option>
                <option value={MaritalStatus.CASADO_DOIS_TITULARES}>Casado, Dois Titulares</option>
              </select>
            </div>
          </div>

          <hr className="border-muted/60" />

          {/* Seção 3: Subsídio de Alimentação */}
          {/* Seção 3: Subsídio de Alimentação Expandido */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground">
              <Wallet className="h-4 w-4 text-blue-500" /> SUBSÍDIO DE ALIMENTAÇÃO
            </h3>

            <div className="grid grid-cols-3 gap-2"> {/* Mudado para 3 colunas */}
              <div className="space-y-2">
                <Label htmlFor="mealValue" className="text-xs font-semibold">Valor Diário (€)</Label>
                <Input
                  id="mealValue"
                  type="number"
                  step="0.01"
                  value={mealAllowanceValue}
                  onChange={(e) => setMealAllowanceValue(e.target.value)}
                  className="h-11 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealDays" className="text-xs font-semibold">Dias a Pagar</Label>
                <Input
                  id="mealDays"
                  type="number"
                  min="0"
                  max="31"
                  value={mealAllowanceDays}
                  onChange={(e) => setMealAllowanceDays(e.target.value)}
                  className="h-11 text-sm"
                  placeholder="Ex: 22"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Modo Pagamento</Label>
                <select
                  value={mealAllowanceType}
                  onChange={(e) => setMealAllowanceType(e.target.value as MealAllowanceType)}
                  className="w-full h-11 px-2 rounded-xl border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={MealAllowanceType.CARTAO}>Cartão (9.60€)</option>
                  <option value={MealAllowanceType.DINHEIRO}>Dinheiro (6.00€)</option>
                </select>
              </div>
            </div>
          </div>


          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 text-base font-medium rounded-xl transition-all active:scale-[0.98] mt-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                A guardar preferências...
              </>
            ) : (
              "Guardar Configurações Completas"
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
