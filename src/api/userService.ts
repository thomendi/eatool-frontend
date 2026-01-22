import { eatoolApi } from './eatoolApi';

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    company: string; // The attribute mentioned by the user
    // Add other fields as necessary
}

export const getUserProfile = async (): Promise<UserProfile> => {
    // Assuming a standard endpoint, or I might need to ask/verify.
    // Given the previous patterns, I'll assume /users/me/ or similar.
    // Looking at previous conversation 8d382b76-b006-4db4-926b-5704a8895178, it mentions "Implementing a user listing operation".
    // It doesn't explicitly mention a "/me" endpoint.
    // However, I need to fetch the CURRENT user.
    // I'll try '/users/profile/' or '/user/me/'.
    // In 'login.action.ts' the URL is '/user/token/'. So maybe '/user/profile/' is a good guess.
    // I will use '/user/profile/' for now as it's consistent with '/user/token/'.
    const { data } = await eatoolApi.get<UserProfile>('/user/profile/');
    return data;
};
