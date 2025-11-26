import mongoose from 'mongoose';

const insuranceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la obra social es requerido'],
    trim: true,
    unique: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  code: {
    type: String,
    required: [true, 'El código de la obra social es requerido'],
    trim: true,
    unique: true,
    uppercase: true,
    maxlength: [20, 'El código no puede exceder 20 caracteres']
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
insuranceProviderSchema.index({ name: 1 });
insuranceProviderSchema.index({ code: 1 });

// Middleware para actualizar updatedAt
insuranceProviderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para obtener todas las obras sociales
insuranceProviderSchema.statics.getAllProviders = function() {
  return this.find().sort({ name: 1 });
};

export default mongoose.model('InsuranceProvider', insuranceProviderSchema);
