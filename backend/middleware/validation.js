import { body, param, query, validationResult } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Validaciones para citas médicas
export const validateAppointment = [
  body('patientName')
    .trim()
    .notEmpty()
    .withMessage('El nombre del paciente es requerido')
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  
  body('patientLastName')
    .trim()
    .notEmpty()
    .withMessage('El apellido del paciente es requerido')
    .isLength({ max: 50 })
    .withMessage('El apellido no puede exceder 50 caracteres'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Formato de teléfono inválido'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  
  body('insuranceProvider')
    .trim()
    .notEmpty()
    .withMessage('La obra social es requerida'),
  
  body('date')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .isISO8601()
    .withMessage('Formato de fecha inválido')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (appointmentDate < tomorrow) {
        throw new Error('La fecha debe ser al menos mañana');
      }
      
      return true;
    }),
  
  body('time')
    .trim()
    .notEmpty()
    .withMessage('El horario es requerido')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de horario inválido'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres'),
  
  handleValidationErrors
];

// Validaciones para actualizar estado de cita
export const validateAppointmentStatus = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Estado inválido. Debe ser: pending, confirmed o cancelled'),
  
  handleValidationErrors
];

// Validaciones para obras sociales
export const validateInsuranceProvider = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la obra social es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  
  body('code')
    .trim()
    .notEmpty()
    .withMessage('El código de la obra social es requerido')
    .isLength({ max: 20 })
    .withMessage('El código no puede exceder 20 caracteres')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('El código solo puede contener letras mayúsculas y números'),
  
  handleValidationErrors
];

// Validaciones para login
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  handleValidationErrors
];

// Validaciones para parámetros de ID
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido'),
  
  handleValidationErrors
];

// Validaciones para consultas de fechas
export const validateDateQuery = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha inválido'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha de inicio inválido'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha de fin inválido'),
  
  handleValidationErrors
];

// Validaciones para información del médico
export const validateDoctorInfo = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del médico es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  
  body('specialty')
    .trim()
    .notEmpty()
    .withMessage('La especialidad es requerida')
    .isLength({ max: 100 })
    .withMessage('La especialidad no puede exceder 100 caracteres'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),
  
  body('contact.phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Formato de teléfono inválido'),
  
  body('contact.email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  
  body('contact.address')
    .trim()
    .notEmpty()
    .withMessage('La dirección es requerida')
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
  body('contact.schedule')
    .trim()
    .notEmpty()
    .withMessage('El horario es requerido')
    .isLength({ max: 200 })
    .withMessage('El horario no puede exceder 200 caracteres'),
  
  handleValidationErrors
];
