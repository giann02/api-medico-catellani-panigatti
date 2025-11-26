import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { LocalHospital, Login, Home, Person, MedicalServices, ContactPhone, Menu, Close, Dashboard } from '@mui/icons-material';
import { useState } from 'react';
import { isAuthenticated } from '../../utils/auth';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionNavigation = (sectionId) => {
    if (location.pathname === '/') {
      // Si ya estamos en la página principal, hacer scroll directo
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si no estamos en la página principal, navegar primero y luego hacer scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleMedicalAccess = () => {
    if (isAuthenticated()) {
      // Si ya está autenticado, ir directamente al dashboard
      navigate('/admin');
    } else {
      // Si no está autenticado, ir al login
      navigate('/login');
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { handleSectionNavigation('sobre-mi'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Sobre Mi" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { handleSectionNavigation('servicios'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <MedicalServices />
            </ListItemIcon>
            <ListItemText primary="Servicios" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { handleSectionNavigation('contacto'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <ContactPhone />
            </ListItemIcon>
            <ListItemText primary="Contacto" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { handleMedicalAccess(); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText primary="Acceso Médico" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="fixed" elevation={2} sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital sx={{ mr: 1.5, fontSize: '1.5rem' }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold' }}>
                Dra. María Pérez
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile ? (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 0 }}
                >
                  <Menu />
                </IconButton>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/"
                    color="inherit"
                    sx={{
                      bgcolor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<Home />}
                  >
                    Home
                  </Button>
                  <Button
                    onClick={() => handleSectionNavigation('sobre-mi')}
                    color="inherit"
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<Person />}
                  >
                    Sobre Mi
                  </Button>
                  <Button
                    onClick={() => handleSectionNavigation('servicios')}
                    color="inherit"
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<MedicalServices />}
                  >
                    Servicios
                  </Button>
                  <Button
                    onClick={() => handleSectionNavigation('contacto')}
                    color="inherit"
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<ContactPhone />}
                  >
                    Contacto
                  </Button>
                  <Button
                    onClick={handleMedicalAccess}
                    color="inherit"
                    startIcon={<Login />}
                    variant="outlined"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    Acceso Médico
                  </Button>
                </>
              )}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, pt: '56px' }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white', 
          py: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #1976d2 0%, #03a9f4 100%)'
          }
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 2,
              position: 'relative'
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 400,
                letterSpacing: '0.5px',
                lineHeight: 1.6,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #1976d2 0%, #03a9f4 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              © 2024 Dra. María Pérez - Dermatología. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
