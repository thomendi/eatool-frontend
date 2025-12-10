import { eatoolApi } from '@/api/eatoolApi';
import type { ArtefactsResponse } from '@/interfaces/artefacts.response';

export const getArtefactsSubtypeListActions = async (subtype: string): Promise<ArtefactsResponse> => {
    const { data } = await eatoolApi.get<ArtefactsResponse>('/artefacts/subtype/' + subtype + '/');

    console.log("En la actions: ", data);
    return data;
}