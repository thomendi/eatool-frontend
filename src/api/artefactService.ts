import { eatoolApi } from './eatoolApi';

export interface LinkedTaskPayload {
    name: string;
    description: string;
    type: string; // This will likely come from the BPMN element type (e.g., bpmn:Task)
    level: number;
    subtype: string;
    alias: string;
    category: string;
    subcategory: string;
    version: string;
    company: string;
    owner: string;
    state: string;
    objetive: string;
    range: string;
    idart: string; // The ID of the process being edited
}

export const createLinkedTask = async (data: LinkedTaskPayload) => {
    const response = await eatoolApi.post('/artefacts/create_linked_task/', data);
    return response.data;
};

export interface LinkedArtefactsResponse {
    count: number;
    artefacts: Array<{
        id: string;
        name: string;
        description: string;
        type: string;
        owner: string;
        // Add other fields if needed for future use
    }>;
}

export const getLinkedArtefacts = async (idart: string) => {
    const response = await eatoolApi.get<LinkedArtefactsResponse>(`/artefacts/linked/${idart}/`);
    return response.data;
};
