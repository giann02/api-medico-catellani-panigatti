import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Configuración de rate limiting para diferentes endpoints
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Demasiadas solicitudes, intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Rate limiting para login (más restrictivo)
export const loginRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutos
  15, // máximo 15 intentos por IP
  'Demasiados intentos de login, intente en 15 minutos'
);

// Rate limiting para creación de citas
export const appointmentRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hora
  10, // máximo 10 citas por IP por hora
  'Demasiadas solicitudes de citas, intente más tarde'
);

// Rate limiting general para API
export const generalRateLimit = createRateLimit(
  5 * 60 * 1000, // 5 minutos
  5000, // máximo 5000 requests por IP
  'Demasiadas solicitudes, intente más tarde'
);

// Configuración de Helmet para seguridad
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Middleware para sanitizar datos de entrada
export const sanitizeInput = (req, res, next) => {
  // Función para sanitizar strings
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .trim()
      .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
      .substring(0, 1000); // Limitar longitud
  };

  // Sanitizar body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }

  // Sanitizar query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  next();
};

// Middleware para validar origen de requests 
export const validateOrigin = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  const origin = req.headers.origin;
  
  if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Origen no permitido'
    });
  }
};

// Middleware para logging de requests
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);

  next();
};

// Middleware para manejo de errores de seguridad
export const securityErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos'
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'El recurso ya existe'
    });
  }

  console.error('Error de seguridad:', err);

  // Respuesta genérica para otros errores
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

