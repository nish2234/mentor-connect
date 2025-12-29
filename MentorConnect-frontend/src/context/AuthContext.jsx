import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
        return response;
    };

    const register = async (userData) => {
        const response = await authAPI.register(userData);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isMentor: user?.role === 'MENTOR',
        isMentee: user?.role === 'MENTEE',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
