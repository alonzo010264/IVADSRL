import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    currentUser,
    login, 
    requestPasswordReset, 
    verifyResetCode, 
    updatePassword, 
    loginWithoutPassword 
  } = useEmployees();

  // Auto-redirección si ya hay una sesión activa guardada y no está en modo "Agregar cuenta"
  useEffect(() => {
    const isAddingAccount = searchParams.get('addAccount') === 'true';
    if (currentUser && !isAddingAccount) {
      if (currentUser.role === 'agent') {
        navigate('/agente', { replace: true });
      } else {
        navigate('/inicio', { replace: true });
      }
    }
  }, [currentUser, searchParams, navigate]);
  
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
        navigate('/agente', { replace: true });
      } else {
        navigate('/inicio', { replace: true });
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
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setView('forgot_code');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!resetCode.trim()) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    setError('');
    setLoading(true);

    const res = await verifyResetCode(email, resetCode);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setView('forgot_options');
    }
  };

  const handleChooseDirectLogin = async () => {
    setLoading(true);
    const res = await loginWithoutPassword(email);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      if (res.user.role === 'agent') {
        navigate('/agente', { replace: true });
      } else {
        navigate('/inicio', { replace: true });
      }
    }
  };

  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const res = await updatePassword(email, newPassword);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg('¡Contraseña actualizada! Entrando al sistema...');
      setTimeout(() => {
        if (res.user.role === 'agent') {
          navigate('/agente', { replace: true });
        } else {
          navigate('/inicio', { replace: true });
        }
      }, 1500);
    }
  };

  return (
    <div className="bg-[#1c2c4c] min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Círculos decorativos de fondo */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4af37] opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#d4af37] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* LOGO E IDENTIDAD CORPORATIVA */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg flex items-center justify-center bg-[#1c2c4c] border-2 border-[#d4af37]">
            <img src="/logo.png" alt="IVAD Logo" className="w-full h-full object-cover scale-125" />
          </div>
          <h1 className="text-2xl font-bold text-[#1c2c4c] tracking-tight">IVAD Connect</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Gestión de Personal & Portal de Colaboradores</p>
        </div>

        {/* MENSAJES DE ERROR O ÉXITO */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-xl text-green-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        {/* VISTA 1: FORMULARIO DE LOGIN PRINCIPAL */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@ivad.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-gray-800 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Contraseña</label>
                <button
                  type="button"
                  onClick={() => { setError(''); setView('forgot_email'); }}
                  className="text-[11px] font-bold text-[#1c2c4c] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-gray-800 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox de Reconocer Dispositivo */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 text-[#1c2c4c] rounded focus:ring-[#1c2c4c] border-gray-300"
                />
                <span className="text-xs text-gray-600 font-medium">Recordar este dispositivo por 30 días</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1c2c4c] text-white font-bold text-xs rounded-2xl hover:bg-opacity-95 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar al Portal'}
              {!loading && <ArrowRight size={16} className="text-[#d4af37]" />}
            </button>
          </form>
        )}

        {/* VISTA 2: INGRESAR CORREO PARA RECUPERACIÓN */}
        {view === 'forgot_email' && (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div className="text-center mb-4">
              <h2 className="font-bold text-base text-[#1c2c4c]">Recuperar Acceso</h2>
              <p className="text-xs text-gray-500 mt-1">Ingresa tu correo registrado para enviarte un código de verificación.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Correo Registrado</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@ivad.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setError(''); setView('login'); }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-200 transition"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#1c2c4c] text-white font-bold text-xs rounded-2xl hover:bg-opacity-95 transition disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </div>
          </form>
        )}

        {/* VISTA 3: INGRESAR CÓDIGO DE VERIFICACIÓN DE 6 DÍGITOS */}
        {view === 'forgot_code' && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-amber-100 text-[#1c2c4c] rounded-full flex items-center justify-center mx-auto mb-2">
                <KeyRound size={24} />
              </div>
              <h2 className="font-bold text-base text-[#1c2c4c]">Código de Verificación</h2>
              <p className="text-xs text-gray-500 mt-1">Enviamos un código de 6 dígitos a <strong>{email}</strong>.</p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center text-2xl font-mono tracking-[10px] py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setError(''); setView('forgot_email'); }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-200 transition"
              >
                Reenviar
              </button>
              <button
                type="submit"
                disabled={loading || resetCode.length !== 6}
                className="flex-1 py-3 bg-[#1c2c4c] text-white font-bold text-xs rounded-2xl hover:bg-opacity-95 transition disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </form>
        )}

        {/* VISTA 4: OPCIONES TRAS VERIFICAR (ENTRAR DIRECTO O CAMBIAR CONTRASEÑA) */}
        {view === 'forgot_options' && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="font-bold text-base text-[#1c2c4c]">¡Verificación Exitosa!</h2>
            <p className="text-xs text-gray-500">¿Qué deseas hacer a continuación?</p>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleChooseDirectLogin}
                disabled={loading}
                className="w-full py-3.5 bg-[#1c2c4c] text-[#d4af37] font-bold text-xs rounded-2xl hover:bg-opacity-95 transition shadow-md flex items-center justify-center gap-2"
              >
                Ingresar al sistema directamente
              </button>

              <button
                type="button"
                onClick={() => setView('forgot_new_pass')}
                className="w-full py-3 bg-gray-100 text-gray-800 font-bold text-xs rounded-2xl hover:bg-gray-200 transition"
              >
                Crear una nueva contraseña
              </button>
            </div>
          </div>
        )}

        {/* VISTA 5: ESTABLECER NUEVA CONTRASEÑA */}
        {view === 'forgot_new_pass' && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="font-bold text-base text-[#1c2c4c]">Nueva Contraseña</h2>
              <p className="text-xs text-gray-500 mt-1">Escribe tu nueva clave de acceso.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la clave"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1c2c4c] text-white font-bold text-xs rounded-2xl hover:bg-opacity-95 transition shadow-lg disabled:opacity-50 mt-2"
            >
              {loading ? 'Guardando...' : 'Guardar y Entrar'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
