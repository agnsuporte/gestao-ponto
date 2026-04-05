
import { TimeRecord } from '@/types/timeRecord';

const API_URL = '/api/time-record';

export const api = {
  // auth: {
  //   me: async (): Promise<{ email: string }> => {
  //     // TODO: Implementar autenticação real (NextAuth, etc.)
  //     return { email: 'user@example.com' };
  //   }
  // },
  timeRecords: {
    filter: async (query: Partial<TimeRecord>): Promise<TimeRecord[]> => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      const res = await fetch(`${API_URL}?${params}`);
      if (!res.ok) throw new Error('Erro ao buscar registos');
      return res.json();
    },

    list: async (_sort: string, limit: number, month?: number, year?: number): Promise<TimeRecord[]> => {
      // Construindo a URL com os filtros
      let url = `${API_URL}?limit=${limit}`;
      
      if (month) url += `&month=${month}`;
      if (year) url += `&year=${year}`;
      
      // const res = await fetch(`${API_URL}?limit=${limit}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao listar registos');
      return res.json();
    },

    create: async (data: Partial<TimeRecord>): Promise<TimeRecord> => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar registo');
      return res.json();
    },

    update: async (id: string, data: Partial<TimeRecord>): Promise<TimeRecord> => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar registo');
      return res.json();
    },
  }
};