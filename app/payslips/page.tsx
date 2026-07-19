// app/payslips/page.tsx
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PayslipCalculator } from "./_components/payslip-calculator";
import { SalarySettingsForm } from "./_components/salary-settings";
import { getPayslipsHistory } from "./_actions/get-payslips";

export default async function PayslipsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // 1. Procura as definições salariais do utilizador
  const salarySettings = await prisma.userSalarySettings.findUnique({
    where: { userId: session.user.id },
  });

  // 2. CORREÇÃO: Se NÃO existirem dados, renderiza IMEDIATAMENTE o formulário inicial
  if (!salarySettings) {
    return (
      <div className="container max-w-md mx-auto p-4 pt-8 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuração Inicial</h1>
          <p className="text-sm text-muted-foreground">
            Insira os seus dados salariais base para ativar o motor de rascunhos automáticos.
          </p>
        </div>
        <SalarySettingsForm />
      </div>
    );
  }

  // 3. Se chegou aqui, os dados existem. Executa a higienização dos dados do perfil
  const sanitizedSettings = {
    ...salarySettings,
    baseSalary: Number(salarySettings.baseSalary),
    gratification: Number(salarySettings.gratification),
    mealAllowanceValue: Number(salarySettings.mealAllowanceValue),
  };

  // 4. Procura o histórico de recibos
  const historyResponse = await getPayslipsHistory();
  const rawHistory = historyResponse.success ? historyResponse.data : [];

  // 5. Higienização da lista do histórico (Decimais para Numbers)
  const sanitizedHistory = rawHistory.map((item: any) => ({
    ...item,
    baseSalary: Number(item.baseSalary),
    totalGross: Number(item.totalGross),
    totalDeductions: Number(item.totalDeductions),
    netSalary: Number(item.netSalary),
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  }));

  // 6. Envia os dados limpos para o componente cliente
  return (
    <PayslipCalculator 
      salarySettings={sanitizedSettings} 
      initialHistory={sanitizedHistory} 
    />
  );
}
