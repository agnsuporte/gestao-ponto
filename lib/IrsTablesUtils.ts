import { TaxRegion, MaritalStatus } from '@prisma/client';

interface IrsBracket {
  limit: number;                 // Limite máximo do rendimento bruto para este escalão
  rate: number;                  // Taxa de retenção (Ex: 0.14 para 14%)
  deduction: number;             // Parcela a abater padrão
  deductionPerDependent: number; // Parcela a abater por cada dependente
}

// Tabelas de Retenção na Fonte de IRS (Exemplo estrutural atualizado para o Continente)
const IRS_TABLES: Record<MaritalStatus, IrsBracket[]> = {
  [MaritalStatus.NAO_CASADO]: [
    { limit: 820, rate: 0.00, deduction: 0.00, deductionPerDependent: 0.00 },
    { limit: 950, rate: 0.13, deduction: 106.60, deductionPerDependent: 34.29 },
    { limit: 1150, rate: 0.165, deduction: 139.85, deductionPerDependent: 36.50 },
    { limit: 1400, rate: 0.22, deduction: 203.10, deductionPerDependent: 38.20 },
    { limit: 1900, rate: 0.25, deduction: 245.10, deductionPerDependent: 40.10 },
    { limit: 2600, rate: 0.28, deduction: 302.10, deductionPerDependent: 42.50 },
    { limit: Infinity, rate: 0.36, deduction: 510.10, deductionPerDependent: 45.00 },
  ],
  [MaritalStatus.CASADO_UNICO_TITULAR]: [
    { limit: 820, rate: 0.00, deduction: 0.00, deductionPerDependent: 0.00 },
    { limit: 1050, rate: 0.04, deduction: 42.00, deductionPerDependent: 38.10 },
    { limit: 1300, rate: 0.12, deduction: 126.00, deductionPerDependent: 40.20 },
    { limit: 1700, rate: 0.19, deduction: 217.10, deductionPerDependent: 42.00 },
    { limit: Infinity, rate: 0.26, deduction: 336.10, deductionPerDependent: 45.00 },
  ],
  [MaritalStatus.CASADO_DOIS_TITULARES]: [
    { limit: 820, rate: 0.00, deduction: 0.00, deductionPerDependent: 0.00 },
    { limit: 980, rate: 0.11, deduction: 90.20, deductionPerDependent: 34.29 },
    { limit: 1200, rate: 0.15, deduction: 129.40, deductionPerDependent: 36.50 },
    { limit: 1500, rate: 0.21, deduction: 201.40, deductionPerDependent: 38.20 },
    { limit: Infinity, rate: 0.27, deduction: 291.40, deductionPerDependent: 41.00 },
  ],
};

interface CalculateIrsInput {
  brutoTributavel: number;
  maritalStatus: MaritalStatus;
  dependentsCount: number;
  region: TaxRegion;
}

interface IrsResult {
  finalTaxValue: number;    // Valor final retido em Euros
  effectiveRate: number;    // Taxa real final líquida (Ex: 7.78%)
}

/**
 * Calcula o valor de retenção na fonte de IRS com base no modelo progressivo português
 */
export function calculateDynamicIrs(input: CalculateIrsInput): IrsResult {
  const { brutoTributavel, maritalStatus, dependentsCount } = input;

  // Se o salário estiver abaixo do mínimo de existência geral, não retém IRS
  if (brutoTributavel <= 820) {
    return { finalTaxValue: 0, effectiveRate: 0 };
  }

  // Seleciona a tabela com base no Estado Civil
  const brackets = IRS_TABLES[maritalStatus];

  // Descobre em qual escalão o rendimento bruto se enquadra
  const bracket = brackets.find((b) => brutoTributavel <= b.limit) || brackets[brackets.length - 1];

  // 1. Aplicação da taxa direta sobre o bruto
  const baseTax = brutoTributavel * bracket.rate;

  // 2. Subtração da parcela a abater do escalão
  let calculatedTax = baseTax - bracket.deduction;

  // 3. Subtração da parcela por dependentes
  const totalDependentDeduction = dependentsCount * bracket.deductionPerDependent;
  calculatedTax -= totalDependentDeduction;

  // Salvaguarda: a retenção nunca pode ser negativa
  const finalTaxValue = Math.max(0, Number(calculatedTax.toFixed(2)));

  // Calcula a taxa efetiva real que vai aparecer no recibo para informação do utilizador
  const effectiveRate = brutoTributavel > 0 ? Number(((finalTaxValue / brutoTributavel) * 100).toFixed(2)) : 0;

  return {
    finalTaxValue,
    effectiveRate,
  };
}
