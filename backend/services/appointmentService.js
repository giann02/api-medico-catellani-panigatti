import Appointment from '../models/Appointment.js';
import InsuranceProvider from '../models/InsuranceProvider.js';
import emailService from './emailService.js';

class AppointmentService {
  // Crear nueva cita
  async createAppointment(appointmentData) {
    const { patientName, patientLastName, phone, email, insuranceProvider, date, time, notes } = appointmentData;

    // Verificar que la obra social existe
    const insurance = await InsuranceProvider.findOne({ 
      name: insuranceProvider
    });

    if (!insurance) {
      throw new Error('La obra social seleccionada no está disponible');
    }

    // Verificar conflicto de horario
    const hasConflict = await Appointment.checkTimeConflict(date, time);
    if (hasConflict) {
      throw new Error('El horario seleccionado ya está ocupado');
    }

    // Crear la cita
    const appointment = new Appointment({
      patientName,
      patientLastName,
      phone,
      email,
      insuranceProvider,
      date: new Date(date),
      time,
      notes,
      status: 'pending'
    });

    await appointment.save();

    // Enviar email de confirmación
    try {
      await emailService.sendAppointmentConfirmation(appointment);
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar la creación de la cita si el email falla
    }

    return appointment;
  }

  // Obtener todas las citas con filtros
  async getAllAppointments(filters = {}, pagination = {}) {
    const { status, date, startDate, endDate } = filters;
    const { page = 1, limit = 50 } = pagination;
    
    // Construir filtros de consulta
    const queryFilters = {};
    
    if (status) {
      queryFilters.status = status;
    }
    
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      queryFilters.date = {
        $gte: targetDate,
        $lt: nextDay
      };
    }
    
    if (startDate && endDate) {
      queryFilters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Obtener citas con paginación
    const appointments = await Appointment.find(queryFilters)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total de citas
    const total = await Appointment.countDocuments(queryFilters);

    return {
      appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  // Obtener cita por ID
  async getAppointmentById(id) {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    return appointment;
  }

  // Actualizar estado de cita
  async updateAppointmentStatus(id, status) {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    const oldStatus = appointment.status;
    appointment.status = status;
    await appointment.save();

    // Enviar emails según el cambio de estado
    try {
      if (status === 'confirmed' && oldStatus === 'pending') {
        // Cita confirmada - enviar email de confirmación
        await emailService.sendAppointmentConfirmed(appointment);
        
        // Cancelar automáticamente otras citas con el mismo horario
        await Appointment.updateMany(
          {
            _id: { $ne: id },
            date: appointment.date,
            time: appointment.time,
            status: { $in: ['pending', 'confirmed'] }
          },
          { status: 'cancelled' }
        );
      } else if (status === 'cancelled' && oldStatus !== 'cancelled') {
        // Cita cancelada - enviar email de cancelación
        await emailService.sendAppointmentCancelled(appointment);
      }
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar la actualización si el email falla
    }

    return appointment;
  }

  // Eliminar cita
  async deleteAppointment(id) {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    await Appointment.findByIdAndDelete(id);
    return { message: 'Cita eliminada exitosamente' };
  }

  // Obtener horarios disponibles para una fecha
  async getAvailableTimes(date) {
    const targetDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      throw new Error('No se pueden consultar fechas pasadas');
    }

    // Verificar que no sea fin de semana
    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      throw new Error('No hay citas disponibles los fines de semana');
    }

    const availableTimes = await Appointment.getAvailableTimes(date);

    return {
      date: date,
      availableTimes: availableTimes
    };
  }

  // Obtener fechas disponibles en las próximas 2 semanas
  async getAvailableDates() {
    const today = new Date();
    const twoWeeksFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    
    const availableDates = [];
    const currentDate = new Date(today);
    
    while (currentDate <= twoWeeksFromNow) {
      // Solo días laborables (lunes a viernes)
      const localDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      if (localDate.getDay() >= 1 && localDate.getDay() <= 5) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const availableTimes = await Appointment.getAvailableTimes(dateStr);
        
        // Incluir todas las fechas laborables, incluso si no tienen horarios disponibles
        availableDates.push({
          date: dateStr,
          availableTimes: availableTimes,
          hasAvailableSlots: availableTimes.length > 0
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availableDates;
  }

  // Obtener estadísticas de citas
  async getAppointmentStats() {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAppointments = await Appointment.countDocuments();
    
    const formattedStats = {
      total: totalAppointments,
      pending: 0,
      confirmed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    return formattedStats;
  }

  // Verificar disponibilidad de horario
  async checkTimeAvailability(date, time, excludeId = null) {
    return await Appointment.checkTimeConflict(date, time, excludeId);
  }

  // Obtener citas por rango de fechas
  async getAppointmentsByDateRange(startDate, endDate) {
    return await Appointment.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1, time: 1 });
  }

  // Obtener citas por paciente
  async getAppointmentsByPatient(email) {
    return await Appointment.find({ email }).sort({ date: -1 });
  }
}

export default new AppointmentService();
