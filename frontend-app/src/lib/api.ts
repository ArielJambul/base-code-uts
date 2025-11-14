import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userApi = {
  getUsers: () => apiClient.get('/api/users'),
  getUser: (id: string) => apiClient.get(`/api/users/${id}`),
  // Modifikasi tipe data untuk createUser
  createUser: (userData: { name: string; email: string; password: string }) => 
    apiClient.post('/api/users', userData),
  // Modifikasi tipe data untuk updateUser
  updateUser: (id: string, userData: { name?: string; email?: string; role?: string }) => 
    apiClient.put(`/api/users/${id}`, userData),
  deleteUser: (id: string) => apiClient.delete(`/api/users/${id}`),
};

// API untuk Autentikasi
export const authApi = {
  // Hapus register, karena sudah ditangani userApi.createUser
  
  // Ubah endpoint login dan tipe datanya
  login: (credentials: { name: string, password: string }) => 
    apiClient.post('/api/users/login', credentials), // UBAH ENDPOINT
};