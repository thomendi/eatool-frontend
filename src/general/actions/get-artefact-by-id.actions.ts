import { eatoolApi } from '@/api/eatoolApi';
import type { Artefact } from '@/interfaces/artefacts.response';

export const getArtefactByIdActions = async (id: string): Promise<Artefact> => {
    const { data } = await eatoolApi.get<Artefact>(`/artefacts/artefact/${id}/`);
    // console.log("Artefact fetched:", data);
    return data;
}
