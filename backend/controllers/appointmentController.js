import appointmentService from '../services/appointmentService.js';

// Crear nueva cita
export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: {
        id: appointment._id,
        patientName: appointment.patientName,
        patientLastName: appointment.patientLastName,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Error creando cita:', error);
    
    if (error.message.includes('obra social') || error.message.includes('horario')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las citas (solo para administradores)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, date, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    const filters = { status, date, startDate, endDate };
    const pagination = { page, limit };

    const result = await appointmentService.getAllAppointments(filters, pagination);

    res.json({
      success: true,
      data: result.appointments,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener cita por ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error obteniendo cita:', error);
    
    if (error.message === 'Cita no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar estado de cita
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    const appointment = await appointmentService.updateAppointmentStatus(appointmentId, status);

    let message = '';
    switch (status) {
      case 'confirmed':
        message = 'Cita confirmada exitosamente';
        break;
      case 'pending':
        message = 'Cita marcada como pendiente exitosamente';
        break;
      case 'cancelled':
        message = 'Cita cancelada exitosamente';
        break;
      default:
        message = 'Estado de cita actualizado exitosamente';
    }

    res.json({
      success: true,
      message: message,
      data: appointment
    });

  } catch (error) {
    console.error('Error actualizando cita:', error);
    
    if (error.message === 'Cita no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar cita
export const deleteAppointment = async (req, res) => {
  try {
    const result = await appointmentService.deleteAppointment(req.params.id);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error eliminando cita:', error);
    
    if (error.message === 'Cita no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener horarios disponibles para una fecha
export const getAvailableTimes = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    const result = await appointmentService.getAvailableTimes(date);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error obteniendo horarios disponibles:', error);
    
    if (error.message.includes('fechas pasadas') || error.message.includes('fines de semana')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener fechas disponibles en las próximas 2 semanas
export const getAvailableDates = async (req, res) => {
  try {
    const availableDates = await appointmentService.getAvailableDates();
    
    res.json({
      success: true,
      data: availableDates
    });

  } catch (error) {
    console.error('Error obteniendo fechas disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de citas
export const getAppointmentStats = async (req, res) => {
  try {
    const stats = await appointmentService.getAppointmentStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};