import insuranceService from '../services/insuranceService.js';

// Obtener todas las obras sociales
export const getAllInsuranceProviders = async (req, res) => {
  try {
    const providers = await insuranceService.getAllInsuranceProviders();

    res.json({
      success: true,
      data: providers
    });

  } catch (error) {
    console.error('Error obteniendo obras sociales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener obra social por ID
export const getInsuranceProviderById = async (req, res) => {
  try {
    const provider = await insuranceService.getInsuranceProviderById(req.params.id);

    res.json({
      success: true,
      data: provider
    });

  } catch (error) {
    console.error('Error obteniendo obra social:', error);
    
    if (error.message === 'Obra social no encontrada') {
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

// Crear nueva obra social
export const createInsuranceProvider = async (req, res) => {
  try {
    const providerData = req.body;
    const provider = await insuranceService.createInsuranceProvider(providerData);

    res.status(201).json({
      success: true,
      message: 'Obra social creada exitosamente',
      data: provider
    });

  } catch (error) {
    console.error('Error creando obra social:', error);
    
    if (error.message === 'Ya existe una obra social con ese nombre o código') {
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

// Actualizar obra social
export const updateInsuranceProvider = async (req, res) => {
  try {
    const providerId = req.params.id;
    const updateData = req.body;

    const provider = await insuranceService.updateInsuranceProvider(providerId, updateData);

    res.json({
      success: true,
      message: 'Obra social actualizada exitosamente',
      data: provider
    });

  } catch (error) {
    console.error('Error actualizando obra social:', error);
    
    if (error.message === 'Obra social no encontrada' || error.message === 'Ya existe otra obra social con ese nombre o código') {
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

// Eliminar obra social
export const deleteInsuranceProvider = async (req, res) => {
  try {
    const result = await insuranceService.deleteInsuranceProvider(req.params.id);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error eliminando obra social:', error);
    
    if (error.message === 'Obra social no encontrada') {
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

// Obtener estadísticas de obras sociales
export const getInsuranceProviderStats = async (req, res) => {
  try {
    const stats = await insuranceService.getInsuranceProviderStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de obras sociales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Buscar obras sociales
export const searchInsuranceProviders = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }

    const providers = await insuranceService.searchInsuranceProviders(q);

    res.json({
      success: true,
      data: providers
    });

  } catch (error) {
    console.error('Error buscando obras sociales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener obras sociales más utilizadas
export const getMostUsedInsuranceProviders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const providers = await insuranceService.getMostUsedInsuranceProviders(parseInt(limit));

    res.json({
      success: true,
      data: providers
    });

  } catch (error) {
    console.error('Error obteniendo obras sociales más utilizadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear múltiples obras sociales
export const createMultipleInsuranceProviders = async (req, res) => {
  try {
    const { providers } = req.body;

    if (!Array.isArray(providers)) {
      return res.status(400).json({
        success: false,
        message: 'Los datos deben ser un array de obras sociales'
      });
    }

    const result = await insuranceService.createMultipleInsuranceProviders(providers);

    res.status(201).json({
      success: true,
      message: `${result.success.length} obras sociales creadas exitosamente`,
      data: {
        created: result.success,
        errors: result.errors
      }
    });

  } catch (error) {
    console.error('Error creando múltiples obras sociales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};