import { TimeRecord } from '@/types/timeRecord';

export const DAILY_HOURS = 8;
export const DAILY_MINUTES = DAILY_HOURS * 60;
export const WEEKLY_HOURS = 40;
export const WEEKLY_MINUTES = WEEKLY_HOURS * 60;

export const OVERTIME_RATES = {
  first_two_hours: 0.25,
  additional_hours: 0.375,
  rest_days: 0.50,
};

export function parseTime(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number | null | undefined): string {
  if (totalMinutes === null || totalMinutes === undefined) return '--:--';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function calculateDailyWorkMinutes(record: TimeRecord | null | undefined): { total: number; overtime: number } {
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
  const totalMinutes = records.reduce((sum, r) => sum + (r.total_minutes || 0), 0);
  const totalOvertime = records.reduce((sum, r) => sum + (r.overtime_minutes || 0), 0);
  return {
    totalMinutes,
    totalOvertime,
    daysWorked: records.filter(r => (r.total_minutes || 0) > 0).length,
  };
}