// Utilidades de autenticación
import apiService from '../services/api.js';

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si está autenticado
 */
export const isAuthenticated = () => {
  return apiService.isAuthenticated();
};

/**
 * Obtiene la información del usuario autenticado
 * @returns {object|null} Información del usuario o null si no está autenticado
 */
export const getUserInfo = () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  return apiService.getUserInfo();
};

/**
 * Limpia todos los datos de autenticación
 */
export const clearAuthData = () => {
  apiService.clearAuthData();
};

/**
 * Realiza login con el backend
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<object>} Respuesta del servidor
 */
export const login = async (username, password) => {
  try {
    const response = await apiService.login(username, password);
    
    if (response.success) {
      // El token y userInfo ya se guardan en apiService.login()
      // No necesitamos campos adicionales redundantes
    }
    
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Realiza logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiService.logout();
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    clearAuthData();
  }
};

/**
 * Verifica si el token es válido
 * @returns {Promise<boolean>} true si el token es válido
 */
export const verifyToken = async () => {
  try {
    return await apiService.verifyToken();
  } catch (error) {
    console.error('Error verificando token:', error);
    return false;
  }
};
