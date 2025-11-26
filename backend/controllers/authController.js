import authService from '../services/authService.js';

// Login de usuario
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: result
    });

  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.message === 'Credenciales incorrectas') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Logout de usuario
export const logout = async (req, res) => {
  try {
    // Obtener el userId del token (si está autenticado)
    const userId = req.user ? req.user._id : null;
    
    const result = await authService.logout(userId);

    res.json({
      success: true,
      message: result.message,
      data: {
        logoutTime: result.logoutTime
      }
    });

  } catch (error) {
    console.error('Error en logout:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar token y obtener información del usuario
export const verifyToken = async (req, res) => {
  try {
    const result = await authService.verifyToken(req.user._id);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    
    if (error.message === 'Usuario no válido o inactivo') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    
    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña actual incorrecta') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo usuario (solo para administradores)
export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await authService.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    
    if (error.message === 'El nombre de usuario ya existe') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todos los usuarios (solo para administradores)
export const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar usuario (solo para administradores)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const result = await authService.updateUser(userId, updateData);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    
    if (error.message === 'Usuario no encontrado' || error.message === 'El nombre de usuario ya existe') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Desactivar usuario (solo para administradores)
export const deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await authService.deactivateUser(userId);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error desactivando usuario:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de usuarios (solo para administradores)
export const getUserStats = async (req, res) => {
  try {
    const stats = await authService.getUserStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};