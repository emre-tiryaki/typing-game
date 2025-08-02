import axios from 'axios';

// Backend URL (örnek)
const BASE_URL = 'http://localhost:5000/api/auth';

// Giriş yapma fonksiyonu
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data; // Başarılı yanıt
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Giriş başarısız!' };
  }
};

// Kayıt olma fonksiyonu
export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
    return response.data; // Başarılı yanıt
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Kayıt başarısız!' };
  }
};

// Şifre sıfırlama kodu gönderme fonksiyonu
export const sendResetCode = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data; // Başarılı yanıt
  } catch (error) {
    console.error('Send reset code error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Kod gönderimi başarısız!' };
  }
};

// Şifre sıfırlama fonksiyonu
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password`, {
      email,
      code,
      newPassword,
    });
    return response.data; // Başarılı yanıt
  } catch (error) {
    console.error('Reset password error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Şifre sıfırlama başarısız!' };
  }
};