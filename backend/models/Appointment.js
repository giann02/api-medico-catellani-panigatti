import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'El nombre del paciente es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  patientLastName: {
    type: String,
    required: [true, 'El apellido del paciente es requerido'],
    trim: true,
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  insuranceProvider: {
    type: String,
    required: [true, 'La obra social es requerida'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida'],
    validate: {
      validator: function(date) {
        // La fecha debe ser al menos mañana
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return date >= tomorrow;
      },
      message: 'La fecha debe ser al menos mañana'
    }
  },
  time: {
    type: String,
    required: [true, 'El horario es requerido'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horario inválido']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ email: 1 });

// Middleware para actualizar updatedAt
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Función helper para convertir fecha string a Date en zona horaria local
const parseLocalDate = (dateString) => {
  // Si la fecha viene como 'YYYY-MM-DD', crear la fecha en zona horaria local
  const [year, month, day] = dateString.split('-').map(Number);
  // month - 1 porque los meses en Date van de 0-11
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

// Método para verificar conflictos de horario
appointmentSchema.statics.checkTimeConflict = async function(date, time, excludeId = null) {
  // Convertir fecha string a Date en zona horaria local
  const appointmentDate = typeof date === 'string' ? parseLocalDate(date) : date;
  
  // Crear rango del día completo (desde inicio hasta fin del día)
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  const query = { 
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    time, 
    status: { $in: ['pending', 'confirmed'] } 
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflict = await this.findOne(query);
  return !!conflict;
};

// Método para obtener horarios disponibles
appointmentSchema.statics.getAvailableTimes = async function(date) {
  const availableSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];
  
  // Convertir fecha string a Date en zona horaria local
  const appointmentDate = typeof date === 'string' ? parseLocalDate(date) : date;
  
  // Crear rango del día completo (desde inicio hasta fin del día)
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  const occupiedTimes = await this.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['pending', 'confirmed'] }
  }).select('time');
  
  const occupiedTimeStrings = occupiedTimes.map(apt => apt.time);
  
  return availableSlots.filter(time => !occupiedTimeStrings.includes(time));
};

export default mongoose.model('Appointment', appointmentSchema);
