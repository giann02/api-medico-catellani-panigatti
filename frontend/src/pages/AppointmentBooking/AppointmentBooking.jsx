import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CalendarToday, 
  Person, 
  Phone, 
  Email, 
  LocalHospital,
  CheckCircle,
  AccessTime
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import apiService from '../../services/api.js';
import { useAppointmentData } from '../../hooks/useAppointmentData.js';

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientLastName: '',
    phone: '',
    email: '',
    insuranceProvider: '',
    date: null,
    time: '',
    notes: ''
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Usar el hook personalizado para datos de citas
  const {
    insuranceProviders,
    loading: dataLoading,
    error: dataError,
    getAvailableTimesForDate
  } = useAppointmentData();

  // Hacer scroll hacia arriba cuando se monta el componente
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  // Función para hacer scroll suave hacia la sección de horarios
  const scrollToTimeSlots = () => {
    setTimeout(() => {
      const timeSlotsSection = document.getElementById('time-slots-section');
      if (timeSlotsSection) {
        timeSlotsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100); // Pequeño delay para asegurar que el DOM se actualice
  };

  // Función para hacer scroll suave hacia el formulario
  const scrollToForm = () => {
    setTimeout(() => {
      const formSection = document.getElementById('patient-form-section');
      if (formSection) {
        formSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };


  // Verificar si un día es fin de semana
  const isWeekend = (date) => {
    // Usar dayjs directamente - ya maneja zona horaria correctamente
    return date.day() === 0 || date.day() === 6; // Domingo (0) o Sábado (6)
  };

  const handleDateSelect = async (date) => {
    if (date && !isWeekend(date)) {
      // Permitir selección de cualquier fecha laborable
      setLoadingTimes(true);
      try {
        const times = await getAvailableTimesForDate(date);
        setFormData(prev => ({
          ...prev,
          date: date,
          time: '' // Reset time when date changes
        }));
        setSelectedDate(date);
        setAvailableTimes(times);
      } catch (error) {
        console.error('Error cargando horarios:', error);
        setAvailableTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    } else if (date) {
      // Si es fin de semana, mostrar mensaje o resetear
      setFormData(prev => ({
        ...prev,
        date: null,
        time: ''
      }));
      setSelectedDate(null);
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time: time
    }));
    setSelectedTime(time);
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Formatear teléfono mientras se escribe
    if (field === 'phone') {
      // Solo permitir números, espacios, guiones, paréntesis y +
      processedValue = value.replace(/[^\d\s\-\+\(\)]/g, '');
      
      // Formatear automáticamente para números argentinos
      const numbersOnly = processedValue.replace(/\D/g, '');
      if (numbersOnly.length > 0) {
        if (numbersOnly.startsWith('54')) {
          // Formato internacional: +54 11 1234-5678
          if (numbersOnly.length <= 2) {
            processedValue = `+${numbersOnly}`;
          } else if (numbersOnly.length <= 4) {
            processedValue = `+${numbersOnly.slice(0, 2)} ${numbersOnly.slice(2)}`;
          } else if (numbersOnly.length <= 8) {
            processedValue = `+${numbersOnly.slice(0, 2)} ${numbersOnly.slice(2, 4)} ${numbersOnly.slice(4)}`;
          } else {
            processedValue = `+${numbersOnly.slice(0, 2)} ${numbersOnly.slice(2, 4)} ${numbersOnly.slice(4, 8)}-${numbersOnly.slice(8, 12)}`;
          }
        } else if (numbersOnly.startsWith('11') || numbersOnly.startsWith('15')) {
          // Formato local: 11 1234-5678
          if (numbersOnly.length <= 2) {
            processedValue = numbersOnly;
          } else if (numbersOnly.length <= 6) {
            processedValue = `${numbersOnly.slice(0, 2)} ${numbersOnly.slice(2)}`;
          } else {
            processedValue = `${numbersOnly.slice(0, 2)} ${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6, 10)}`;
          }
        } else {
          // Otros formatos
          processedValue = numbersOnly;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'El nombre es requerido';
    }
    if (!formData.patientLastName.trim()) {
      newErrors.patientLastName = 'El apellido es requerido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono solo puede contener números, espacios, guiones, paréntesis y el signo +';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 dígitos';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.insuranceProvider) {
      newErrors.insuranceProvider = 'La obra social es requerida';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData.time) {
      newErrors.time = 'El horario es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Si hay errores de validación, hacer scroll al formulario
      scrollToForm();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        ...formData,
        date: formData.date.format('YYYY-MM-DD')
      };
      
      const response = await apiService.createAppointment(appointmentData);
      
      if (response.success) {
        setSubmitSuccess(true);
      } else {
        throw new Error(response.message || 'Error al crear la cita');
      }
      
      setFormData({
        patientName: '',
        patientLastName: '',
        phone: '',
        email: '',
        insuranceProvider: '',
        date: null,
        time: '',
        notes: ''
      });
      setAvailableTimes([]);
      setSelectedDate(null);
      setSelectedTime('');
      setShowTimeSlots(false);
      
    } catch (error) {
      console.error('Error al enviar la cita:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 6 }}>
            <CheckCircle sx={{ color: 'success.main', fontSize: 80, mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'success.main' }}>
              ¡Cita Solicitada Exitosamente!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Tu solicitud de cita ha sido enviada. Te contactaremos pronto para confirmar la cita.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setSubmitSuccess(false)}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Solicitar Otra Cita
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }


  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold', 
          mb: 3, 
          color: 'text.primary' 
        }}
      >
        Reservar Cita Médica
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        {/* Formulario de Datos del Paciente */}
        <Grid item xs={12} md={10} lg={8} id="patient-form-section">
          <Card 
            elevation={3}
            sx={{ 
              height: 'fit-content',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                p: 4,
                color: 'white'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1
                }}
              >
                <Person sx={{ mr: 2, fontSize: 28 }} />
                Datos del Paciente
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Completa tus datos para reservar la cita
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 5 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  
                  {/* Nombre y Apellido */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      error={!!errors.patientName}
                      helperText={errors.patientName}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={formData.patientLastName}
                      onChange={(e) => handleInputChange('patientLastName', e.target.value)}
                      error={!!errors.patientLastName}
                      helperText={errors.patientLastName}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Teléfono y Email */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <Phone sx={{ color: '#1976d2', fontSize: 20 }} />
                          </Box>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <Email sx={{ color: '#1976d2', fontSize: 20 }} />
                          </Box>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Obra Social */}
                  <TextField
                    fullWidth
                    select
                    label="Obra Social"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                    error={!!errors.insuranceProvider}
                    helperText={errors.insuranceProvider}
                    required
                    displayEmpty
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8fafc',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        '&.Mui-focused': {
                          color: '#1976d2',
                        },
                      },
                      '& .MuiSelect-select': {
                        padding: '16.5px 14px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em style={{ color: '#94a3b8' }}>
                        {dataLoading ? 'Cargando obras sociales...' : 'Selecciona tu obra social'}
                      </em>
                    </MenuItem>
                    {dataLoading ? (
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <span>Cargando...</span>
                        </Box>
                      </MenuItem>
                    ) : (
                      insuranceProviders.map((provider) => (
                        <MenuItem key={provider._id} value={provider.name}>
                          {provider.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                  
                  {/* Motivo de consulta */}
                  <TextField
                    fullWidth
                    label="Motivo de consulta (opcional)"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Describe brevemente el motivo de tu consulta..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8fafc',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        '&.Mui-focused': {
                          color: '#1976d2',
                        },
                      },
                    }}
                  />
                  
                  {/* Botón para ver horarios */}
                  <Button
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={() => {
                      setShowTimeSlots(true);
                      scrollToTimeSlots();
                    }}
                    disabled={isSubmitting}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                      borderRadius: 2,
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background: '#e2e8f0',
                        color: '#94a3b8',
                        boxShadow: 'none',
                        transform: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={<AccessTime sx={{ fontSize: 24 }} />}
                  >
                    Ver Horarios
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calendario y Horarios - Solo se muestra después de hacer clic en "Ver Horarios" */}
      {showTimeSlots && (
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }} id="time-slots-section">
          <Grid item xs={12} md={8} lg={6}>
          {/* Calendario */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'semibold', display: 'flex', alignItems: 'center', mb: 3 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                Seleccionar Fecha
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                Selecciona una fecha disponible para tu cita
              </Typography>
              
              {/* DatePicker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de la cita"
                  value={formData.date}
                  onChange={handleDateSelect}
                  format="DD/MM/YYYY"
                  openTo="day"
                  views={['day']}
                  shouldDisableDate={(date) => {
                    // Solo deshabilitar fines de semana y fechas pasadas
                    // Permitir todas las fechas laborables en el rango
                    if (isWeekend(date)) return true;
                    if (date.isBefore(dayjs(), 'day')) return true;
                    if (date.isAfter(dayjs().add(14, 'day'), 'day')) return true;
                    return false; // Permitir todas las fechas laborables
                  }}
                  minDate={dayjs().add(1, 'day')} // Mañana
                  maxDate={dayjs().add(14, 'day')} // 14 días desde hoy
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      placeholder: "DD/MM/YYYY",
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          minHeight: '56px',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                        '& .MuiInputBase-input': {
                          height: '1.4375em',
                          padding: '16.5px 14px',
                        },
                      }
                    },
                    popper: {
                      sx: {
                        '& .MuiPaper-root': {
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          borderRadius: 2,
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
              
              {/* Información sobre fechas disponibles */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  <strong>Nota:</strong> Solo se muestran fechas laborables con horarios disponibles 
                  (próximos 14 días, excluyendo fines de semana)
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          {/* Horarios disponibles */}
          {formData.date && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2 }}>
                  Horarios Disponibles - {formData.date.format('DD/MM/YYYY')}
                </Typography>
                {loadingTimes ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ mr: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Cargando horarios disponibles...
                    </Typography>
                  </Box>
                ) : availableTimes.length > 0 ? (
                  <Grid container spacing={1}>
                    {availableTimes.map((time) => (
                      <Grid item xs={4} sm={3} key={time}>
                        <Button
                          variant={formData.time === time ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => handleTimeSelect(time)}
                          sx={{
                            minWidth: 'auto',
                            py: 1,
                            bgcolor: formData.time === time ? 'primary.main' : 'transparent',
                            color: formData.time === time ? 'white' : 'primary.main',
                            borderColor: 'primary.main',
                            '&:hover': {
                              bgcolor: formData.time === time ? 'primary.dark' : 'primary.light',
                              color: 'white'
                            }
                          }}
                        >
                          {time}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No hay horarios disponibles para esta fecha.
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Botón de Solicitar Cita */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 2,
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.3s ease',
              }}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <LocalHospital sx={{ fontSize: 24 }} />
                )
              }
            >
              {isSubmitting ? 'Procesando solicitud...' : 'Solicitar Cita'}
            </Button>
          </Box>

          {/* Información adicional */}
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> Las citas están sujetas a confirmación. 
                Te contactaremos para confirmar la fecha y hora exacta.
              </Typography>
            </Alert>
            
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Recordatorio:</strong> Trae tu DNI y carnet de la obra social 
                el día de la consulta.
              </Typography>
            </Alert>
          </Box>
        </Grid>
      </Grid>
      )}
    </Container>
  );
};

export default AppointmentBooking;