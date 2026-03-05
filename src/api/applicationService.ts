import { eatoolApi } from "@/api/eatoolApi"; // Ajusta la ruta si tu archivo está en src/api/

export interface Application {
  id?: number;
  idart?: string;
  name: string;
  version: string;
  developer: string;
  status: "active" | "maintenance" | "deprecated";
  activeUsers: number;
  // New fields
  description?: string;
  os?: string;
  language?: string;
  framework?: string;
  security?: string;
  type?: string;
  priority?: string;
  lastUpdated?: string;
}

// Obtener todas las aplicaciones
export const getApplications = async () => {
  const res = await eatoolApi.get("/applications/application/");
  return res.data;
};

// Crear una aplicación
export const createApplication = async (data: Omit<Application, "id">) => {
  const res = await eatoolApi.post("/applications/application/", data);
  return res.data;
};

// Actualizar aplicación
export const updateApplication = async (id: number, data: Partial<Application>) => {
  const res = await eatoolApi.put(`/applications/application/${id}/`, data);
  return res.data;
};

// Eliminar aplicación
export const deleteApplication = async (id: number) => {
  const res = await eatoolApi.delete(`/applications/application/${id}/`);
  return res.data;
};
