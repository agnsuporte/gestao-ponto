import { z } from "zod";

export const payslipLineSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["ABONO", "DESCONTO"]),
  quantity: z.number().nullable().optional(),
  unitValue: z.number().nullable().optional(),
  rate: z.number().nullable().optional(),
  baseValue: z.number().nullable().optional(),
  totalValue: z.number().nonnegative(),
});

export const savePayslipSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2035),
  baseSalary: z.number().positive(),
  totalGross: z.number().nonnegative(),
  totalDeductions: z.number().nonnegative(),
  netSalary: z.number().nonnegative(),
  lines: z.array(payslipLineSchema).min(1),
});
