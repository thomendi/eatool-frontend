import { eatoolApi } from '@/api/eatoolApi';
import type { DiagramsResponse } from '@/interfaces/diagrams.response';


export const getDiagramsActions = async(idart?:string):Promise<DiagramsResponse> => {
    const{ data } = await eatoolApi.get<DiagramsResponse>('diagrams/artefact/'+idart);
    return data;
}