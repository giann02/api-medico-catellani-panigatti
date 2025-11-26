// Servicio para comunicación con el backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Agregar token de autenticación si existe
    const token = this.getToken();
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('Error en API request:', error);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      this.setUserInfo(response.data.user);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async verifyToken() {
    try {
      const response = await this.request('/auth/verify');
      return response.success;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  // Métodos para citas médicas
  async createAppointment(appointmentData) {
    return await this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getAppointments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/appointments?${queryString}` : '/appointments';
    return await this.request(endpoint);
  }

  async getAppointmentById(id) {
    return await this.request(`/appointments/${id}`);
  }

  async updateAppointmentStatus(id, status) {
    return await this.request(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteAppointment(id) {
    return await this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  async getAvailableTimes(date) {
    return await this.request(`/appointments/available/times?date=${date}`);
  }

  async getAvailableDates() {
    return await this.request('/appointments/available/dates');
  }

  async getAppointmentStats() {
    return await this.request('/appointments/stats');
  }

  // Métodos para obras sociales
  async getInsuranceProviders() {
    return await this.request('/insurance');
  }

  async getInsuranceProviderById(id) {
    return await this.request(`/insurance/${id}`);
  }

  async createInsuranceProvider(providerData) {
    return await this.request('/insurance', {
      method: 'POST',
      body: JSON.stringify(providerData),
    });
  }

  async updateInsuranceProvider(id, providerData) {
    return await this.request(`/insurance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(providerData),
    });
  }

  async deleteInsuranceProvider(id) {
    return await this.request(`/insurance/${id}`, {
      method: 'DELETE',
    });
  }


  async getInsuranceProviderStats() {
    return await this.request('/insurance/stats');
  }

  // Métodos para manejo de tokens y autenticación
  getToken() {
    return sessionStorage.getItem('authToken');
  }

  setToken(token) {
    sessionStorage.setItem('authToken', token);
  }

  getUserInfo() {
    const userInfo = sessionStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  setUserInfo(userInfo) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  clearAuthData() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userInfo');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }
}

// Crear instancia única del servicio
const apiService = new ApiService();

export default apiService;
