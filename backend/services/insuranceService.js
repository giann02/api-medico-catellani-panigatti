import InsuranceProvider from '../models/InsuranceProvider.js';

class InsuranceService {
  // Obtener todas las obras sociales
  async getAllInsuranceProviders() {
    return await InsuranceProvider.find().sort({ name: 1 });
  }

  // Obtener obra social por ID
  async getInsuranceProviderById(id) {
    const provider = await InsuranceProvider.findById(id);

    if (!provider) {
      throw new Error('Obra social no encontrada');
    }

    return provider;
  }

  // Crear nueva obra social
  async createInsuranceProvider(providerData) {
    const { name, code } = providerData;

    // Verificar si ya existe una obra social con el mismo nombre o código
    const existingProvider = await InsuranceProvider.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { code: code.toUpperCase() }
      ]
    });

    if (existingProvider) {
      throw new Error('Ya existe una obra social con ese nombre o código');
    }

    const provider = new InsuranceProvider({
      name,
      code: code.toUpperCase()
    });

    await provider.save();
    return provider;
  }

  // Actualizar obra social
  async updateInsuranceProvider(id, updateData) {
    const { name, code } = updateData;

    const provider = await InsuranceProvider.findById(id);

    if (!provider) {
      throw new Error('Obra social no encontrada');
    }

    // Verificar si ya existe otra obra social con el mismo nombre o código
    if (name || code) {
      const existingProvider = await InsuranceProvider.findOne({
        _id: { $ne: id },
        $or: [
          name ? { name: { $regex: new RegExp(`^${name}$`, 'i') } } : {},
          code ? { code: code.toUpperCase() } : {}
        ]
      });

      if (existingProvider) {
        throw new Error('Ya existe otra obra social con ese nombre o código');
      }
    }

    // Actualizar campos
    if (name) provider.name = name;
    if (code) provider.code = code.toUpperCase();

    await provider.save();
    return provider;
  }

  // Eliminar obra social permanentemente
  async deleteInsuranceProvider(id) {
    const provider = await InsuranceProvider.findById(id);

    if (!provider) {
      throw new Error('Obra social no encontrada');
    }

    // Eliminar permanentemente de la base de datos
    await InsuranceProvider.findByIdAndDelete(id);

    return { message: 'Obra social eliminada exitosamente' };
  }


  // Obtener estadísticas de obras sociales
  async getInsuranceProviderStats() {
    const totalProviders = await InsuranceProvider.countDocuments();

    return {
      total: totalProviders
    };
  }

  // Buscar obras sociales por nombre
  async searchInsuranceProviders(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    
    return await InsuranceProvider.find({
      $or: [
        { name: { $regex: regex } },
        { code: { $regex: regex } }
      ]
    }).sort({ name: 1 });
  }

  // Obtener obras sociales más utilizadas
  async getMostUsedInsuranceProviders(limit = 10) {
    // Esta función requeriría agregar un campo de uso en el modelo
    // Por ahora, retornamos todas las obras sociales ordenadas por nombre
    return await InsuranceProvider.find()
      .sort({ name: 1 })
      .limit(limit);
  }

  // Verificar si una obra social existe
  async isInsuranceProviderActive(name) {
    const provider = await InsuranceProvider.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    return !!provider;
  }

  // Obtener obras sociales por código
  async getInsuranceProviderByCode(code) {
    return await InsuranceProvider.findOne({ 
      code: code.toUpperCase()
    });
  }

  // Crear múltiples obras sociales
  async createMultipleInsuranceProviders(providersData) {
    const results = [];
    const errors = [];

    for (const providerData of providersData) {
      try {
        const provider = await this.createInsuranceProvider(providerData);
        results.push(provider);
      } catch (error) {
        errors.push({
          data: providerData,
          error: error.message
        });
      }
    }

    return {
      success: results,
      errors: errors
    };
  }

}

export default new InsuranceService();
