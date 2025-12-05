import { eatoolApi } from '@/api/eatoolApi';
import type { ArtefactRequest } from '@/interfaces/artefact.request';

export const putArtefactActions = async (id: string, data: ArtefactRequest) => {
    try {
        const response = await eatoolApi.put(`/artefacts/artefact/${id}/`, data);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data?.message || "Error en el servidor");
        }
        console.error("Request Error:", error.message);
        throw new Error("No se pudo conectar con el servicio");
    }
};
