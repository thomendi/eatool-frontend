// src/api/riskService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/risks/';

/* ======================
   TYPE
====================== */
export interface Risk {
  id: number;
  name: string;
  category: string;
  type: string;
  impact: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  probability: 'Baja' | 'Media' | 'Alta';
  level: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  description: string;
}

/* ======================
   SERVICE
====================== */
export const riskService = {
  getAll: async (): Promise<Risk[]> => {
    const res = await axios.get<Risk[]>(API_URL);
    return res.data;
  },

  create: async (data: Omit<Risk, 'id'>): Promise<Risk> => {
    const res = await axios.post<Risk>(API_URL, data);
    return res.data;
  },

  getById: async (id: number): Promise<Risk> => {
    const res = await axios.get<Risk>(`${API_URL}${id}/`);
    return res.data;
  },

  update: async (id: number, data: Omit<Risk, 'id'>): Promise<Risk> => {
    const res = await axios.put<Risk>(`${API_URL}${id}/`, data);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}/`);
  },
};
