// src/api/roleService.ts
import { eatoolApi } from "@/api/eatoolApi"; // ajusta la ruta si es distinto

export interface Role {
  id: number;
  owners: string[];
  category: string;
  subcategory?: string;
  duties: string[];
  description?: string;
  created_at?: string;
  lastUpdated?: string;
}

const API_URL = "/roles/role/";

export const getRoles = async (): Promise<Role[]> => {
  const res = await eatoolApi.get(API_URL);
  return res.data;
};

export const createRole = async (payload: Omit<Role, "id" | "created_at" | "lastUpdated">) => {
  const res = await eatoolApi.post(API_URL, payload);
  return res.data;
};

export const updateRole = async (id: number | string, payload: Partial<Role>) => {
  const res = await eatoolApi.put(`${API_URL}${id}/`, payload);
  return res.data;
};

export const deleteRole = async (id: number | string) => {
  const res = await eatoolApi.delete(`${API_URL}${id}/`);
  return res.data;
};
