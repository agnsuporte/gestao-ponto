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
import { Banknote, Loader2, Settings2, ShieldCheck, Wallet } from "lucide-react";
import { TaxRegion, MaritalStatus, MealAllowanceType } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    mealAllowanceDays: number; // ✨ CORRIGIDO: Adicionado à interface
  } | null;
  onSaveSuccess?: () => void;
}

export function SalarySettingsForm({ initialData, onSaveSuccess }: SalarySettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  // Estados base salariais com fallback seguro para strings
  const [baseSalary, setBaseSalary] = React.useState(() => initialData ? String(initialData.baseSalary) : "955.00");
  const [hasHoliday, setHasHoliday] = React.useState(() => initialData ? initialData.hasHolidayBonus : true);
  const [hasChristmas, setHasChristmas] = React.useState(() => initialData ? initialData.hasChristmasBonus : true);
  const [gratification, setGratification] = React.useState(() => initialData ? String(initialData.gratification) : "0.00");

  // Estados do perfil fiscal de IRS
  const [taxRegion, setTaxRegion] = React.useState<TaxRegion>(() => initialData ? initialData.taxRegion : TaxRegion.CONTINENTE);
  const [maritalStatus, setMaritalStatus] = React.useState<MaritalStatus>(() => initialData ? initialData.maritalStatus : MaritalStatus.NAO_CASADO);
  const [dependentsCount, setDependentsCount] = React.useState(() => initialData ? String(initialData.dependentsCount) : "0");

  // Estados do Subsídio de Alimentação
  const [mealAllowanceValue, setMealAllowanceValue] = React.useState(() => initialData ? String(initialData.mealAllowanceValue) : "0.00");
  const [mealAllowanceType, setMealAllowanceType] = React.useState<MealAllowanceType>(() => initialData ? initialData.mealAllowanceType : MealAllowanceType.CARTAO);
  const [mealAllowanceDays, setMealAllowanceDays] = React.useState(() => initialData ? String(initialData.mealAllowanceDays) : "22");

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
    <Card className="w-full max-w-md border border-indigo-500/10 shadow-xl bg-background/80 backdrop-blur-md max-h-[85vh] flex flex-col rounded-2xl overflow-hidden transition-all">
      <CardHeader className="p-4 pb-2 border-b border-muted/30 bg-indigo-500/[0.02]">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Settings2 className="h-4 w-4" /> Configuração do Ordenado
        </CardTitle>
        <CardDescription className="text-xs">
          Insira os seus dados base e perfil fiscal organizados por secções.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <CardContent className="p-4 flex-1 overflow-y-auto">
          <Tabs defaultValue="base" className="w-full">
            {/* Abas Superiores Flutuantes com Cores Ativas */}
            <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/50 rounded-xl p-1 mb-4 border border-muted/30">
              <TabsTrigger 
                value="base" 
                className="text-xs font-semibold rounded-lg gap-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Banknote className="h-3.5 w-3.5" /> Base
              </TabsTrigger>
              <TabsTrigger 
                value="fiscal" 
                className="text-xs font-semibold rounded-lg gap-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-200"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> IRS
              </TabsTrigger>
              <TabsTrigger 
                value="subsidio" 
                className="text-xs font-semibold rounded-lg gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Wallet className="h-3.5 w-3.5" /> Alim.
              </TabsTrigger>
            </TabsList>

            {/* ABA 1: Configuração Base */}
            <TabsContent value="base" className="space-y-4 focus-visible:outline-none animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <Label htmlFor="baseSalary" className="text-xs font-semibold">Vencimento Base (€)</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  step="0.01"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="h-10 text-sm rounded-xl bg-background/50 focus-visible:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between rounded-xl border border-muted/60 p-2.5 bg-muted/10">
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold">Sub. Férias</Label>
                    <p className="text-[9px] text-muted-foreground">Duodécimos</p>
                  </div>
                  <Switch checked={hasHoliday} onCheckedChange={setHasHoliday} className="data-[state=checked]:bg-indigo-600" />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-muted/60 p-2.5 bg-muted/10">
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold">Sub. Natal</Label>
                    <p className="text-[9px] text-muted-foreground">Duodécimos</p>
                  </div>
                  <Switch checked={hasChristmas} onCheckedChange={setHasChristmas} className="data-[state=checked]:bg-indigo-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gratification" className="text-xs font-semibold">Gratificação de Resultados (€)</Label>
                <Input
                  id="gratification"
                  type="number"
                  step="0.01"
                  value={gratification}
                  onChange={(e) => setGratification(e.target.value)}
                  className="h-10 text-sm rounded-xl bg-background/50 focus-visible:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </TabsContent>

            {/* ABA 2: Perfil Fiscal (IRS) */}
            <TabsContent value="fiscal" className="space-y-4 focus-visible:outline-none animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Região Fiscal</Label>
                  <select
                    value={taxRegion}
                    onChange={(e) => setTaxRegion(e.target.value as TaxRegion)}
                    className="w-full h-10 px-2 rounded-xl border border-input bg-background/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value={TaxRegion.CONTINENTE}>Continente</option>
                    <option value={TaxRegion.MADEIRA}>Madeira</option>
                    <option value={TaxRegion.ACORES}>Açores</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dependentsCount" className="text-xs font-semibold">Dependentes (Filhos)</Label>
                  <Input
                    id="dependentsCount"
                    type="number"
                    min="0"
                    value={dependentsCount}
                    onChange={(e) => setDependentsCount(e.target.value)}
                    className="h-10 text-sm rounded-xl bg-background/50 focus-visible:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Estado Civil e Titularidade</Label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full h-10 px-2 rounded-xl border border-input bg-background/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value={MaritalStatus.NAO_CASADO}>Não Casado (Solteiro / Divorciado)</option>
                  <option value={MaritalStatus.CASADO_UNICO_TITULAR}>Casado, Único Titular</option>
                  <option value={MaritalStatus.CASADO_DOIS_TITULARES}>Casado, Dois Titulares</option>
                </select>
              </div>
            </TabsContent>

            {/* ABA 3: Subsídio de Alimentação */}
            <TabsContent value="subsidio" className="space-y-4 focus-visible:outline-none animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="mealValue" className="text-[11px] font-semibold tracking-tight">Valor Diário (€)</Label>
                  <Input
                    id="mealValue"
                    type="number"
                    step="0.01"
                    value={mealAllowanceValue}
                    onChange={(e) => setMealAllowanceValue(e.target.value)}
                    className="h-10 text-xs px-2 rounded-xl bg-background/50 focus-visible:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mealDays" className="text-[11px] font-semibold tracking-tight">Dias a Pagar</Label>
                  <Input
                    id="mealDays"
                    type="number"
                    min="0"
                    max="31"
                    value={mealAllowanceDays}
                    onChange={(e) => setMealAllowanceDays(e.target.value)}
                    className="h-10 text-xs px-2 rounded-xl bg-background/50 focus-visible:ring-blue-500"
                    placeholder="22"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold tracking-tight">Modo Pagamento</Label>
                  <select
                    value={mealAllowanceType}
                    onChange={(e) => setMealAllowanceType(e.target.value as MealAllowanceType)}
                    className="w-full h-10 px-1 rounded-xl border border-input bg-background/50 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value={MealAllowanceType.CARTAO}>Cartão</option>
                    <option value={MealAllowanceType.DINHEIRO}>Dinheiro</option>
                  </select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Rodapé Fixo com Botão de Submissão Colorido */}
        <div className="p-4 bg-indigo-500/[0.02] border-t border-muted/30">
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-11 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/10 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                A guardar preferências...
              </>
            ) : (
              "Guardar Configurações"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

