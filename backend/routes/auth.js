import express from 'express';
import { login, logout, verifyToken, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLogin } from '../middleware/validation.js';
import { loginRateLimit } from '../middleware/security.js';

const router = express.Router();

// Rutas públicas
router.post('/login', loginRateLimit, validateLogin, login);

// Rutas protegidas
router.post('/logout', authenticateToken, logout);
router.get('/verify', authenticateToken, verifyToken);
router.put('/change-password', authenticateToken, changePassword);

export default router;
