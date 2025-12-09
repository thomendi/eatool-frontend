import axios from 'axios'
import type { DiagramModel } from '../interfaces/diagram'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_TOKEN;

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});
export const insertDiagram = async (payload: DiagramModel) => {
  const res = await api.post('/diagrams/diagram/', payload)
  return res.data
}

export const updateDiagram = async (id: number, payload: DiagramModel) => {
  const res = await api.put(`/diagrams/diagram/${id}/`, payload)
  return res.data
}

export const getDiagramByIdart = async (idart: string) => {
  const res = await api.get<DiagramModel[]>(`/diagrams/artefact/${encodeURIComponent(idart)}/`);
  return res.data
}

export const listDiagrams = async () => {
  const res = await api.get<DiagramModel[]>('/diagrams/diagram')
  return res.data
}