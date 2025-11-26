export interface ArtefactsResponse {
   count: number;
   artefacts: Artefact[];
}

export interface Artefact{
    id:          string;
    name:        string;
    description: string;
    type:        string;
    level:       number;
    subtype:     string;
    alias:       string;
    category:    string;
    subcategory: string;
    version:     string;
    company:     string;
    owner:       string;
    state:       string;
    objetive:    string;
    range:       string;
}
