import { eatoolApi } from '@/api/eatoolApi';

export const patchDiagramActions = async (id: number, diagram: string) => {
    try {
        const response = await eatoolApi.patch(`/diagrams/diagram/${id}/`, { diagram });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data?.message || "Error al actualizar el diagrama");
        }
        console.error("Request Error:", error.message);
        throw new Error("No se pudo conectar con el servicio");
    }
};
