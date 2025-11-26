import express from 'express';
import {
  getAllInsuranceProviders,
  getInsuranceProviderById,
  createInsuranceProvider,
  updateInsuranceProvider,
  deleteInsuranceProvider,
  getInsuranceProviderStats
} from '../controllers/insuranceController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateInsuranceProvider, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Rutas públicas (para obtener obras sociales activas)
router.get('/', getAllInsuranceProviders);

// Rutas protegidas (requieren autenticación de administrador)
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas para administradores
router.get('/stats', getInsuranceProviderStats);
router.get('/:id', validateObjectId, getInsuranceProviderById);
router.post('/', validateInsuranceProvider, createInsuranceProvider);
router.put('/:id', validateObjectId, updateInsuranceProvider);
router.delete('/:id', validateObjectId, deleteInsuranceProvider);

export default router;
