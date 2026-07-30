import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, EyeOff, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

const Login = () => {
  const navigate = useNavigate();
  const { 
    login, 
    requestPasswordReset, 
    verifyResetCode, 
    updatePassword, 
    loginWithoutPassword 
  } = useEmployees();
  
  // Views: 'login' | 'forgot_email' | 'forgot_code' | 'forgot_options' | 'forgot_new_pass'
  const [view, setView] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const user = await login(email, password);
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
    if (!email) {
      setError('Ingresa tu correo para continuar.');
      return;
    }
    setError('');
    setLoading(true);
    
    const res = await requestPasswordReset(email);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg('Hemos enviado un código a tu correo.');
      setView('forgot_code');
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!resetCode) {
      setError('Ingresa el código.');
      return;
    }
    setError('');
    setLoading(true);
    
    const res = await verifyResetCode(email, resetCode);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg('');
      setView('forgot_options');
    }
    setLoading(false);
  };

  const handleLoginWithoutPassword = async () => {
    setLoading(true);
    const res = await loginWithoutPassword(email);
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
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    const res = await updatePassword(email, newPassword);
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
        
        {/* Logo */}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                <EyeOff className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivad-blue disabled:opacity-50 transition-all"
              >
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => { setView('forgot_email'); setError(''); setSuccessMsg(''); }}
                className="text-sm text-gray-500 hover:text-ivad-blue hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}

        {/* View: Forgot Email */}
        {view === 'forgot_email' && (
          <form onSubmit={handleRequestReset} className="space-y-4 fade-in">
            <h3 className="text-xl font-semibold text-center text-ivad-blue mb-2">Recuperar Acceso</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Ingresa el correo asociado a tu cuenta y te enviaremos un código de verificación.
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
                placeholder="Correo electrónico"
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
                {loading ? 'Enviando...' : 'Enviar Código'}
                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full flex justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
              >
                Volver
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
            
            {successMsg && <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg">{successMsg}</p>}
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
                {loading ? 'Verificando...' : 'Verificar'}
                {!loading && <CheckCircle2 className="ml-2 w-5 h-5" />}
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-ivad-blue mb-2">¡Identidad Verificada!</h3>
              <p className="text-sm text-gray-500">
                Selecciona cómo deseas continuar:
              </p>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLoginWithoutPassword}
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Entrar ahora sin contraseña'}
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
                Actualizar mi contraseña
              </button>
            </div>
          </div>
        )}

        {/* View: Forgot New Password */}
        {view === 'forgot_new_pass' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4 fade-in">
            <h3 className="text-xl font-semibold text-center text-ivad-blue mb-2">Nueva Contraseña</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Crea una nueva contraseña segura para tu cuenta.
            </p>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent placeholder-gray-400"
                required
                minLength={6}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Actualizar y Entrar'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
