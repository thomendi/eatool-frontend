import { eatoolApi } from './eatoolApi';

export interface Company {
    id: number;
    name: string;
    address: string;
    contact: string;
    telephone: string;
    email: string;
}

export const getCompanies = async (token?: string): Promise<Company[]> => {
    const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
    const { data } = await eatoolApi.get<Company[]>('/companies/companies/', config);
    return data;
};
