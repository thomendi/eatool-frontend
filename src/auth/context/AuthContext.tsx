import { createContext, useState, useEffect, ReactNode } from 'react';
import { loginAction } from '../actions/login.action';

interface AuthState {
    token: string | null;
    role: string | null;
    email: string | null;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthState>({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        email: localStorage.getItem('email'),
        isAuthenticated: !!localStorage.getItem('token'),
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const resp = await loginAction(email, password);

            // Save to Storage
            localStorage.setItem('token', resp.token);
            localStorage.setItem('role', resp.role);
            localStorage.setItem('email', resp.email);

            // Update State
            setUser({
                token: resp.token,
                role: resp.role,
                email: resp.email,
                isAuthenticated: true,
            });

        } catch (error) {
            console.error("Login failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setUser({
            token: null,
            role: null,
            email: null,
            isAuthenticated: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
