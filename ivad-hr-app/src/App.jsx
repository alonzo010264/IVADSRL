import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import { useEmployees } from './context/EmployeeContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminPayroll from './pages/AdminPayroll';
import AdminVerifications from './pages/AdminVerifications';
import CreateAnnouncement from './pages/CreateAnnouncement';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import LeaveRequest from './pages/LeaveRequest';
import CalendarView from './pages/Calendar';
import RequestsApprovals from './pages/RequestsApprovals';
import LeaveApprovals from './pages/LeaveApprovals';
import MiscRequests from './pages/MiscRequests';
import HRChat from './pages/HRChat';
import VerificationRequest from './pages/VerificationRequest';
import CertificateRequest from './pages/CertificateRequest';
import PersonalData from './pages/PersonalData';
import EmployeeProfile from './pages/EmployeeProfile';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Notifications from './pages/Notifications';
import Policies from './pages/Policies';
import Layout from './components/Layout';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { currentUser } = useEmployees();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !currentUser.isAdmin && !currentUser.is_admin) {
    return <Navigate to="/inicio" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/nomina" element={<AdminPayroll />} />
            <Route path="/admin/verificaciones" element={<AdminVerifications />} />
            <Route path="/crear-anuncio" element={<CreateAnnouncement />} />
          </Route>
        
        {/* Protected routes wrapped in Layout with Navigation */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Dashboard />} />
            <Route path="/equipo" element={<Directory />} />
            <Route path="/solicitud-permiso" element={<LeaveRequest />} />
            <Route path="/calendario" element={<CalendarView />} />
            <Route path="/mas" element={<RequestsApprovals />} />
            <Route path="/estatus-solicitudes" element={<LeaveApprovals />} />
            <Route path="/solicitudes-varias" element={<MiscRequests />} />
            <Route path="/solicitar-verificacion" element={<VerificationRequest />} />
          </Route>
        </Route>

        {/* Rutas sin el BottomNav */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat-rrhh" element={<HRChat />} />
          <Route path="/certificado" element={<CertificateRequest />} />
          <Route path="/datos-personales" element={<PersonalData />} />
          <Route path="/empleado/:id" element={<EmployeeProfile />} />
          <Route path="/tareas" element={<Tasks />} />
          <Route path="/asistencia" element={<Attendance />} />
          <Route path="/nomina" element={<Payroll />} />
          <Route path="/notificaciones" element={<Notifications />} />
          <Route path="/politicas" element={<Policies />} />
        </Route>

        <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
