"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { calculateSalaryMetrics } from "@/lib/WorkHoursUtils"; 
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
  year: number
): Promise<PayslipDraftResponse | null> {
  // Forçar limpeza de cache do Next.js para garantir dados frescos do mês selecionado
  revalidatePath("/payslips");

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Não autorizado. Sessão expirada ou inválida.");
  }

  const userId = session.user.id; 

  // 1. Procurar definições salariais e fiscais do utilizador na BD
  const settings = await prisma.userSalarySettings.findUnique({
    where: { userId },
  });

  if (!settings) return null; 

  const baseSalary = Number(settings.baseSalary);
  const gratification = Number(settings.gratification);
  const mealValueDiario = Number(settings.mealAllowanceValue);
  const metrics = calculateSalaryMetrics(baseSalary);

  // Fórmula Oficial de Recursos Humanos em Portugal (4 casas decimais para evitar desvios)
  const valorHoraExato = Number(((baseSalary * 12) / (52 * 40)).toFixed(4));

  // 2. Procurar todos os registos do mês na BD para cálculo automático de horas extra e dias trabalhados
  const datePrefix = `${year}-${String(month).padStart(2, "0")}`;
  const dbRecords = await prisma.timeRecord.findMany({
    where: {
      userId,
      date: { startsWith: datePrefix },
    },
  });

  let totalOvertimeMinutesFromDB = 0; 
  let autoWorkedDays = 0;

  for (const dbRecord of dbRecords) {
    const record: TimeRecord = dbRecord as unknown as TimeRecord;
    if (record.total_minutes && record.total_minutes > 0) autoWorkedDays++;
    if (record.overtime_minutes) totalOvertimeMinutesFromDB += record.overtime_minutes;
  }

  // Define os dias de subsídio de alimentação de acordo com o perfil ou dias reais picados
  const finalMealDays = settings.mealAllowanceDays !== undefined && settings.mealAllowanceDays !== null
    ? Number(settings.mealAllowanceDays)
    : autoWorkedDays;

  // Conversão exata de minutos acumulados para horas decimais
  const totalOvertimeHours = totalOvertimeMinutesFromDB / 60;

  // 3. Aplicação do Teto de 20h (Mecânica Legal: Primeiras 20h a 50%, restante a 75%)
  let finalHours50 = 0;
  let finalHours75 = 0;
 
  if (totalOvertimeHours <= 20) {
    finalHours50 = Number(totalOvertimeHours.toFixed(2));
    finalHours75 = 0;
  } else {
    finalHours50 = 20;
    finalHours75 = Number((totalOvertimeHours - 20).toFixed(2));
  }

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

  // Linhas 002 e 003: Duodécimos Dinâmicos
  if (settings.hasHolidayBonus) {
    lines.push({
      code: "002",
      description: "Subsídio Férias (Duodécimos)",
      type: "ABONO",
      quantity: 2.5,
      totalValue: Number(metrics.holidayBonus.toFixed(2)),
    });
  }

  if (settings.hasChristmasBonus) {
    lines.push({
      code: "003",
      description: "Subsídio Natal (Duodécimos)",
      type: "ABONO",
      quantity: 2.5,
      totalValue: Number(metrics.christmasBonus.toFixed(2)),
    });
  }

  // Linha 060: Gratificações Dinâmicas (Só entra se configurada nas definições do utilizador)
  if (gratification > 0) {
    lines.push({
      code: "060",
      description: "Gratificação Resultados",
      type: "ABONO",
      totalValue: gratification,
    });
  }

  // Linhas 201 e 202: Horas Extra Dinâmicas com Precisão Legal
  if (finalHours50 > 0) {
    const unitValue50 = Number((valorHoraExato * 1.5).toFixed(4));
    lines.push({
      code: "201",
      description: "Horas Extras (50%)",
      type: "ABONO",
      quantity: finalHours50,
      unitValue: Number(unitValue50.toFixed(2)),
      totalValue: Number((finalHours50 * unitValue50).toFixed(2)),
    });
  }

  if (finalHours75 > 0) {
    const unitValue75 = Number((valorHoraExato * 1.75).toFixed(4));
    lines.push({
      code: "202",
      description: "Horas Extras (75%)",
      type: "ABONO",
      quantity: finalHours75,
      unitValue: Number(unitValue75.toFixed(2)),
      totalValue: Number((finalHours75 * unitValue75).toFixed(2)),
    });
  }

  // Linhas 110 e 111: Subsídio de Alimentação Dinâmico baseado no teto do Modo Cartão/Dinheiro
  let tributavelSubAlim = 0;
  let valorIsentoDoSub = 0;

  if (finalMealDays > 0 && mealValueDiario > 0) {
    const IsencaoLimite = settings.mealAllowanceType === "CARTAO" ? 9.60 : 6.00;
    const totalSubAlim = Number((finalMealDays * mealValueDiario).toFixed(2));
    
    if (mealValueDiario <= IsencaoLimite) {
      valorIsentoDoSub = totalSubAlim;
      lines.push({
        code: "110",
        description: `Subsídio de Alimentação`,
        type: "ABONO",
        quantity: finalMealDays,
        unitValue: mealValueDiario,
        totalValue: totalSubAlim,
      });
    } else {
      const valorIsentoDiario = IsencaoLimite;
      const valorTributavelDiario = mealValueDiario - IsencaoLimite;

      valorIsentoDoSub = Number((finalMealDays * valorIsentoDiario).toFixed(2));
      tributavelSubAlim = Number((finalMealDays * valorTributavelDiario).toFixed(2));

      lines.push({
        code: "110",
        description: `Subsídio de Alimentação (Isento)`,
        type: "ABONO",
        quantity: finalMealDays,
        unitValue: valorIsentoDiario,
        totalValue: valorIsentoDoSub,
      });

      lines.push({
        code: "111",
        description: `Subsídio de Alimentação (Sujeito)`,
        type: "ABONO",
        quantity: finalMealDays,
        unitValue: valorTributavelDiario,
        totalValue: tributavelSubAlim,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // PROCESSAMENTO SEGURO DE DESCONTOS (TOTALMENTE ALGORÍTMICO)
  // ---------------------------------------------------------------------------
  
  const totalGross = lines
    .filter(l => l.type === "ABONO")
    .reduce((sum, l) => sum + l.totalValue, 0);

  // Códigos que por lei sofrem desconto de Segurança Social (11%)
  const codigosSujeitosSS = ["001", "002", "003", "201", "202", "111"];
  const ssBaseIncidence = Number(
    lines
      .filter(l => l.type === "ABONO" && codigosSujeitosSS.includes(l.code))
      .reduce((sum, l) => sum + l.totalValue, 0)
      .toFixed(2)
  );

  const ssTotalValue = Number((ssBaseIncidence * 0.11).toFixed(2));
  
  lines.push({
    code: "301",
    description: "Segurança Social",
    type: "DESCONTO",
    rate: 11.00,
    baseValue: ssBaseIncidence,
    totalValue: ssTotalValue,
  });

  // Códigos que por lei sofrem retenção na fonte de IRS
  const codigosSujeitosIRS = [...codigosSujeitosSS, "060"];
  const brutoTributavelIRS = Number(
    lines
      .filter(l => l.type === "ABONO" && codigosSujeitosIRS.includes(l.code))
      .reduce((sum, l) => sum + l.totalValue, 0)
      .toFixed(2)
  );

  // Chamada à função genérica de cálculo de IRS
  const irsFiscalResult = calculateDynamicIrs({
    brutoTributavel: brutoTributavelIRS,
    maritalStatus: settings.maritalStatus,
    dependentsCount: settings.dependentsCount,
    region: settings.taxRegion,
  });

  if (irsFiscalResult.finalTaxValue > 0) {
    lines.push({
      code: "305",
      description: `Retenção na Fonte de IRS (${irsFiscalResult.effectiveRate}%)`,
      type: "DESCONTO",
      rate: irsFiscalResult.effectiveRate,
      baseValue: brutoTributavelIRS,
      totalValue: irsFiscalResult.finalTaxValue,
    });
  }

  const totalDeductions = Number((ssTotalValue + irsFiscalResult.finalTaxValue).toFixed(2));
  const netSalary = Number((totalGross - totalDeductions).toFixed(2));

  return {
    baseSalary,
    totalGross: Number(totalGross.toFixed(2)),
    totalDeductions,
    netSalary,
    lines,
  };
}
