import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { isAuthenticated } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setAuthStatus(true);
      } else {
        setAuthStatus(false);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (authStatus === null) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        className="bg-gray-50"
      >
        <CircularProgress size={60} className="text-blue-600 mb-4" />
        <Typography variant="h6" className="text-gray-600">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  if (authStatus === false) {
    return null; // El navigate ya redirigió
  }

  return children;
};

export default ProtectedRoute;

