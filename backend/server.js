import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

// Importar middlewares de seguridad
import { 
  helmetConfig, 
  generalRateLimit, 
  requestLogger, 
  securityErrorHandler,
  validateOrigin,
  sanitizeInput
} from './middleware/security.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import insuranceRoutes from './routes/insurance.js';

// Importar modelos para inicialización
import User from './models/User.js';
import InsuranceProvider from './models/InsuranceProvider.js';


// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmetConfig);
app.use(compression());
app.use(generalRateLimit);
app.use(requestLogger);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/insurance', insuranceRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema de Gestión de Citas Médicas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      appointments: '/api/appointments',
      insurance: '/api/insurance'
    }
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(securityErrorHandler);

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-medico';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');
    
    // Inicializar datos por defecto
    await initializeDefaultData();
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función para inicializar datos por defecto
const initializeDefaultData = async () => {
  try {
    // Crear usuario administrador por defecto
    await User.createDefaultAdmin();
    
    // Crear obras sociales por defecto
    const defaultInsuranceProviders = [
      { name: 'OSDE', code: 'OSDE' },
      { name: 'Swiss Medical', code: 'SWISS' },
      { name: 'Galeno', code: 'GALENO' },
      { name: 'Medicus', code: 'MEDICUS' },
      { name: 'Hospital Italiano', code: 'HIBA' },
      { name: 'PAMI', code: 'PAMI' },
      { name: 'IOMA', code: 'IOMA' },
      { name: 'Particular', code: 'PARTICULAR' }
    ];

    for (const provider of defaultInsuranceProviders) {
      const exists = await InsuranceProvider.findOne({ code: provider.code });
      if (!exists) {
        await InsuranceProvider.create(provider);
      }
    }
    
    console.log('✅ Datos por defecto inicializados');
    
  } catch (error) {
    console.error('❌ Error inicializando datos por defecto:', error.message);
  }
};

// Función para manejar cierre graceful del servidor
const gracefulShutdown = () => {
  console.log('\n🔄 Cerrando servidor...');
  
  mongoose.connection.close(() => {
    console.log('✅ Conexión a MongoDB cerrada');
    process.exit(0);
  });
};

// Manejar señales de cierre
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor iniciado exitosamente!
📍 Puerto: ${PORT}
🌍 Entorno: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/health
      `);
    });
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

export default app;
