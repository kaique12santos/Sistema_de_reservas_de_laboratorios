import { createContext, useState, useContext } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const data = await AuthService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (data) => {
    return await AuthService.register(data);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
