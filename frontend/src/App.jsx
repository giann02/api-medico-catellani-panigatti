import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import AppointmentBooking from './pages/AppointmentBooking/AppointmentBooking';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AppointmentManagement from './pages/Admin/AppointmentManagement';
import ObrasSocialesManagement from './pages/Admin/ObrasSocialesManagement';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reservar-cita" element={<AppointmentBooking />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/citas" element={
            <ProtectedRoute>
              <AppointmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/obras-sociales" element={
            <ProtectedRoute>
              <ObrasSocialesManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;