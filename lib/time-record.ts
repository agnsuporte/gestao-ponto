import { calculateDailyWorkMinutes } from '@/lib/WorkHoursUtils';
import { TimeRecord } from '@/types/timeRecord';

type MutableTimeRecordField =
  | 'date'
  | 'turno1_entrada'
  | 'turno1_saida'
  | 'almoco_entrada'
  | 'almoco_saida'
  | 'turno2_entrada'
  | 'turno2_saida';

export type TimeRecordMutationInput = Partial<
  Pick<
    TimeRecord,
    | 'date'
    | 'turno1_entrada'
    | 'turno1_saida'
    | 'almoco_entrada'
    | 'almoco_saida'
    | 'turno2_entrada'
    | 'turno2_saida'
  >
>;

type TimeRecordCalculationInput = Partial<
  Pick<
    TimeRecord,
    | 'date'
    | 'turno1_entrada'
    | 'turno1_saida'
    | 'almoco_entrada'
    | 'almoco_saida'
    | 'turno2_entrada'
    | 'turno2_saida'
  >
>;

const MUTABLE_FIELDS: MutableTimeRecordField[] = [
  'date',
  'turno1_entrada',
  'turno1_saida',
  'almoco_entrada',
  'almoco_saida',
  'turno2_entrada',
  'turno2_saida',
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export function parseTimeRecordInput(payload: unknown): TimeRecordMutationInput {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const input = payload as Record<string, unknown>;
  const parsed: TimeRecordMutationInput = {};

  for (const field of MUTABLE_FIELDS) {
    const value = input[field];

    if (value === undefined) {
      continue;
    }

    if (value === null && field !== 'date') {
      parsed[field] = undefined;
      continue;
    }

    if (typeof value !== 'string') {
      continue;
    }

    const normalizedValue = value.trim();

    if (!normalizedValue && field !== 'date') {
      parsed[field] = undefined;
      continue;
    }

    if (field === 'date') {
      if (DATE_PATTERN.test(normalizedValue)) {
        parsed.date = normalizedValue;
      }
      continue;
    }

    if (TIME_PATTERN.test(normalizedValue)) {
      parsed[field] = normalizedValue;
    }
  }

  return parsed;
}

export function withCalculatedTotals(record: TimeRecordCalculationInput): Pick<TimeRecord, 'total_minutes' | 'overtime_minutes'> {
  const totals = calculateDailyWorkMinutes(record as TimeRecord);

  return {
    total_minutes: totals.total,
    overtime_minutes: totals.overtime,
  };
}

export function getMonthDateRange(year: number, month: number): { startDate: string; endDate: string } | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12 || year < 2020) {
    return null;
  }

  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthText = String(month).padStart(2, '0');

  return {
    startDate: `${year}-${monthText}-01`,
    endDate: `${year}-${monthText}-${String(lastDay).padStart(2, '0')}`,
  };
}
