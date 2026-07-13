// app/payslips/page.tsx
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PayslipCalculator } from "./_components/payslip-calculator";
import { SalarySettingsForm } from "./_components/salary-settings";
import { getPayslipsHistory } from "./_actions/get-payslips"

export default async function PayslipsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const salarySettings = await prisma.userSalarySettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!salarySettings) {
    return null; // Ou lida com o ecrã de bloqueio inicial
  }

  // ✨ Sanitização: transforma objetos Decimal em Numbers puros do JavaScript
  const settings = {
    ...salarySettings,
    baseSalary: Number(salarySettings.baseSalary),
    gratification: Number(salarySettings.gratification),
    mealAllowanceValue: Number(salarySettings.mealAllowanceValue), // <-- Resolve o erro do log!
  };

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

  const historyResponse = await getPayslipsHistory();
  const rawHistory = historyResponse.success ? historyResponse.data : [];

  // =========================================================================
  // HIGIENIZAÇÃO: Converter objetos Decimal do Prisma em Plain Numbers/Objects
  // =========================================================================
  

// Localiza a tua sanitização antes da linha 80:
const sanitizedSettings = {
  ...salarySettings, // O objeto vindo do prisma.userSalarySettings.findUnique
  baseSalary: Number(salarySettings.baseSalary),
  gratification: Number(salarySettings.gratification),
  // ✨ ADICIONAR ESTA LINHA ABAIXO PARA CORRIGIR O ERRO:
  mealAllowanceValue: Number(salarySettings.mealAllowanceValue),
};


  // 2. Sanitizar a lista do histórico (caso use Decimais nas colunas da tabela Payslip)
  const sanitizedHistory = rawHistory.map((item: any) => ({
    ...item,
    baseSalary: Number(item.baseSalary),
    totalGross: Number(item.totalGross),
    totalDeductions: Number(item.totalDeductions),
    netSalary: Number(item.netSalary),
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  }));

  // Enviamos os dados limpos e puros para o cliente
  return (
    <PayslipCalculator 
      salarySettings={sanitizedSettings} 
      initialHistory={sanitizedHistory} 
    />
  );
}
