import { eatoolApi } from '@/api/eatoolApi';

export const patchDiagramActions = async (id: string, xml: string) => {
    const { data } = await eatoolApi.patch(`/diagrams/diagram/${id}/`, {
        diagram: xml
    });
    return data;
};
