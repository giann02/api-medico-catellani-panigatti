// Datos estáticos para simular un backend
export const mockData = {
  // Información del médico (hardcodeada - misma que en el backend)
  doctor: {
    name: "Dra. María Pérez",
    specialty: "Dermatología",
    title: "Médica Dermatóloga",
    education: [
      "Médica egresada de la Universidad de Buenos Aires",
      "Especialista en Dermatología - Hospital de Clínicas",
      "Miembro de la Sociedad Argentina de Dermatología"
    ],
    services: [
      "Consulta dermatológica general",
      "Dermatoscopía digital",
      "Cirugía dermatológica menor",
      "Tratamiento de acné"
    ],
    contact: {
      phone: "+54 11 4567-8900",
      email: "info@dcperez.com",
      address: "Corrientes 1010",
      schedule: "Lunes a Viernes: 9:00 - 18:00"
    }
  },

  // Obras sociales con convenio
  insuranceProviders: [
    { id: 1, name: "OSDE", code: "OSDE" },
    { id: 2, name: "Swiss Medical", code: "SWISS" },
    { id: 3, name: "Galeno", code: "GALENO" },
    { id: 4, name: "Medicus", code: "MEDICUS" },
    { id: 5, name: "Hospital Italiano", code: "HIBA" },
    { id: 6, name: "PAMI", code: "PAMI" },
    { id: 7, name: "IOMA", code: "IOMA" },
    { id: 8, name: "Particular", code: "PARTICULAR" }
  ],

  // Citas existentes
  appointments: [
    {
      id: 1,
      patientName: "Juan Pérez",
      patientLastName: "García",
      phone: "+54 11 1234-5678",
      email: "juan.perez@email.com",
      insuranceProvider: "OSDE",
      date: "2025-10-15",
      time: "10:00",
      status: "confirmed",
      notes: "Dermatitis"
    },
    {
      id: 2,
      patientName: "María",
      patientLastName: "López",
      phone: "+54 11 2345-6789",
      email: "maria.lopez@email.com",
      insuranceProvider: "Swiss Medical",
      date: "2025-10-15",
      time: "11:30",
      status: "pending",
      notes: "Control de lunares"
    },
    {
      id: 3,
      patientName: "Carlos",
      patientLastName: "Martínez",
      phone: "+54 11 3456-7890",
      email: "carlos.martinez@email.com",
      insuranceProvider: "Galeno",
      date: "2025-10-15",
      time: "09:00",
      status: "confirmed",
      notes: "Tratamiento de acné"
    },
    {
      id: 4,
      patientName: "Ana",
      patientLastName: "Rodríguez",
      phone: "+54 11 4567-8901",
      email: "ana.rodriguez@email.com",
      insuranceProvider: "Medicus",
      date: "2025-10-16",
      time: "14:00",
      status: "cancelled",
      notes: "Consulta inicial"
    }
  ],

  // Horarios disponibles (simulando disponibilidad)
  availableSlots: [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ],

  // Credenciales de acceso 
  adminCredentials: {
    username: "admin",
    password: "dermato1234"
  }
};

// Función para obtener citas disponibles en las próximas 2 semanas
export const getAvailableAppointments = () => {
  const today = new Date();
  const twoWeeksFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
  
  const availableDates = [];
  const currentDate = new Date(today);
  
  while (currentDate <= twoWeeksFromNow) {
    // Solo días laborables (lunes a viernes)
    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingAppointments = mockData.appointments.filter(
        apt => apt.date === dateStr
      );
      
      const availableTimes = mockData.availableSlots.filter(
        time => !existingAppointments.some(apt => apt.time === time)
      );
      
      // Incluir TODAS las fechas laborables, incluso si no tienen horarios disponibles
      availableDates.push({
        date: dateStr,
        availableTimes: availableTimes
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return availableDates;
};

// Función para agregar nueva cita
export const addAppointment = (appointmentData) => {
  const newAppointment = {
    id: mockData.appointments.length + 1,
    ...appointmentData,
    status: "pending"
  };
  mockData.appointments.push(newAppointment);
  return newAppointment;
};

// Función para actualizar estado de cita
export const updateAppointmentStatus = (appointmentId, newStatus) => {
  const appointment = mockData.appointments.find(apt => apt.id === appointmentId);
  if (appointment) {
    appointment.status = newStatus;
    
    // Si se confirma una cita, cancelar automáticamente las otras citas con la misma fecha y hora
    if (newStatus === 'confirmed') {
      const conflictingAppointments = mockData.appointments.filter(apt => 
        apt.id !== appointmentId && 
        apt.date === appointment.date && 
        apt.time === appointment.time && 
        apt.status !== 'cancelled'
      );
      
      conflictingAppointments.forEach(conflictingApt => {
        conflictingApt.status = 'cancelled';
      });
    }
    
    return appointment;
  }
  return null;
};

// Función para agregar obra social
export const addInsuranceProvider = (providerData) => {
  const newProvider = {
    id: mockData.insuranceProviders.length + 1,
    ...providerData
  };
  mockData.insuranceProviders.push(newProvider);
  return newProvider;
};

// Función para eliminar obra social
export const deleteInsuranceProvider = (providerId) => {
  const index = mockData.insuranceProviders.findIndex(provider => provider.id === providerId);
  if (index > -1) {
    return mockData.insuranceProviders.splice(index, 1)[0];
  }
  return null;
};
