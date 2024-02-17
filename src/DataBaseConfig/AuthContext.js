import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8083";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken') || null);
  const isAuthenticated = !!authToken;
  const [sessionTimeout, setSessionTimeout] = useState(0);

  const login = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/login_user`, { values });

      const Timing = response.data.sessionTimeout;
      setSessionTimeout(Timing);

      const token = response.data.token;
      setAuthToken(token);

      
      const email = response.data.email;
      const name = response.data.name;

      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('name', name);

      localStorage.setItem('sessionTimeout', Timing);
    } catch (error) {
      throw error; 
    }
  };

  const register = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/reg_user`, { values });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };

  const logout = () => {
    setAuthToken(null);
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('sessionTimeout');
  };

  useEffect(() => {
    const storedSessionTimeout = localStorage.getItem('sessionTimeout');
    if (storedSessionTimeout) {
      setSessionTimeout(parseInt(storedSessionTimeout));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && sessionTimeout > 0) {
      const timeout = setTimeout(() => {
        logout();
      }, sessionTimeout * 1000); // Convert sessionTimeout to milliseconds
      return () => clearTimeout(timeout);
    }
  }, [authToken, isAuthenticated, sessionTimeout]);

  return (
    <AuthContext.Provider value={{ authToken, login, logout,register, isAuthenticated, }}>
      {children}
    </AuthContext.Provider>
  );
};
