"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TaxRegion, MaritalStatus, MealAllowanceType } from "@prisma/client";

// Esquema de validação Zod expandido com o novo campo de dias fixos
const settingsSchema = z.object({
  baseSalary: z.number().positive("O salário base deve ser maior que zero"),
  hasHolidayBonus: z.boolean(),
  hasChristmasBonus: z.boolean(),
  gratification: z.number().nonnegative(),
  taxRegion: z.nativeEnum(TaxRegion),
  maritalStatus: z.nativeEnum(MaritalStatus),
  dependentsCount: z.number().int().nonnegative(),
  mealAllowanceValue: z.number().nonnegative(),
  mealAllowanceType: z.nativeEnum(MealAllowanceType),
  mealAllowanceDays: z.number().int().min(0).max(31), // 👈 NOVO: Validação do número de dias úteis
});

export async function saveSalarySettings(rawData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Não autorizado.");
  }
  
  const userId = session.user.id;
  const result = settingsSchema.safeParse(rawData);

  if (!result.success) {
    throw new Error("Dados de configuração inválidos.");
  }

  // Desestruturação incluindo o novo campo mapeado do formulário
  const { 
    baseSalary, 
    hasHolidayBonus, 
    hasChristmasBonus, 
    gratification,
    taxRegion,
    maritalStatus,
    dependentsCount,
    mealAllowanceValue,
    mealAllowanceType,
    mealAllowanceDays // 👈 NOVO
  } = result.data;

  // Cria ou atualiza as configurações completas do utilizador (Upsert)
  await prisma.userSalarySettings.upsert({
    where: { userId },
    update: { 
      baseSalary, 
      hasHolidayBonus, 
      hasChristmasBonus, 
      gratification,
      taxRegion,
      maritalStatus,
      dependentsCount,
      mealAllowanceValue,
      mealAllowanceType,
      mealAllowanceDays // 👈 NOVO
    },
    create: { 
      userId, 
      baseSalary, 
      hasHolidayBonus, 
      hasChristmasBonus, 
      gratification,
      taxRegion,
      maritalStatus,
      dependentsCount,
      mealAllowanceValue,
      mealAllowanceType,
      mealAllowanceDays // 👈 NOVO
    },
  });

  // Limpa a cache para atualizar instantaneamente o motor do rascunho com os novos valores
  revalidatePath("/payslips");
  return { success: true };
}
