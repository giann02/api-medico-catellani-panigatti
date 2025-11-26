import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

class AuthService {
  // Login de usuario
  async login(username, password) {
    // Buscar usuario por username
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user || !user.isActive) {
      throw new Error('Credenciales incorrectas');
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // Actualizar último login
    await user.updateLastLogin();

    // Generar token JWT
    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
      }
    };
  }

  // Logout de usuario
  async logout(userId) {
    try {
      // Buscar el usuario
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar el timestamp de logout
      await user.updateLastLogout();

      return { 
        message: 'Logout exitoso - sesión invalidada',
        logoutTime: user.lastLogout
      };
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // Verificar token y obtener información del usuario
  async verifyToken(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user || !user.isActive) {
      throw new Error('Usuario no válido o inactivo');
    }

    return {
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
      }
    };
  }

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    // Buscar usuario
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Actualizar contraseña
    user.password = newPassword; // Se encriptará automáticamente por el middleware
    await user.save();

    return { message: 'Contraseña actualizada exitosamente' };
  }

  // Crear nuevo usuario (solo para el administrador único)
  async createUser(userData) {
    const { username, password } = userData;

    // Verificar si ya existe un usuario administrador
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      throw new Error('Ya existe un usuario administrador');
    }

    const user = new User({
      username: username.toLowerCase(),
      password,
      role: 'admin',
      isActive: true
    });

    await user.save();

    return {
      id: user._id,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  // Obtener todos los usuarios (para administradores)
  async getAllUsers() {
    return await User.find({}).select('-password').sort({ createdAt: -1 });
  }

  // Actualizar usuario
  async updateUser(userId, updateData) {
    const { username, role, isActive } = updateData;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si el nuevo username ya existe (si se está cambiando)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        throw new Error('El nombre de usuario ya existe');
      }
      user.username = username.toLowerCase();
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    return {
      id: user._id,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      updatedAt: user.updatedAt
    };
  }

  // Desactivar usuario
  async deactivateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.isActive = false;
    await user.save();

    return { message: 'Usuario desactivado exitosamente' };
  }

  // Reactivar usuario
  async reactivateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.isActive = true;
    await user.save();

    return { message: 'Usuario reactivado exitosamente' };
  }

  // Obtener estadísticas de usuarios
  async getUserStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole: roleStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
  }
}

export default new AuthService();
