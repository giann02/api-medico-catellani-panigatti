import { Container, Typography, Box, Card, CardContent, Grid, Button, Avatar, Chip, Divider } from '@mui/material';
import { LocalHospital, School, MedicalServices, ContactPhone, Email, LocationOn, Schedule, Star, CheckCircle, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { doctorInfo } from '../../config/doctorInfo.js';

const Home = () => {
  const doctor = doctorInfo;

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
          color: 'white',
          py: 8,
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 4, md: 65 }} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                {doctor.name}
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {doctor.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Especialista en {doctor.specialty}
              </Typography>

              {/* Características destacadas */}
              <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Chip 
                  icon={<Star />} 
                  label="15+ años experiencia" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<CheckCircle />} 
                  label="Tecnología avanzada" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<Person />} 
                  label="Atención personalizada" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  component={Link}
                  to="/reservar-cita"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    px: { xs: 3, md: 4 },
                    py: 2,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={<LocalHospital />}
                >
                  Reservar Cita
                </Button>
              </Box>
            </Grid>
             <Grid item xs={12} md={6} sx={{ textAlign: 'center', mt: { xs: 6, md: 0 } }}>
               <Box
                 sx={{ 
                   width: 260, 
                   height: 260, 
                   mx: 'auto', 
                   mb: 2,
                   borderRadius: '50%',
                   overflow: 'hidden',
                   border: '4px solid white',
                   boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                   position: 'relative',
                   '&::before': {
                     content: '""',
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(3, 169, 244, 0.1) 100%)',
                     zIndex: 1
                   }
                 }}
               >
                 <img
                   src="https://images.unsplash.com/photo-1758691462651-611d730c5272?w=400&h=400&fit=crop&crop=face&auto=format&q=80"
                   alt="Dra. María Pérez - Dermatóloga"
                   style={{
                     width: '100%',
                     height: '100%',
                     objectFit: 'cover',
                     objectPosition: 'center'
                   }}
                 />
               </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About & Education Section */}
      <Box id="sobre-mi" sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)', 
        py: 10,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231976d2" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: 0.5
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 4, 
                color: 'text.primary',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Sobre Mi y Formación Profesional
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary', 
                maxWidth: '900px', 
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.8,
                fontWeight: 400
              }}
            >
              Con más de 15 años de experiencia en dermatología, me especializo en el diagnóstico y tratamiento 
              integral de enfermedades de la piel. Mi enfoque combina la medicina tradicional con las últimas 
              tecnologías para brindar la mejor atención a mis pacientes.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {doctor.education.map((item, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card 
                  sx={{ 
                    height: '250px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid rgba(25, 118, 210, 0.1)',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 25px 50px rgba(25, 118, 210, 0.2)',
                      border: '2px solid rgba(25, 118, 210, 0.4)',
                      '& .education-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: 'linear-gradient(90deg, #1976d2 0%, #03a9f4 100%)'
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      p: 4, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: '0 10px 25px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      className="education-icon"
                    >
                      <School sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.primary',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        fontWeight: 500
                      }}
                    >
                      {item}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="servicios" sx={{ 
        py: 10, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%2303a9f4" fill-opacity="0.02"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: 0.6
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 4, 
                color: 'text.primary',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Servicios Ofrecidos
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary', 
                maxWidth: '800px', 
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.8,
                fontWeight: 400
              }}
            >
              Ofrezco una amplia gama de servicios dermatológicos utilizando tecnología de vanguardia 
              y las mejores prácticas médicas para garantizar resultados óptimos en cada tratamiento.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {doctor.services.map((service, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card 
                  sx={{ 
                    height: '250px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f0f8ff 100%)',
                    border: '2px solid rgba(3, 169, 244, 0.1)',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 25px 50px rgba(3, 169, 244, 0.2)',
                      border: '2px solid rgba(3, 169, 244, 0.4)',
                      '& .service-icon': {
                        transform: 'scale(1.1) rotate(-5deg)'
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: 'linear-gradient(90deg, #03a9f4 0%, #1976d2 100%)'
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      p: 4, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #03a9f4 0%, #1976d2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: '0 10px 25px rgba(3, 169, 244, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      className="service-icon"
                    >
                      <MedicalServices sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        mb: 2,
                        color: 'text.primary'
                      }}
                    >
                      {service}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                        lineHeight: 1.6
                      }}
                    >
                      Tratamiento especializado con tecnología avanzada y atención personalizada
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            ¿Necesitas una Consulta?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1rem', md: '1.25rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Reserva tu cita ahora y cuida tu piel con la mejor atención profesional. 
            Mi compromiso es brindarte un tratamiento personalizado y de calidad.
          </Typography>
          <Button
            component={Link}
            to="/reservar-cita"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              px: { xs: 4, md: 6 },
              py: 2,
              fontSize: { xs: '1rem', md: '1.1rem' },
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'grey.100',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
            startIcon={<LocalHospital />}
          >
            Reservar Cita Ahora
          </Button>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contacto" sx={{ 
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%)', 
        py: 12,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231976d2" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: 0.6
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 4, 
                color: 'text.primary',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Contacto y Ubicación
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary', 
                maxWidth: '800px', 
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.8,
                fontWeight: 400
              }}
            >
              Estoy aquí para ayudarte. Contacta conmigo para consultas, dudas o para agendar tu próxima cita.
            </Typography>
          </Box>
          
          {/* Diseño mejorado de contacto */}
          <Grid container spacing={6} alignItems="stretch" justifyContent="center">
            {/* Información de contacto */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Tarjeta principal de contacto */}
                <Card 
                  sx={{ 
                    flex: 1,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid rgba(25, 118, 210, 0.1)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(25, 118, 210, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 25px 50px rgba(25, 118, 210, 0.15)',
                      border: '2px solid rgba(25, 118, 210, 0.3)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: 'linear-gradient(90deg, #1976d2 0%, #03a9f4 100%)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Box 
                        sx={{ 
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 15px 30px rgba(25, 118, 210, 0.3)'
                        }}
                      >
                        <ContactPhone sx={{ color: 'white', fontSize: '2rem' }} />
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 4,
                          color: 'text.primary',
                          fontSize: { xs: '1.5rem', md: '1.8rem' }
                        }}
                      >
                        Información de Contacto
                      </Typography>
                    </Box>

                    {/* Lista de contacto mejorada */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Teléfono */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
                          border: '1px solid rgba(25, 118, 210, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                            border: '1px solid rgba(25, 118, 210, 0.3)',
                            background: 'linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 3,
                            flexShrink: 0,
                            boxShadow: '0 5px 15px rgba(25, 118, 210, 0.3)'
                          }}
                        >
                          <ContactPhone sx={{ color: 'white', fontSize: '1.3rem' }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mb: 0.5,
                              color: 'text.primary',
                              fontSize: '1rem'
                            }}
                          >
                            Teléfono
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '1.1rem',
                              fontWeight: 600
                            }}
                          >
                            {doctor.contact.phone}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Email */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
                          border: '1px solid rgba(25, 118, 210, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                            border: '1px solid rgba(25, 118, 210, 0.3)',
                            background: 'linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 3,
                            flexShrink: 0,
                            boxShadow: '0 5px 15px rgba(25, 118, 210, 0.3)'
                          }}
                        >
                          <Email sx={{ color: 'white', fontSize: '1.3rem' }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mb: 0.5,
                              color: 'text.primary',
                              fontSize: '1rem'
                            }}
                          >
                            Email
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '1.1rem',
                              fontWeight: 600
                            }}
                          >
                            {doctor.contact.email}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Dirección */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
                          border: '1px solid rgba(25, 118, 210, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                            border: '1px solid rgba(25, 118, 210, 0.3)',
                            background: 'linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 3,
                            flexShrink: 0,
                            boxShadow: '0 5px 15px rgba(25, 118, 210, 0.3)'
                          }}
                        >
                          <LocationOn sx={{ color: 'white', fontSize: '1.3rem' }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mb: 0.5,
                              color: 'text.primary',
                              fontSize: '1rem'
                            }}
                          >
                            Dirección
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '1.1rem',
                              fontWeight: 600
                            }}
                          >
                            {doctor.contact.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Mapa y horarios */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Mapa mejorado */}
                <Box 
                  sx={{ 
                    flex: 1,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '3px solid rgba(25, 118, 210, 0.2)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(3, 169, 244, 0.05) 100%)',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713276849!2d-58.383759!3d-34.6037389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del consultorio"
                  />
                </Box>

                {/* Horarios de atención mejorados */}
                <Card 
                  sx={{ 
                    background: 'linear-gradient(145deg, #ffffff 0%, #f0f8ff 100%)',
                    border: '2px solid rgba(25, 118, 210, 0.1)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 35px rgba(25, 118, 210, 0.15)',
                      border: '2px solid rgba(25, 118, 210, 0.3)',
                      '& .schedule-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: 'linear-gradient(90deg, #1976d2 0%, #4caf50 100%)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box 
                        sx={{ 
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1976d2 0%, #4caf50 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 10px 25px rgba(25, 118, 210, 0.3)',
                          transition: 'all 0.3s ease',
                          flexShrink: 0
                        }}
                        className="schedule-icon"
                      >
                        <Schedule sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '1.3rem',
                            color: 'text.primary',
                            mb: 1
                          }}
                        >
                          Horarios de Atención
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            lineHeight: 1.6
                          }}
                        >
                          {doctor.contact.schedule}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.9rem',
                            mt: 1,
                            fontStyle: 'italic'
                          }}
                        >
                          * Se recomienda agendar cita con anticipación
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
