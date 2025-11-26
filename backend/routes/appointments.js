import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableTimes,
  getAvailableDates,
  getAppointmentStats
} from '../controllers/appointmentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateAppointment, validateAppointmentStatus, validateObjectId, validateDateQuery } from '../middleware/validation.js';
import { appointmentRateLimit } from '../middleware/security.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post('/', appointmentRateLimit, validateAppointment, createAppointment);
router.get('/available/times', validateDateQuery, getAvailableTimes);
router.get('/available/dates', getAvailableDates);

// Rutas protegidas (requieren autenticación de administrador)
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas para administradores
router.get('/', getAllAppointments);
router.get('/stats', getAppointmentStats);
router.get('/:id', validateObjectId, getAppointmentById);
router.put('/:id/status', validateObjectId, validateAppointmentStatus, updateAppointmentStatus);
router.delete('/:id', validateObjectId, deleteAppointment);

export default router;
