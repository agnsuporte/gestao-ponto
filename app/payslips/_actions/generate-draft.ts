"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateDailyWorkMinutesSplit, calculateSalaryMetrics } from "@/lib/WorkHoursUtils"; 
import { calculateDynamicIrs } from "@/lib/IrsTablesUtils";
import { TimeRecord } from "@/types/timeRecord";

export interface PayslipLineDraft {
  code: string;
  description: string;
  type: "ABONO" | "DESCONTO";
  quantity?: number;
  unitValue?: number;
  rate?: number;
  baseValue?: number;
  totalValue: number;
}

export interface PayslipDraftResponse {
  baseSalary: number;
  totalGross: number;
  totalDeductions: number;
  netSalary: number;
  lines: PayslipLineDraft[];
}

export async function generatePayslipDraft(
  month: number, 
  year: number, 
  workedDaysInput?: number // Input opcional dos dias para subsídio de alimentação
): Promise<PayslipDraftResponse | null> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Não autorizado. Sessão expirada ou inválida.");
  }

  const userId = session.user.id; 

  // 1. Procurar definições salariais e fiscais do utilizador
  const settings = await prisma.userSalarySettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    return null; 
  }

  const baseSalary = Number(settings.baseSalary);
  const gratification = Number(settings.gratification);
  const mealValueDiario = Number(settings.mealAllowanceValue);
  
  const metrics = calculateSalaryMetrics(baseSalary);
  const hourlyRate = metrics.hourlyRate;

  // 2. Procurar todos os registos do mês na BD para calcular horas e dias úteis
  const datePrefix = `${year}-${String(month).padStart(2, "0")}`;
  const dbRecords = await prisma.timeRecord.findMany({
    where: {
      userId,
      date: { startsWith: datePrefix },
    },
  });

  let totalExtraHours50 = 0;
  let totalExtraHours75 = 0;
  let autoWorkedDays = 0;

  for (const dbRecord of dbRecords) {
    const record: TimeRecord = dbRecord as unknown as TimeRecord;
    
    // Incrementa dias trabalhados se houver registo de tempo
    if (record.total_minutes && record.total_minutes > 0) {
      autoWorkedDays++;
    }
    
    // Executa a nova divisão diária correta (60 min a 50%, o resto a 75%)
    const { overtimeMinutes50, overtimeMinutes75 } = calculateDailyWorkMinutesSplit(record);

    totalExtraHours50 += overtimeMinutes50 / 60;
    totalExtraHours75 += overtimeMinutes75 / 60;
  }

  // Define os dias para subsídio de alimentação (usa o input do user ou a contagem automática)
  const finalMealDays = workedDaysInput !== undefined ? workedDaysInput : autoWorkedDays;

  const finalHours50 = Number(totalExtraHours50.toFixed(2));
  const finalHours75 = Number(totalExtraHours75.toFixed(2));

  const lines: PayslipLineDraft[] = [];

  // Linha 001: Vencimento Base
  lines.push({
    code: "001",
    description: "Vencimento Base",
    type: "ABONO",
    quantity: 30,
    unitValue: Number((baseSalary / 30).toFixed(2)),
    totalValue: baseSalary,
  });

  // Linhas 002 e 003: Subsídios em Duodécimos
  if (settings.hasHolidayBonus) {
    lines.push({
      code: "002",
      description: "Subsídio Férias (Duodécimos)",
      type: "ABONO",
      quantity: 2.5,
      totalValue: metrics.holidayBonus,
    });
  }

  if (settings.hasChristmasBonus) {
    lines.push({
      code: "003",
      description: "Subsídio Natal (Duodécimos)",
      type: "ABONO",
      quantity: 2.5,
      totalValue: metrics.christmasBonus,
    });
  }

  // Linha 060: Gratificações
  if (gratification > 0) {
    lines.push({
      code: "060",
      description: "Gratificação Resultados",
      type: "ABONO",
      totalValue: gratification,
    });
  }

  // Linhas 201 e 202: Horas Extra processadas pelo novo algoritmo diário
  if (finalHours50 > 0) {
    const unitValue50 = Number((hourlyRate * 1.5).toFixed(2));
    lines.push({
      code: "201",
      description: "Horas Extras (50%)",
      type: "ABONO",
      quantity: finalHours50,
      unitValue: unitValue50,
      totalValue: Number((finalHours50 * unitValue50).toFixed(2)),
    });
  }

  if (finalHours75 > 0) {
    const unitValue75 = Number((hourlyRate * 1.75).toFixed(2));
    lines.push({
      code: "202",
      description: "Horas Extras (75%)",
      type: "ABONO",
      quantity: finalHours75,
      unitValue: unitValue75,
      totalValue: Number((finalHours75 * unitValue75).toFixed(2)),
    });
  }

  // ---------------------------------------------------------------------------
  // PROCESSAMENTO DO SUBSÍDIO DE ALIMENTAÇÃO (LEGISLADO EM PORTUGAL)
  // ---------------------------------------------------------------------------
  let tributavelSubAlim = 0;

  if (finalMealDays > 0 && mealValueDiario > 0) {
    // Define o limite legal de isenção com base no tipo de pagamento
    const IsencaoLimite = settings.mealAllowanceType === "CARTAO" ? 9.60 : 6.00;
    
    const totalSubAlim = Number((finalMealDays * mealValueDiario).toFixed(2));
    
    if (mealValueDiario <= IsencaoLimite) {
      // 100% Isento de impostos
      lines.push({
        code: "110",
        description: `Subsídio de Alimentação (Isento - ${settings.mealAllowanceType})`,
        type: "ABONO",
        quantity: 20, //finalMealDays,
        unitValue: mealValueDiario,
        totalValue: totalSubAlim,
      });
    } else {
      // Ultrapassou o limite: divide a parte isenta da parte sujeita a IRS/SS
      const valorIsentoDiario = IsencaoLimite;
      const valorTributavelDiario = mealValueDiario - IsencaoLimite;

      const totalIsento = Number((finalMealDays * valorIsentoDiario).toFixed(2));
      tributavelSubAlim = Number((finalMealDays * valorTributavelDiario).toFixed(2));

      lines.push({
        code: "110",
        description: `Subsídio de Alimentação (Isento)`,
        type: "ABONO",
        quantity: finalMealDays,
        unitValue: valorIsentoDiario,
        totalValue: totalIsento,
      });

      lines.push({
        code: "111",
        description: `Subsídio de Alimentação (Sujeito a IRS/SS)`,
        type: "ABONO",
        quantity: finalMealDays,
        unitValue: valorTributavelDiario,
        totalValue: tributavelSubAlim,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // CÁLCULO DOS TOTAIS E DEDUÇÕES FISCAIS
  // ---------------------------------------------------------------------------
  
  // O total bruto inclui absolutamente todos os abonos (isentos e não isentos)
  const totalGross = lines
    .filter(l => l.type === "ABONO")
    .reduce((sum, l) => sum + l.totalValue, 0);

  // A base de incidência para Segurança Social e IRS EXCLUI a parte isenta do Subsídio de Alimentação
  // Ou seja: Bruto Tributável = Total Bruto - Parte Isenta (Código 110 se existir)
  const linhaIsenta = lines.find(l => l.code === "110");
  const valorIsentoDoSub = linhaIsenta ? linhaIsenta.totalValue : 0;
  const brutoTributavel = Math.max(0, totalGross - valorIsentoDoSub);

  // 1. Desconto da Segurança Social (11%) sobre a base tributável
  const ssTotalValue = Number((brutoTributavel * 0.11).toFixed(2));
  lines.push({
    code: "301",
    description: "Segurança Social",
    type: "DESCONTO",
    rate: 11.00,
    baseValue: brutoTributavel,
    totalValue: ssTotalValue,
  });

  // 2. Desconto do IRS Dinâmico e Progressivo
  const irsFiscallResult = calculateDynamicIrs({
    brutoTributavel,
    maritalStatus: settings.maritalStatus,
    dependentsCount: settings.dependentsCount,
    region: settings.taxRegion,
  });

  if (irsFiscallResult.finalTaxValue > 0) {
    lines.push({
      code: "305",
      description: `Retenção na Fonte de IRS (${irsFiscallResult.effectiveRate}%)`,
      type: "DESCONTO",
      rate: irsFiscallResult.effectiveRate,
      baseValue: brutoTributavel,
      totalValue: irsFiscallResult.finalTaxValue,
    });
  }

  const totalDeductions = Number((ssTotalValue + irsFiscallResult.finalTaxValue).toFixed(2));
  const netSalary = Number((totalGross - totalDeductions).toFixed(2));

  return {
    baseSalary,
    totalGross: Number(totalGross.toFixed(2)),
    totalDeductions,
    netSalary,
    lines,
  };
}
