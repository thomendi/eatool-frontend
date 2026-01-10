import { eatoolApi } from '@/api/eatoolApi';

export interface LoginResponse {
    token: string;
    role: string;
    email: string;
}

export const loginAction = async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await eatoolApi.post<LoginResponse>('/user/token/', { email, password });
    return data;
};
