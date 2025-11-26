import { eatoolApi } from '@/api/eatoolApi';
import type { ArtefactsResponse } from '@/interfaces/artefacts.response';

export const getArtefactsActions = async():Promise<ArtefactsResponse> => {
    const{ data } = await eatoolApi.get<ArtefactsResponse>('/artefacts/list/');

  //  console.log(data);
    return data;
}
