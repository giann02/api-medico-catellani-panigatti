// Información del médico hardcodeada (debe coincidir con el backend)
export const doctorInfo = {
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
};

// Función para obtener información pública del médico
export const getPublicDoctorInfo = () => {
  return {
    name: doctorInfo.name,
    specialty: doctorInfo.specialty,
    title: doctorInfo.title,
    education: doctorInfo.education,
    services: doctorInfo.services,
    contact: {
      phone: doctorInfo.contact.phone,
      email: doctorInfo.contact.email,
      address: doctorInfo.contact.address,
      schedule: doctorInfo.contact.schedule
    }
  };
};
