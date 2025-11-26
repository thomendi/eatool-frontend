import { eatoolApi } from '@/api/eatoolApi';
import type { ArtefactRequest} from '@/interfaces/artefact.request';

export const postArtefactActions = async (data: ArtefactRequest) => {
  try {
    const response = await eatoolApi.post("/artefacts/artefact/", data);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    // Si el servidor devuelve un error estructurado
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data?.message || "Error en el servidor");
    }

    // Error de red u otro
    console.error("Request Error:", error.message);
    throw new Error("No se pudo conectar con el servicio");
  }
};
