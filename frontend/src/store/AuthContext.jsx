import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/user');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const register = async (name, email, phone, password) => {
    setLoading(true);
    try {
      const response = await api.post('/register', { name, email, phone, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Ignore if logout fails on server
    }
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const sendOtp = async (phone) => {
    setLoading(true);
    try {
      const response = await api.post('/otp/send', { phone });
      return { 
        success: true, 
        otp: response.data.otp, 
        twilio_configured: response.data.twilio_configured,
        sms_sent: response.data.sms_sent 
      };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (phone, otp) => {
    setLoading(true);
    try {
      const response = await api.post('/otp/login', { phone, otp });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Invalid OTP' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credentialOrEmail, name, googleId, avatar) => {
    setLoading(true);
    try {
      const payload = typeof credentialOrEmail === 'string' && !name
        ? { credential: credentialOrEmail }
        : { email: credentialOrEmail, name, google_id: googleId, avatar };

      const response = await api.post('/auth/google', payload);
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Google authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, email) => {
    try {
      const response = await api.put('/user/profile', { name, email });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, register, loginWithEmail, logout, updateProfile, sendOtp, loginWithOtp, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
