import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProfile } from './userService';
import { eatoolApi } from './eatoolApi';

vi.mock('./eatoolApi', () => ({
    eatoolApi: {
        get: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch user profile successfully', async () => {
        const mockProfile = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'admin',
            company: 'Acme Corp'
        };

        (eatoolApi.get as any).mockResolvedValue({ data: mockProfile });

        const result = await getUserProfile();

        expect(eatoolApi.get).toHaveBeenCalledWith('/user/profile/');
        expect(result).toEqual(mockProfile);
    });

    it('should handle errors when fetching profile fails', async () => {
        (eatoolApi.get as any).mockRejectedValue(new Error('Network error'));

        await expect(getUserProfile()).rejects.toThrow('Network error');
    });
});
