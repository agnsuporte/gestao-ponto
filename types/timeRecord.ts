export interface TimeRecord {
  id?: string;
  date: string;
  turno1_entrada?: string;
  turno1_saida?: string;
  almoco_entrada?: string;
  almoco_saida?: string;
  turno2_entrada?: string;
  turno2_saida?: string;
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
