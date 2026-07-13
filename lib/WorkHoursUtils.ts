import { TimeRecord } from '@/types/timeRecord';

export const DAILY_HOURS = 8;
export const DAILY_MINUTES = DAILY_HOURS * 60;
export const WEEKLY_HOURS = 40;
export const WEEKLY_MINUTES = WEEKLY_HOURS * 60;

export const OVERTIME_RATES = {
  first_two_hours: 0.25,
  additional_hours: 0.375,
  rest_days: 0.5,
};

export function parseTime(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatMinutesToTime(
  totalMinutes: number | null | undefined
): string {
  if (totalMinutes === null || totalMinutes === undefined) return '--:--';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

interface DailyOvertimeSplit {
  totalMinutes: number;
  overtimeMinutes50: number; // Primeira hora extra do dia útil
  overtimeMinutes75: number; // Segunda hora extra em diante do dia útil
}

export function calculateDailyWorkMinutes(
  record: TimeRecord | null | undefined
): { total: number; overtime: number } {
  if (!record) return { total: 0, overtime: 0 };
  let totalMinutes = 0;

  const t1Entrada = parseTime(record.turno1_entrada);
  const t1Saida = parseTime(record.turno1_saida);
  if (t1Entrada !== null && t1Saida !== null) {
    totalMinutes += Math.max(0, t1Saida - t1Entrada);
  }

  const t2Entrada = parseTime(record.turno2_entrada);
  const t2Saida = parseTime(record.turno2_saida);
  if (t2Entrada !== null && t2Saida !== null) {
    totalMinutes += Math.max(0, t2Saida - t2Entrada);
  }

  return {
    total: totalMinutes,
    overtime: Math.max(0, totalMinutes - DAILY_MINUTES),
  };
}

export interface MonthlyStats {
  totalMinutes: number;
  totalOvertime: number;
  daysWorked: number;
}

export function calculateMonthlyStats(records: TimeRecord[]): MonthlyStats {
  const totalMinutes = records.reduce(
    (sum, r) => sum + (r.total_minutes || 0),
    0
  );
  const totalOvertime = records.reduce(
    (sum, r) => sum + (r.overtime_minutes || 0),
    0
  );
  return {
    totalMinutes,
    totalOvertime,
    daysWorked: records.filter((r) => (r.total_minutes || 0) > 0).length,
  };
}

interface DailyOvertimeSplit {
  totalMinutes: number;
  overtimeMinutes50: number; // Primeira hora extra do dia útil
  overtimeMinutes75: number; // Segunda hora extra em diante do dia útil
}

/**
 * Calcula os minutos de trabalho e divide o overtime seguindo a lei portuguesa
 * para quem já ultrapassou as 100 horas anuais num dia útil.
 */
export function calculateDailyWorkMinutesSplit(
  record: TimeRecord | null | undefined
): DailyOvertimeSplit {
  if (!record) return { totalMinutes: 0, overtimeMinutes50: 0, overtimeMinutes75: 0 };
  
  let totalMinutes = 0;

  const t1Entrada = parseTime(record.turno1_entrada);
  const t1Saida = parseTime(record.turno1_saida);
  if (t1Entrada !== null && t1Saida !== null) {
    totalMinutes += Math.max(0, t1Saida - t1Entrada);
  }

  const t2Entrada = parseTime(record.turno2_entrada);
  const t2Saida = parseTime(record.turno2_saida);
  if (t2Entrada !== null && t2Saida !== null) {
    totalMinutes += Math.max(0, t2Saida - t2Entrada);
  }

  const totalOvertimeMinutes = Math.max(0, totalMinutes - DAILY_MINUTES);

  let overtimeMinutes50 = 0;
  let overtimeMinutes75 = 0;

  if (totalOvertimeMinutes > 0) {
    // 60 minutos equivalem à primeira hora extra efetuada no dia
    if (totalOvertimeMinutes <= 60) {
      overtimeMinutes50 = totalOvertimeMinutes;
    } else {
      overtimeMinutes50 = 60;
      overtimeMinutes75 = totalOvertimeMinutes - 60; // O restante vai para o escalão seguinte
    }
  }

  return {
    totalMinutes,
    overtimeMinutes50,
    overtimeMinutes75,
  };
}

export function calculateSalaryMetrics(baseSalary: number) {
  // Fórmula legal portuguesa (40h semanais: 52 semanas * 40h = 2080h anuais)
  const hourlyRate = (baseSalary * 12) / 2080;
  
  // Subsídios em duodécimos puros (1/12 do salário base)
  const holidayBonus = baseSalary / 12;
  const christmasBonus = baseSalary / 12;

  return {
    // 🛡️ Mantém as 4 casas decimais para evitar desvios cumulativos em multiplicações
    hourlyRate: Number(hourlyRate.toFixed(4)), // Ex: 5.5096 em vez de 5.51
    holidayBonus: Number(holidayBonus.toFixed(2)),
    christmasBonus: Number(christmasBonus.toFixed(2)),
  };
}


// export function calculateSalaryMetrics(baseSalary: number) {
//   // Fórmula legal portuguesa (40h semanais)
//   const hourlyRate = (baseSalary * 12) / 2080;
  
//   // Subsídios em duodécimos (2.5 dias por mês equivalem a 1/12 do salário)
//   const holidayBonus = baseSalary / 12;
//   const christmasBonus = baseSalary / 12;

//   return {
//     hourlyRate: Number(hourlyRate.toFixed(2)),
//     holidayBonus: Number(holidayBonus.toFixed(2)),
//     christmasBonus: Number(christmasBonus.toFixed(2)),
//   };
// }
