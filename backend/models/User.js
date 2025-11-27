import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede exceder 30 caracteres']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: String,
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  lastLogout: {
    type: Date
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

// Índices
userSchema.index({ role: 1 });

// Middleware para encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Generar salt y encriptar contraseña
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para actualizar updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar último login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Método para actualizar último logout
userSchema.methods.updateLastLogout = function() {
  this.lastLogout = new Date();
  return this.save();
};

// Método estático para crear usuario administrador por defecto
userSchema.statics.createDefaultAdmin = async function() {
  const adminExists = await this.findOne({ username: 'admin' });
  
  if (!adminExists) {
    const admin = new this({
      username: 'admin',
      password: 'dermato1234', // Se encriptará automáticamente
      role: 'admin'
    });
    
    await admin.save();
    console.log('Usuario administrador por defecto creado');
  }
};

export default mongoose.model('User', userSchema);
