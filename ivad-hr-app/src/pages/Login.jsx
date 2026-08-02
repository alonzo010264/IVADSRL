import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

const Login = () => {
  const navigate = useNavigate();
  const { 
    currentUser,
    login, 
    requestPasswordReset, 
    verifyResetCode, 
    updatePassword, 
    loginWithoutPassword 
  } = useEmployees();

  // Si el usuario ya tiene sesión guardada (por ejemplo al abrir la PWA móvil), redirigir directamente al inicio
  useEffect(() => {
    const isAddingAccount = window.location.search.includes('addAccount=true');
    if (currentUser && !isAddingAccount) {
      if (currentUser.role === 'agent') {
        navigate('/agente', { replace: true });
      } else {
        navigate('/inicio', { replace: true });
      }
    }
  }, [currentUser, navigate]);
  
  // Views: 'login' | 'forgot_email' | 'forgot_code' | 'forgot_options' | 'forgot_new_pass'
  const [view, setView] = useState('login');
  
  const [email, setEmail] = useState(() => localStorage.getItem('ivad_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const user = await login(email.trim(), password, rememberDevice);
    if (user) {
      if (user.role === 'agent') {
        navigate('/agente');
      } else {
        navigate('/inicio');
      }
    } else {
      setError('Credenciales incorrectas');
    }
    setLoading(false);
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Ingresa tu correo para continuar.');
      return;
    }
    setError('');
    setLoading(true);
    
    const res = await requestPasswordReset(cleanEmail);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg('Hemos enviado un código de 6 dígitos a tu correo.');
      setView('forgot_code');
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const cleanCode = resetCode.trim();
    if (!cleanCode) {
      setError('Ingresa el código.');
      return;
    }
    setError('');
    setLoading(true);
    
    const res = await verifyResetCode(email.trim(), cleanCode);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg('');
      setView('forgot_options');
    }
    setLoading(false);
  };

  const handleLoginWithoutPassword = async () => {
    setError('');
    setLoading(true);
    const res = await loginWithoutPassword(email.trim());
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      if (res.user.role === 'agent') {
        navigate('/agente');
      } else {
        navigate('/inicio');
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden. Repítela exactamente dos veces.');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    const res = await updatePassword(email.trim(), newPassword);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      if (res.user.role === 'agent') {
        navigate('/agente');
      } else {
        navigate('/inicio');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        
        {/* Logo Original */}
        <div className="flex justify-center mb-12">
          <div className="w-64 h-auto flex items-center justify-center cursor-pointer" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}>
            <img src="/logo.png" alt="IVAD Logo" className="w-full h-auto object-contain" />
          </div>
        </div>

        {/* View: Login */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 fade-in">
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
              />
              <div 
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1 pt-1">
              <label className="flex items-center gap-2 text-gray-600 font-medium cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberDevice} 
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1c2c4c] focus:ring-[#1c2c4c] border-gray-300 accent-[#1c2c4c]" 
                />
                <span>Confiar en este dispositivo por 30 días</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivad-blue disabled:opacity-50 transition-all"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 text-gold" />}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setError(''); setSuccessMsg(''); setView('forgot_email'); }}
                className="text-sm font-medium text-gray-600 hover:text-ivad-blue transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}

        {/* View: Forgot Email */}
        {view === 'forgot_email' && (
          <form onSubmit={handleRequestReset} className="space-y-4 fade-in">
            <h3 className="text-xl font-semibold text-center text-ivad-blue mb-2">Recuperar Contraseña</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Ingresa tu correo registrado para enviarte un código de seguridad.
            </p>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico registrado"
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivad-blue disabled:opacity-50 transition-all"
              >
                {loading ? 'Enviando...' : 'Enviar Código de Seguridad'}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 text-gold" />}
              </button>
              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full flex justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
              >
                Volver al Inicio de Sesión
              </button>
            </div>
          </form>
        )}

        {/* View: Forgot Code */}
        {view === 'forgot_code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4 fade-in">
            <h3 className="text-xl font-semibold text-center text-ivad-blue mb-2">Verificar Código</h3>
            <p className="text-sm text-gray-500 text-center mb-2">
              Ingresa el código de 6 dígitos que enviamos a:
            </p>
            <p className="font-medium text-center text-gray-800 mb-6">{email}</p>
            
            {successMsg && <p className="text-ivad-blue font-medium text-sm text-center bg-blue-50 p-3 rounded-xl border border-blue-100">{successMsg}</p>}
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Código de 6 dígitos"
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400 text-center tracking-widest text-lg font-semibold"
                required
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || resetCode.length < 6}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivad-blue disabled:opacity-50 transition-all"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
                {!loading && <CheckCircle2 className="ml-2 w-5 h-5 text-gold" />}
              </button>
              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full flex justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* View: Forgot Options */}
        {view === 'forgot_options' && (
          <div className="space-y-6 fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 border-2 border-ivad-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-ivad-blue" />
              </div>
              <h3 className="text-xl font-semibold text-ivad-blue mb-2">¡Identidad Verificada!</h3>
              <p className="text-sm text-gray-500">
                Selecciona cómo deseas acceder a tu cuenta:
              </p>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLoginWithoutPassword}
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-95 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Entrar directamente a mi cuenta'}
              </button>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O</span>
                </div>
              </div>

              <button
                onClick={() => setView('forgot_new_pass')}
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border-2 border-ivad-blue rounded-full shadow-sm text-lg font-medium text-ivad-blue bg-white hover:bg-blue-50 focus:outline-none transition-all disabled:opacity-50"
              >
                Actualizar la contraseña
              </button>
            </div>
          </div>
        )}

        {/* View: Forgot New Password */}
        {view === 'forgot_new_pass' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4 fade-in">
            <h3 className="text-xl font-semibold text-center text-ivad-blue mb-2">Nueva Contraseña</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Ingresa y confirma tu nueva contraseña (debes repetirla dos veces).
            </p>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
                minLength={6}
              />
              <div 
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <Eye className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir nueva contraseña"
                className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
                minLength={6}
              />
              <div 
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Actualizar e Iniciar Sesión'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
