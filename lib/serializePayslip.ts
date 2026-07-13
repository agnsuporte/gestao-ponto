// 1. Crie um helper simples de conversão (pode colocar num ficheiro utils ou no 
// topo da Action)
function serializePayslip(payslip: any) {
  if (!payslip) return null;

  return {
    ...payslip,
    // Converte os Decimais da tabela principal para number
    baseSalary: Number(payslip.baseSalary),
    totalGross: Number(payslip.totalGross),
    totalDeductions: Number(payslip.totalDeductions),
    netSalary: Number(payslip.netSalary),
    
    // Converte recursivamente os Decimais se houver linhas associadas (PayslipLine)
    lines: payslip.lines?.map((line: any) => ({
      ...line,
      amount: Number(line.amount),
      baseValue: line.baseValue ? Number(line.baseValue) : undefined,
    })) || [],
  };
}
