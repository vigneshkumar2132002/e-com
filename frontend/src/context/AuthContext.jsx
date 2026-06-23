'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('bapuji_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setUser(data);
      localStorage.setItem('bapuji_user', JSON.stringify(data));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const registerB2C = async (userData) => {
    try {
      const res = await fetch('/api/users/register/b2c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setUser(data);
      localStorage.setItem('bapuji_user', JSON.stringify(data));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const registerB2B = async (formData) => {
    try {
      // formData is a Multipart form submission containing 'document' file
      const res = await fetch('/api/users/register/b2b', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'B2B Registration failed');
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bapuji_user');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      
      setUser(data);
      localStorage.setItem('bapuji_user', JSON.stringify(data));
      return data;
    } catch (err) {
      throw err;
    }
  };

  console.log('AuthProvider is rendering. Context value is defined.');
  return (
    <AuthContext.Provider value={{ user, loading, login, registerB2C, registerB2B, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || { 
    user: null, 
    loading: true, 
    login: async () => {}, 
    registerB2C: async () => {}, 
    registerB2B: async () => {}, 
    logout: () => {}, 
    updateProfile: async () => {} 
  };
};
