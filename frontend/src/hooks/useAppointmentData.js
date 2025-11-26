import { useState, useEffect } from 'react';
import apiService from '../services/api.js';

// Hook personalizado para manejar datos de citas
export const useAppointmentData = () => {
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar obras sociales
  const loadInsuranceProviders = async () => {
    try {
      const response = await apiService.getInsuranceProviders();
      if (response.success) {
        setInsuranceProviders(response.data);
      }
    } catch (err) {
      console.error('Error cargando obras sociales:', err);
      setError('Error cargando obras sociales');
    }
  };


  // Cargar horarios disponibles para una fecha específica
  const getAvailableTimesForDate = async (date) => {
    try {
      const dateStr = date.format('YYYY-MM-DD');
      const response = await apiService.getAvailableTimes(dateStr);
      if (response.success) {
        return response.data.availableTimes;
      }
      return [];
    } catch (err) {
      console.error('Error cargando horarios disponibles:', err);
      return [];
    }
  };


  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await loadInsuranceProviders();
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    insuranceProviders,
    loading,
    error,
    getAvailableTimesForDate,
    refreshData: () => {
      loadInsuranceProviders();
    }
  };
};
