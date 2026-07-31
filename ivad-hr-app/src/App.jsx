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
import SplashScreen from './components/SplashScreen';
import { Outlet } from 'react-router-dom';
import Chat from './pages/Chat';
import Incidencias from './pages/Incidencias';
import Iniciativas from './pages/Iniciativas';
import FAQ from './pages/FAQ';
import Configuracion from './pages/Configuracion';
import AgentDashboard from './pages/AgentDashboard';
import AdminAgentes from './pages/AdminAgentes';
import AdminIncidencias from './pages/AdminIncidencias';
import AdminPermisos from './pages/AdminPermisos';
import AdminIniciativas from './pages/AdminIniciativas';
import AdminPoliticas from './pages/AdminPoliticas';
import AdminTareas from './pages/AdminTareas';
import AdminAsistencia from './pages/AdminAsistencia';
import LicenseRequest from './pages/LicenseRequest';
import Vacaciones from './pages/Vacaciones';
import VacationRequest from './pages/VacationRequest';
import CompanyPolicies from './pages/CompanyPolicies';

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
      <SplashScreen />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/nomina" element={<AdminPayroll />} />
            <Route path="/admin/verificaciones" element={<AdminVerifications />} />
            <Route path="/admin/agentes" element={<AdminAgentes />} />
            <Route path="/admin/incidencias" element={<AdminIncidencias />} />
            <Route path="/admin/permisos" element={<AdminPermisos />} />
            <Route path="/admin/iniciativas" element={<AdminIniciativas />} />
            <Route path="/admin/politicas" element={<AdminPoliticas />} />
            <Route path="/admin/tareas" element={<AdminTareas />} />
            <Route path="/admin/asistencia" element={<AdminAsistencia />} />
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
            
            {/* Nuevas rutas del menú lateral */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/incidencias" element={<Incidencias />} />
            <Route path="/iniciativas" element={<Iniciativas />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/solicitudes-varias" element={<MiscRequests />} />
            <Route path="/solicitar-verificacion" element={<VerificationRequest />} />
            <Route path="/solicitud-licencia" element={<LicenseRequest />} />
            <Route path="/vacaciones" element={<Vacaciones />} />
            <Route path="/solicitar-vacaciones" element={<VacationRequest />} />
            <Route path="/politicas-empresa" element={<CompanyPolicies />} />
          </Route>
        </Route>
        
        {/* Ruta para agentes de soporte (sin el Layout de empleado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/agente" element={<AgentDashboard />} />
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
