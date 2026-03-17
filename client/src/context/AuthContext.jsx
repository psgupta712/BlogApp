// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// 3. Provider component — wraps the whole app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Check for saved token on startup

  // On app load, check if user has a saved token
  useEffect(() => {
    const savedUser = localStorage.getItem('blogUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      // Set Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  // Register
  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('blogUser', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  // Login
  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('blogUser', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('blogUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user info in context (e.g. after profile edit)
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('blogUser', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook — use this anywhere instead of useContext(AuthContext)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
