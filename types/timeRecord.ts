export interface TimeRecord {
  id?: string;
  date: string;
  turno1_entrada?: string | null;
  turno1_saida?: string | null;
  almoco_entrada?: string | null;
  almoco_saida?: string | null;
  turno2_entrada?: string | null;
  turno2_saida?: string | null;
  total_minutes?: number;
  overtime_minutes?: number;
  created_by?: string;
  created_date?: string;
  updated_date?: string;
}

export type TimeRecordField = 
  | 'turno1_entrada' 
  | 'turno1_saida' 
  | 'almoco_entrada' 
  | 'almoco_saida' 
  | 'turno2_entrada' 
  | 'turno2_saida';
