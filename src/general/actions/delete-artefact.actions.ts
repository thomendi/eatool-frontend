import { eatoolApi } from '@/api/eatoolApi';

export const deleteArtefactActions = async (id: string) => {
    try {
        const response = await eatoolApi.delete(`/artefacts/artefact/${id}/`);
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
