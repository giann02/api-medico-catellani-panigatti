import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  LocalHospital,
  Business,
  Home,
  ExitToApp
} from '@mui/icons-material';
import { getUserInfo, clearAuthData } from '../../utils/auth';
import apiService from '../../services/api.js';

const InsuranceManagement = () => {
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingProviders, setLoadingProviders] = useState(true);
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  useEffect(() => {
    // Verifica autenticación
    const user = getUserInfo();
    if (!user) {
      navigate('/login');
      return;
    }

    // Carga obras sociales desde la API
    loadInsuranceProviders();
  }, [navigate]);

  const loadInsuranceProviders = async () => {
    setLoadingProviders(true);
    try {
      const response = await apiService.getInsuranceProviders();
      if (response.success) {
        setInsuranceProviders(response.data);
      }
    } catch (error) {
      console.error('Error cargando obras sociales:', error);
      // Mostrar mensaje de error al usuario
      setErrorMessage('Error al cargar las obras sociales. Verifique que el backend esté corriendo.');
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleAddProvider = () => {
    setFormData({ name: '', code: '' });
    setIsAddDialogOpen(true);
  };

  const handleEditProvider = (provider) => {
    setSelectedProvider(provider);
    setFormData({ name: provider.name, code: provider.code });
    setIsEditDialogOpen(true);
  };

  const handleDeleteProvider = (provider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProvider = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      setErrorMessage('Todos los campos son requeridos');
      return;
    }

    try {
      if (selectedProvider) {
        // Actualizar obra social existente
        const response = await apiService.updateInsuranceProvider(selectedProvider._id, {
          name: formData.name,
          code: formData.code
        });
        if (response.success) {
          setSuccessMessage('Obra social actualizada exitosamente');
          loadInsuranceProviders(); // Recargar desde la API
        }
      } else {
        // Crear nueva obra social
        const response = await apiService.createInsuranceProvider({
          name: formData.name,
          code: formData.code
        });
        if (response.success) {
          setSuccessMessage('Obra social agregada exitosamente');
          loadInsuranceProviders(); // Recargar desde la API
        }
      }
      
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setFormData({ name: '', code: '' });
      setSelectedProvider(null);
      setErrorMessage('');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error al guardar la obra social:', error);
      setErrorMessage('Error al guardar la obra social');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedProvider) {
      try {
        const response = await apiService.deleteInsuranceProvider(selectedProvider._id);
        if (response.success) {
          setSuccessMessage('Obra social eliminada exitosamente');
          loadInsuranceProviders(); // Recargar desde la API
        }
        setIsDeleteDialogOpen(false);
        setSelectedProvider(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error al eliminar la obra social:', error);
        setErrorMessage('Error al eliminar la obra social');
      }
    }
  };

  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setFormData({ name: '', code: '' });
    setSelectedProvider(null);
    setErrorMessage('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/admin')} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <Business sx={{ mr: 1.5, fontSize: '1.5rem' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'semibold',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Gestión de Obras Sociales
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                color="inherit" 
                onClick={handleGoToHome}
                title="Ir al sitio web"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Home sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                title="Cerrar sesión"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ExitToApp sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Título y acciones */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'grey.800', mb: 1 }}>
                Obras Sociales
              </Typography>
              <Typography variant="body1" sx={{ color: 'grey.600' }}>
                Administra las obras sociales con convenio
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddProvider}
              size="small"
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': { 
                  bgcolor: 'primary.dark'
                },
                '& .MuiButton-startIcon': {
                  margin: 0
                },
                '& .MuiButton-startIcon + *': {
                  display: { xs: 'none', sm: 'block' }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Agregar Obra Social
              </Box>
            </Button>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Estadísticas */}
          <Card sx={{ bgcolor: 'primary.50', mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalHospital sx={{ color: 'primary.main', fontSize: '1.5rem', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {insuranceProviders.length} {insuranceProviders.length === 1 ? 'Obra Social' : 'Obras Sociales'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main' }}>
                    Con convenio activo
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Lista de obras sociales */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'semibold' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 'semibold' }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: 'semibold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingProviders ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <CircularProgress size={40} sx={{ mb: 2 }} />
                          <Typography variant="body1" sx={{ color: 'grey.500' }}>
                            Cargando obras sociales...
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : insuranceProviders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Business sx={{ color: 'grey.400', fontSize: '2.5rem', mb: 1 }} />
                          <Typography variant="body1" sx={{ color: 'grey.500' }}>
                            No hay obras sociales registradas
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    insuranceProviders.map((provider) => (
                      <TableRow key={provider.id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {provider.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={provider.code}
                            size="small"
                            variant="outlined"
                            sx={{ bgcolor: 'primary.50', color: 'primary.main' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => handleEditProvider(provider)}
                              sx={{
                                '& .MuiButton-startIcon': {
                                  margin: 0
                                },
                                '& .MuiButton-startIcon + *': {
                                  display: { xs: 'none', sm: 'block' }
                                }
                              }}
                            >
                              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Editar
                              </Box>
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteProvider(provider)}
                              sx={{
                                '& .MuiButton-startIcon': {
                                  margin: 0
                                },
                                '& .MuiButton-startIcon + *': {
                                  display: { xs: 'none', sm: 'block' }
                                }
                              }}
                            >
                              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Eliminar
                              </Box>
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog para agregar/editar obra social */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedProvider ? 'Editar Obra Social' : 'Agregar Nueva Obra Social'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre de la Obra Social"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 1.2 }}
              placeholder="Ej: OSDE, Swiss Medical, etc."
            />
            <TextField
              fullWidth
              label="Código"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="Ej: OSDE, SWISS, etc."
              inputProps={{ maxLength: 10 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProvider}
            variant="contained"
            color="primary"
          >
            {selectedProvider ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          {selectedProvider && (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar la obra social{' '}
              <strong>{selectedProvider.name}</strong>?
            </Typography>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer. Los pacientes con esta obra social 
            no podrán seleccionarla en futuras citas.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialogs}
            variant="outlined"
            sx={{ 
              color: 'primary.main',
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.50',
                color: 'primary.dark'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsuranceManagement;

