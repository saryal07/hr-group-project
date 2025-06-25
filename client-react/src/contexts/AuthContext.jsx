import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    }, []);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);