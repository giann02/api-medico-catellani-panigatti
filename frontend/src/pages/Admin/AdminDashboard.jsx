import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Dashboard,
  CalendarToday,
  LocalHospital,
  ExitToApp,
  People,
  Assessment,
  Home,
  Cancel,
  Schedule,
  Business,
  HealthAndSafety,
  LocalPharmacy,
  MedicalServices
} from '@mui/icons-material';
import { getUserInfo, clearAuthData } from '../../utils/auth.js';
import { doctorInfo } from '../../config/doctorInfo.js';
import apiService from '../../services/api.js';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    totalInsuranceProviders: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const user = getUserInfo();
    
    if (user) {
      setIsAuthenticated(true);
      setUserInfo(user);
      loadDashboardStats();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas de citas
      const appointmentsResponse = await apiService.getAppointmentStats();
      const insuranceResponse = await apiService.getInsuranceProviderStats();
      
      if (appointmentsResponse.success && insuranceResponse.success) {
        setStats({
          pendingAppointments: appointmentsResponse.data.pending || 0,
          confirmedAppointments: appointmentsResponse.data.confirmed || 0,
          cancelledAppointments: appointmentsResponse.data.cancelled || 0,
          totalInsuranceProviders: insuranceResponse.data.total || 0
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleCardClick = (cardTitle) => {
    if (cardTitle === 'Obras Sociales') {
      navigate('/admin/obras-sociales');
    } else if (cardTitle === 'Citas Confirmadas') {
      navigate('/admin/citas?filter=confirmed');
    } else if (cardTitle === 'Citas Pendientes') {
      navigate('/admin/citas?filter=pending');
    } else if (cardTitle === 'Citas Canceladas') {
      navigate('/admin/citas?filter=cancelled');
    } else if (cardTitle.includes('Citas')) {
      navigate('/admin/citas');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'grey.50'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'grey.600' }}>
            Cargando panel de administración...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Estadísticas desde el backend
  const { pendingAppointments, confirmedAppointments, cancelledAppointments, totalInsuranceProviders } = stats;

  const dashboardCards = [
    {
      title: 'Citas Confirmadas',
      value: confirmedAppointments,
      icon: <CalendarToday sx={{ color: '#2e7d32', fontSize: '2rem' }} />,
      color: '#2e7d32',
      bgColor: 'rgba(46, 125, 50, 0.1)'
    },
    {
      title: 'Citas Pendientes',
      value: pendingAppointments,
      icon: <Schedule sx={{ color: '#ed6c02', fontSize: '2rem' }} />,
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.1)'
    },
    {
      title: 'Citas Canceladas',
      value: cancelledAppointments,
      icon: <Cancel sx={{ color: '#d32f2f', fontSize: '2rem' }} />,
      color: '#d32f2f',
      bgColor: 'rgba(211, 47, 47, 0.1)'
    },
    {
      title: 'Obras Sociales',
      value: totalInsuranceProviders,
      icon: <HealthAndSafety sx={{ color: '#7b1fa2', fontSize: '2rem' }} />,
      color: '#7b1fa2',
      bgColor: 'rgba(123, 31, 162, 0.1)'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <LocalHospital sx={{ color: 'white', fontSize: '1.5rem' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'white', 
                    lineHeight: 1.2,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Panel Administrativo
                </Typography>
              </Box>
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
        {/* Título */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'grey.800', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.600' }}>
            Gestiona las citas y configuraciones del consultorio
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          justifyContent: 'center', 
          mb: 6,
          px: 2
        }}>
          {dashboardCards.map((card, index) => (
            <Card 
              key={index}
              onClick={() => handleCardClick(card.title)}
              sx={{ 
                width: { xs: 'calc(45% - 12px)', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
                maxWidth: { xs: '200px', sm: 'none' },
                height: { xs: '120px', sm: '150px' },
                minHeight: { xs: '120px', sm: '150px' },
                maxHeight: { xs: '120px', sm: '150px' },
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ 
                p: 3, 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}>
                  <Box sx={{ 
                    flex: 1, 
                    mr: { xs: 0, sm: 2 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    textAlign: { xs: 'left', sm: 'center' }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, sm: 0 },
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'flex-start', sm: 'center' }
                    }}>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: card.color,
                          fontSize: '2rem',
                          lineHeight: 1.2
                        }}
                      >
                        {card.value}
                      </Typography>
                      {/* Icono para mobile - al lado del número */}
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'transparent',
                          display: { xs: 'flex', sm: 'none' },
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: '32px',
                          height: '32px',
                          minWidth: '32px',
                          minHeight: '32px',
                          maxWidth: '32px',
                          maxHeight: '32px'
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        mt: 0.5
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: '50%', 
                      bgcolor: card.bgColor,
                      display: { xs: 'none', sm: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: '48px',
                      height: '48px',
                      minWidth: '48px',
                      minHeight: '48px',
                      maxWidth: '48px',
                      maxHeight: '48px'
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Acciones rápidas */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center'
            }}
          >
            <Card 
              sx={{ 
                width: '100%',
                height: { xs: '150px', md: '180px' },
                minHeight: { xs: '150px', md: '180px' },
                maxHeight: { xs: '150px', md: '180px' },
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' 
              }}>
                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1.5,
                    justifyContent: { xs: 'flex-start', md: 'center' }
                  }}>
                    <CalendarToday sx={{ color: 'primary.main', fontSize: '1.5rem', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'semibold', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Gestión de Citas
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.8rem', md: '0.9rem' }, lineHeight: 1.3 }}>
                    Visualiza, confirma y gestiona todas las citas solicitadas por los pacientes.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => navigate('/admin/citas')}
                  startIcon={<CalendarToday />}
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    fontSize: '0.8rem',
                    py: 0.5,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Ver Citas
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center'
            }}
          >
            <Card 
              sx={{ 
                width: '100%',
                height: { xs: '150px', md: '180px' },
                minHeight: { xs: '150px', md: '180px' },
                maxHeight: { xs: '150px', md: '180px' },
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' 
              }}>
                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1.5,
                    justifyContent: { xs: 'flex-start', md: 'center' }
                  }}>
                    <People sx={{ color: 'secondary.main', fontSize: '1.5rem', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'semibold', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Obras Sociales
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.8rem', md: '0.9rem' }, lineHeight: 1.3 }}>
                    Administra las obras sociales con convenio y sus configuraciones.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => navigate('/admin/obras-sociales')}
                  startIcon={<People />}
                  size="small"
                  sx={{
                    bgcolor: 'secondary.main',
                    fontSize: '0.8rem',
                    py: 0.5,
                    '&:hover': { bgcolor: 'secondary.dark' }
                  }}
                >
                  Gestionar Obras Sociales
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Información del consultorio */}
        <Card 
          sx={{ 
            mt: 4,
            maxWidth: '320px',
            mx: 'auto',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 4px 16px rgba(25, 118, 210, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.05)',
              zIndex: 1
            }
          }}
        >
          <CardContent sx={{ p: 2, position: 'relative', zIndex: 2 }}>
            {/* Header compacto */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              pb: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Dashboard sx={{ fontSize: '1.2rem', color: 'white', mr: 1.5 }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Información del Consultorio
              </Typography>
            </Box>

            <Grid container spacing={1} justifyContent={{ xs: "center", md: "flex-start" }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1,
                  mb: 1,
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#2e7d32',
                    mr: 1.5,
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      display: 'block'
                    }}>
                      Médico
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 'medium',
                      fontSize: '0.85rem'
                    }}>
                      {doctorInfo.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1,
                  mb: 1,
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#ed6c02',
                    mr: 1.5,
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      display: 'block'
                    }}>
                      Especialidad
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 'medium',
                      fontSize: '0.85rem'
                    }}>
                      {doctorInfo.specialty}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1,
                  mb: 1,
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#1976d2',
                    mr: 1.5,
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      display: 'block'
                    }}>
                      Teléfono
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 'medium',
                      fontSize: '0.85rem'
                    }}>
                      {doctorInfo.contact.phone}
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1,
                  mb: 1,
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#7b1fa2',
                    mr: 1.5,
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      display: 'block'
                    }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 'medium',
                      fontSize: '0.85rem'
                    }}>
                      {doctorInfo.contact.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1,
                  mb: 1,
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#2e7d32',
                    mr: 1.5,
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      display: 'block'
                    }}>
                      Dirección
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 'medium',
                      fontSize: '0.85rem'
                    }}>
                      {doctorInfo.contact.address}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1,
                  mb: 1,
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#ed6c02',
                    mr: 1.5,
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      display: 'block'
                    }}>
                      Horarios
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 'medium',
                      fontSize: '0.85rem'
                    }}>
                      {doctorInfo.contact.schedule}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

