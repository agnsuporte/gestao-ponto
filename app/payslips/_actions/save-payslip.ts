"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import  prisma  from "@/lib/prisma";
import { savePayslipSchema } from "../_schemas/payslip-schema";
import { revalidatePath } from "next/cache";

export async function savePayslip(rawData: unknown) {
  // 1. Validar autenticação do utilizador com NextAuth
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Não autorizado. Sessão inválida.");
  }

  const userId = session.user.id;

  // 2. Validar a estrutura dos dados recebidos com o Zod
  const result = savePayslipSchema.safeParse(rawData);
  
  if (!result.success) {
    throw new Error("Dados do recibo inválidos ou corrompidos.");
  }

  const { month, year, baseSalary, totalGross, totalDeductions, netSalary, lines } = result.data;

  try {
    // 3. Garantir atomicidade com uma transação Prisma (Grava tudo ou nada)
    const savedPayslip = await prisma.$transaction(async (tx) => {
      
      // 4. Verificar se já existe um recibo gravado para este mês/ano (Evita duplicados)
      const existingPayslip = await tx.payslip.findUnique({
        where: {
          userId_month_year: {
            userId,
            month,
            year,
          },
        },
      });

      if (existingPayslip) {
        throw new Error(`Já existe um recibo guardado para o mês ${month}/${year}.`);
      }

      // 5. Criar o registo principal do recibo e as suas respetivas linhas
      return await tx.payslip.create({
        data: {
          userId,
          month,
          year,
          baseSalary,
          totalGross,
          totalDeductions,
          netSalary,
          lines: {
            create: lines.map((line) => ({
              code: line.code,
              description: line.description,
              type: line.type,
              quantity: line.quantity,
              unitValue: line.unitValue,
              rate: line.rate,
              baseValue: line.baseValue,
              totalValue: line.totalValue,
            })),
          },
        },
        include: {
          lines: true,
        },
      });
    });

    // 6. Atualizar a cache do Next.js para refletir o novo recibo no histórico
    revalidatePath("/payslips");

    return { success: true, data: savedPayslip };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Erro interno ao guardar o recibo de vencimento." 
    };
  }
}
