// app/payslips/_actions/get-payslips.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getPayslipsHistory() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Utilizador não autenticado.", data: [] };
    }

    const payslips = await prisma.payslip.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
      ],
    });

    return { success: true, data: payslips };
  } catch (error) {
    console.error("Erro ao procurar histórico:", error);
    return { success: false, error: "Erro ao carregar o histórico.", data: [] };
  }
}
