import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Pending,
  CalendarToday,
  Person,
  Phone,
  Email,
  LocalHospital,
  Cancel,
  Home,
  ExitToApp,
  Schedule,
  Assessment
} from '@mui/icons-material';
import apiService from '../../services/api.js';
import { getUserInfo, clearAuthData } from '../../utils/auth.js';
import dayjs from 'dayjs';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCancelDialog, setIsCancelDialog] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState({}); 
  const [loadingStatusChange, setLoadingStatusChange] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  useEffect(() => {
    const user = getUserInfo();
    if (!user) {
      navigate('/login');
      return;
    }

    // Leer el filtro de la URL si existe
    const filterFromUrl = searchParams.get('filter');
    if (filterFromUrl && ['all', 'pending', 'confirmed', 'cancelled'].includes(filterFromUrl)) {
      setStatusFilter(filterFromUrl);
    }

    // Cargar citas desde el backend
    loadAppointments();
  }, [navigate, searchParams]);

  const loadAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await apiService.getAppointments();
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error cargando citas:', error);
      setSuccessMessage('Error al cargar las citas. Verifique que el backend esté corriendo.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleConfirmAppointment = async (appointment) => {
    setLoadingConfirm(prev => ({ ...prev, [appointment._id]: true }));
    try {
      const response = await apiService.updateAppointmentStatus(appointment._id, 'confirmed');
      if (response.success) {
        // Actualizar solo la cita específica en el estado local
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === appointment._id 
              ? { ...apt, status: 'confirmed' }
              : apt
          )
        );
        setSuccessMessage('Cita confirmada exitosamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error confirmando cita:', error);
    } finally {
      setLoadingConfirm(prev => ({ ...prev, [appointment._id]: false }));
    }
  };

  const handleStatusChange = (appointment, newStatusParam = null) => {
    setSelectedAppointment(appointment);
    if (newStatusParam === 'cancelled') {
      setNewStatus('cancelled');
      setIsCancelDialog(true);
      setConfirmDialog(true);
    } else {
      if (newStatusParam) {
        setNewStatus(newStatusParam);
      } else {
        setNewStatus(appointment.status === 'pending' ? 'confirmed' : 'pending');
      }
      setIsCancelDialog(false);
      setConfirmDialog(true);
    }
  };

  const confirmStatusChange = async () => {
    if (selectedAppointment && newStatus) {
      setLoadingStatusChange(true);
      try {
        const response = await apiService.updateAppointmentStatus(selectedAppointment._id, newStatus);
        if (response.success) {
          // Actualizar solo la cita específica en el estado local
          setAppointments(prev => 
            prev.map(apt => 
              apt._id === selectedAppointment._id 
                ? { ...apt, status: newStatus }
                : apt
            )
          );
          let message = '';
          switch (newStatus) {
            case 'confirmed':
              message = 'Cita confirmada exitosamente';
              break;
            case 'pending':
              message = 'Cita marcada como pendiente exitosamente';
              break;
            case 'cancelled':
              message = 'Cita cancelada exitosamente';
              break;
            default:
              message = 'Estado de cita actualizado exitosamente';
          }
          setSuccessMessage(message);
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (error) {
        console.error('Error actualizando estado de cita:', error);
      } finally {
        setLoadingStatusChange(false);
      }
    }
    setConfirmDialog(false);
    setSelectedAppointment(null);
    setNewStatus('');
    setIsCancelDialog(false);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <Chip
            icon={<CheckCircle />}
            label="Confirmada"
            color="success"
            variant="outlined"
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<Pending />}
            label="Pendiente"
            color="warning"
            variant="outlined"
          />
        );
      case 'cancelled':
        return (
          <Chip
            icon={<Cancel />}
            label="Cancelada"
            color="error"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            label={status}
            color="default"
            variant="outlined"
          />
        );
    }
  };

  const formatDate = (dateStr) => {
    return dayjs(dateStr).format('DD/MM/YYYY');
  };

  const getStatusButton = (appointment) => {
    const isThisAppointmentLoading = loadingConfirm[appointment._id] || false;
    
    if (appointment.status === 'pending') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleConfirmAppointment(appointment)}
            disabled={isThisAppointmentLoading}
            startIcon={
              isThisAppointmentLoading ? (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              ) : (
                <CheckCircle />
              )
            }
          >
            {isThisAppointmentLoading ? 'Confirmando...' : 'Confirmar'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleStatusChange(appointment, 'cancelled')}
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
        </Box>
      );
    } else if (appointment.status === 'confirmed') {
      return (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleStatusChange(appointment, 'cancelled')}
          startIcon={<Cancel />}
        >
          Cancelar
        </Button>
      );
    } else {
      // Para citas canceladas, no mostrar botones 
      return (
        <Typography variant="body2" color="text.secondary">
          Sin acciones disponibles
        </Typography>
      );
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Container maxWidth="lg" className="flex items-center justify-between">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/admin')} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <CalendarToday sx={{ mr: 1.5, fontSize: '1.5rem' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'semibold',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Gestión de Citas
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

      <Container maxWidth="lg" className="py-8">
        {/* Título y estadísticas */}
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Citas Médicas
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-6">
            Gestiona todas las citas solicitadas por los pacientes
          </Typography>
          
          {successMessage && (
            <Alert severity="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          {/* Estadísticas */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', mt: 2 }}>
            <Card 
              component="button"
              onClick={() => setStatusFilter('all')}
              sx={{ 
                flex: '1 1 150px',
                minWidth: '150px',
                maxWidth: '180px',
                border: statusFilter === 'all' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                boxShadow: statusFilter === 'all' ? '0 4px 12px rgba(25, 118, 210, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mr: 0.5 }}>
                    {appointments.length}
                  </Typography>
                  <Assessment sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  Total Citas
                </Typography>
              </CardContent>
            </Card>
            
            <Card 
              component="button"
              onClick={() => setStatusFilter('pending')}
              sx={{ 
                flex: '1 1 150px',
                minWidth: '150px',
                maxWidth: '180px',
                border: statusFilter === 'pending' ? '2px solid #ed6c02' : '1px solid #e0e0e0',
                boxShadow: statusFilter === 'pending' ? '0 4px 12px rgba(237, 108, 2, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#ed6c02', mr: 0.5 }}>
                    {appointments.filter(apt => apt.status === 'pending').length}
                  </Typography>
                  <Schedule sx={{ color: '#ed6c02', fontSize: '1.5rem' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
            
            <Card 
              component="button"
              onClick={() => setStatusFilter('confirmed')}
              sx={{ 
                flex: '1 1 150px',
                minWidth: '150px',
                maxWidth: '180px',
                border: statusFilter === 'confirmed' ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                boxShadow: statusFilter === 'confirmed' ? '0 4px 12px rgba(46, 125, 50, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32', mr: 0.5 }}>
                    {appointments.filter(apt => apt.status === 'confirmed').length}
                  </Typography>
                  <CalendarToday sx={{ color: '#2e7d32', fontSize: '1.5rem' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  Confirmadas
                </Typography>
              </CardContent>
            </Card>
            
            <Card 
              component="button"
              onClick={() => setStatusFilter('cancelled')}
              sx={{ 
                flex: '1 1 150px',
                minWidth: '150px',
                maxWidth: '180px',
                border: statusFilter === 'cancelled' ? '2px solid #d32f2f' : '1px solid #e0e0e0',
                boxShadow: statusFilter === 'cancelled' ? '0 4px 12px rgba(211, 47, 47, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f', mr: 0.5 }}>
                    {appointments.filter(apt => apt.status === 'cancelled').length}
                  </Typography>
                  <Cancel sx={{ color: '#d32f2f', fontSize: '1.5rem' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  Canceladas
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Tabla de citas */}
        <Card 
          sx={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <CardContent className="p-0">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow 
                    sx={{ 
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      '& th': {
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderBottom: 'none',
                        py: 2
                      }
                    }}
                  >
                    <TableCell>Paciente</TableCell>
                    <TableCell>Contacto</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Obra Social</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingAppointments ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Box className="flex flex-col items-center">
                          <CircularProgress size={40} sx={{ mb: 2 }} />
                          <Typography variant="body1" className="text-gray-500">
                            Cargando citas...
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : appointments.filter(apt => {
                    if (statusFilter === 'all') return true;
                    return apt.status === statusFilter;
                  }).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Box className="flex flex-col items-center">
                          <CalendarToday className="text-gray-400 text-4xl mb-2" />
                          <Typography variant="body1" className="text-gray-500">
                            {statusFilter === 'all' 
                              ? 'No hay citas registradas'
                              : `No hay citas ${statusFilter === 'pending' ? 'pendientes' : statusFilter === 'confirmed' ? 'confirmadas' : 'canceladas'}`
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments
                      .filter(apt => {
                        if (statusFilter === 'all') return true;
                        return apt.status === statusFilter;
                      })
                      .sort((a, b) => {
                        // Ordenar por fecha (más recientes primero)
                        const dateComparison = new Date(b.date) - new Date(a.date);
                        if (dateComparison !== 0) {
                          return dateComparison;
                        }
                        // Si las fechas son iguales, ordenar por hora (más tardías primero)
                        return b.time.localeCompare(a.time);
                      })
                      .map((appointment, index) => (
                        <TableRow 
                          key={appointment._id}
                          sx={{
                            bgcolor: index % 2 === 0 ? 'white' : 'rgba(0, 0, 0, 0.02)',
                            '& td': {
                              borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
                              py: 2
                            }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {appointment.patientName} {appointment.patientLastName}
                              </Typography>
                              {appointment.notes && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                  {appointment.notes}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Phone sx={{ fontSize: '0.875rem', color: 'text.secondary', mr: 0.5 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                  {appointment.phone}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ fontSize: '0.875rem', color: 'text.secondary', mr: 0.5 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                  {appointment.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarToday sx={{ fontSize: '0.875rem', color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formatDate(appointment.date)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Schedule sx={{ fontSize: '0.875rem', color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {appointment.time}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocalHospital sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontSize: '0.875rem',
                                  color: 'text.secondary'
                                }}
                              >
                                {appointment.insuranceProvider}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(appointment.status)}
                          </TableCell>
                          <TableCell>
                            {getStatusButton(appointment)}
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

      {/* Dialog de confirmación */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>
          {isCancelDialog ? 'Confirmar Cancelación de Cita' : 'Confirmar Cambio de Estado'}
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box>
              <Typography variant="body1" className="mb-4">
                {isCancelDialog 
                  ? `¿Estás seguro de que deseas cancelar la cita de ${selectedAppointment.patientName} ${selectedAppointment.patientLastName}?`
                  : `¿Estás seguro de que deseas cambiar el estado de la cita de ${selectedAppointment.patientName} ${selectedAppointment.patientLastName}?`
                }
              </Typography>
              <Box className="mb-4">
                <Typography variant="body2" className="text-gray-600">
                  <strong>Fecha:</strong> {formatDate(selectedAppointment.date)} a las {selectedAppointment.time}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  <strong>Obra Social:</strong> {selectedAppointment.insuranceProvider}
                </Typography>
              </Box>
              {!isCancelDialog && (
                <FormControl fullWidth>
                  <InputLabel>Nuevo Estado</InputLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    label="Nuevo Estado"
                  >
                    {selectedAppointment?.status === 'pending' && (
                      <>
                        <MenuItem value="confirmed">
                          <Box className="flex items-center">
                            <CheckCircle className="mr-2 text-green-600" />
                            Confirmada
                          </Box>
                        </MenuItem>
                        <MenuItem value="cancelled">
                          <Box className="flex items-center">
                            <Cancel className="mr-2 text-red-600" />
                            Cancelada
                          </Box>
                        </MenuItem>
                      </>
                    )}
                    {selectedAppointment?.status === 'confirmed' && (
                      <MenuItem value="cancelled">
                        <Box className="flex items-center">
                          <Cancel className="mr-2 text-red-600" />
                          Cancelada
                        </Box>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog(false)}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
          <Button
            onClick={confirmStatusChange}
            variant="contained"
            color={isCancelDialog ? "error" : "primary"}
            disabled={loadingStatusChange}
            startIcon={
              loadingStatusChange ? (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              ) : null
            }
          >
            {loadingStatusChange 
              ? (isCancelDialog ? "Cancelando..." : "Procesando...") 
              : (isCancelDialog ? "Cancelar Cita" : "Confirmar Cambio")
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentManagement;

