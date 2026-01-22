import { eatoolApi } from '@/api/eatoolApi';
import type { Artefact } from '@/interfaces/artefacts.response';

export const getArtefactByNameActions = async (name: string): Promise<Artefact> => {
    const { data } = await eatoolApi.get<Artefact>(`/artefacts/by_name/${name}/`);
    return data;
}
