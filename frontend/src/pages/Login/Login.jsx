import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper
} from '@mui/material';
import { Login as LoginIcon, LocalHospital, Lock, Person } from '@mui/icons-material';
import { login } from '../../utils/auth';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { username, password } = credentials;
      
      const response = await login(username, password);
      
      if (response.success) {
        // Redirigir al dashboard
        navigate('/admin');
      } else {
        setError(response.message || 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
              <LocalHospital sx={{ color: 'primary.main', fontSize: '3.5rem' }} />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Acceso Médico
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}
            >
              Ingresa tus credenciales para acceder al panel administrativo
            </Typography>
          </Box>

          {/* Formulario de Login */}
          <Card 
            sx={{ 
              background: 'transparent',
              boxShadow: 'none',
              border: '1px solid rgba(25, 118, 210, 0.1)',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 2, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '56px'
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 2, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '56px'
                      }
                    }}
                  />

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontSize: '0.95rem'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    startIcon={<LoginIcon />}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                mb: 1
              }}
            >
              Acceso restringido para personal autorizado
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500
              }}
            >
              Dra. María Pérez - Dermatología
            </Typography>
          </Box>

          {/* Botón para volver al inicio */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'primary.50',
                  borderColor: 'primary.dark'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Volver al Inicio
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

