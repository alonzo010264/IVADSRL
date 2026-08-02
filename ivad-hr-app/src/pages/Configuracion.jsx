import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Moon, Lock, Info, ChevronRight, UserPlus, CheckCircle2, AlertCircle, LogOut, KeyRound, Mail, ShieldCheck, RefreshCw, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const Configuracion = () => {
  const navigate = useNavigate();
  const { currentUser, storedAccounts, switchAccount, removeStoredAccount, logout, logoutAll, requestPasswordReset, verifyResetCode, updatePassword } = useEmployees();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('ivad_dark_mode') === 'true';
  });

  // Modal de Cambiar Contraseña con Código de Seguridad
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Enviar Código, 2: Ingresar Código, 3: Nueva Contraseña
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sincronizar Modo Oscuro con document.documentElement y localStorage
  useEffect(() => {
    localStorage.setItem('ivad_dark_mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Manejar envío de código por correo
  const handleSendCode = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await requestPasswordReset(currentUser.email);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(`Código de 6 dígitos enviado exitosamente a ${currentUser.email}`);
      setStep(2);
    }
  };

  // Validar código de 6 dígitos
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setErrorMsg('Por favor ingresa el código de 6 dígitos completo.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    const res = await verifyResetCode(currentUser.email, code);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setStep(3);
    }
  };

  // Actualizar contraseña
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await updatePassword(currentUser.email, newPassword);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('¡Tu contraseña se ha cambiado exitosamente!');
      setTimeout(() => {
        setShowPasswordModal(false);
        resetPasswordFlow();
      }, 2000);
    }
  };

  const resetPasswordFlow = () => {
    setStep(1);
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Lista de otras cuentas guardadas (excluyendo la actual)
  const otherAccounts = (storedAccounts || []).filter(acc => acc.id?.toString() !== currentUser?.id?.toString());

  return (
    <div className={`min-h-screen pb-16 font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white pt-10 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold">Configuración</h1>
        </div>
        <p className="text-xs text-[#d4af37] ml-10">Personalización, Seguridad & Gestión Multicuenta</p>
      </div>

      <div className="max-w-lg mx-auto px-5 -mt-4 relative z-20 space-y-6">
        
        {/* SECCIÓN 1: GESTIÓN MULTICUENTA (Estilo Instagram / WhatsApp) */}
        <div>
          <div className="flex items-center justify-between mb-3 ml-2">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Cuentas Vinculadas ({storedAccounts.length})</h2>
            <span className="text-[10px] font-bold text-[#1c2c4c] bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">Multicuenta</span>
          </div>

          <div className={`rounded-3xl shadow-sm border p-4 space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            
            {/* Cuenta Activa */}
            {currentUser && (
              <div className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${darkMode ? 'bg-slate-900 border-[#d4af37]/60' : 'bg-blue-50/70 border-[#1c2c4c]'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover scale-125" />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-xs truncate ${darkMode ? 'text-white' : 'text-[#1c2c4c]'}`}>{currentUser.name}</h3>
                    <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-0.5 text-[9px] bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 font-bold px-2 py-0.5 rounded-full">
                      ● Cuenta Activa
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de Otras Cuentas Guardadas */}
            {otherAccounts.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-slate-700">
                <p className="text-[11px] font-bold text-gray-400 px-1 mb-2">Cambiar a otra cuenta:</p>
                {otherAccounts.map(acc => (
                  <div 
                    key={acc.id} 
                    className={`p-3 rounded-2xl flex items-center justify-between border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full border border-gray-300 bg-[#1c2c4c] overflow-hidden flex items-center justify-center shrink-0">
                        {acc.avatar ? (
                          <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold text-xs truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{acc.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate">{acc.role || acc.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button 
                        onClick={() => switchAccount(acc.id)}
                        className="px-3 py-1.5 bg-[#1c2c4c] text-white text-[11px] font-bold rounded-xl hover:bg-opacity-90 transition shadow-xs"
                      >
                        Cambiar
                      </button>
                      <button 
                        onClick={() => removeStoredAccount(acc.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"
                        title="Quitar cuenta"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón de Agregar Otra Cuenta (Preserva sesión actual) */}
            <button 
              onClick={() => {
                navigate('/login?addAccount=true');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#1c2c4c] to-blue-900 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition shadow-sm"
            >
              <UserPlus size={16} className="text-[#d4af37]" /> Agregar Otra Cuenta
            </button>

          </div>
        </div>

        {/* SECCIÓN 2: PREFERENCIAS (MODO OSCURO Y NOTIFICACIONES) */}
        <div>
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 ml-2">Preferencias de la App</h2>
          <div className={`rounded-3xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 p-2.5 rounded-xl">
                  <Bell size={18} />
                </div>
                <div>
                  <span className={`font-semibold text-xs block ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notificaciones Push</span>
                  <span className="text-[10px] text-gray-400">Sonido y aviso al llegar un mensaje</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 p-2.5 rounded-xl">
                  <Moon size={18} />
                </div>
                <div>
                  <span className={`font-semibold text-xs block ${darkMode ? 'text-white' : 'text-gray-800'}`}>Modo Oscuro</span>
                  <span className="text-[10px] text-gray-400">Interfaz nocturna para comodidad visual</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c2c4c]"></div>
              </label>
            </div>

          </div>
        </div>

        {/* SECCIÓN 3: SEGURIDAD (CAMBIAR CONTRASEÑA CON CÓDIGO EMAIL) */}
        <div>
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 ml-2">Seguridad & Privacidad</h2>
          <div className={`rounded-3xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            
            <button 
              onClick={() => { setShowPasswordModal(true); resetPasswordFlow(); }}
              className="w-full flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-slate-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 p-2.5 rounded-xl">
                  <Lock size={18} />
                </div>
                <div>
                  <span className={`font-semibold text-xs block ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cambiar Contraseña</span>
                  <span className="text-[10px] text-gray-400">Requiere código de verificación enviado a tu correo</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

          </div>
        </div>

        {/* SECCIÓN 4: INFORMACIÓN DE LA APLICACIÓN */}
        <div>
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 ml-2">Acerca de IVAD Connect</h2>
          <div className={`rounded-3xl shadow-sm border p-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 text-[#d4af37] p-2.5 rounded-xl">
                <Info size={18} />
              </div>
              <div>
                <span className={`font-semibold text-xs block ${darkMode ? 'text-white' : 'text-gray-800'}`}>IVAD Home & Goods v1.3.0</span>
                <span className="text-[10px] text-gray-400">Sistema Oficial de RRHH y Chat Corporativo © 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES DE CERRAR SESIÓN */}
        <div className="pt-2 space-y-2">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-3.5 text-red-600 font-bold text-xs bg-red-50 border border-red-100 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400 rounded-2xl shadow-xs active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Cerrar Sesión de esta Cuenta
          </button>

          {storedAccounts.length > 1 && (
            <button 
              onClick={() => {
                if (window.confirm("¿Deseas cerrar sesión en TODAS las cuentas guardadas?")) {
                  logoutAll();
                  navigate('/login');
                }
              }}
              className="w-full py-2.5 text-gray-400 font-semibold text-[11px] hover:text-gray-600 text-center"
            >
              Cerrar sesión en todas las cuentas ({storedAccounts.length})
            </button>
          )}
        </div>

      </div>

      {/* MODAL CAMBIAR CONTRASEÑA CON CÓDIGO DE 6 DÍGITOS */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className={`rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`}>
            
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-sm flex items-center gap-2 text-[#1c2c4c] dark:text-amber-400">
                <KeyRound size={18} /> Cambiar Contraseña Segura
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Alertas de Error o Éxito */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-3 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* PASO 1: ENVIAR CÓDIGO */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center py-3">
                  <div className="w-12 h-12 bg-amber-100 text-[#1c2c4c] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail size={24} />
                  </div>
                  <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">Verificación por Correo Electrónico</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Por tu seguridad, enviaremos un código de 6 dígitos al correo de tu cuenta:
                  </p>
                  <p className="font-bold text-xs text-[#1c2c4c] dark:text-amber-400 mt-1 bg-gray-100 dark:bg-slate-900 py-1 px-3 rounded-full inline-block">
                    {currentUser?.email}
                  </p>
                </div>

                <button 
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full py-3 bg-[#1c2c4c] text-white font-bold text-xs rounded-2xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {loading ? 'Enviando Código...' : 'Enviar Código de Seguridad'}
                </button>
              </div>
            )}

            {/* PASO 2: INGRESAR CÓDIGO */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <p className="text-xs text-gray-500 text-center">
                  Introduce el código de 6 dígitos que enviamos a <strong>{currentUser?.email}</strong>:
                </p>

                <input 
                  type="text" 
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-2xl font-mono tracking-[10px] p-3 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
                  autoFocus
                />

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading}
                    className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-2xl hover:bg-gray-200 transition"
                  >
                    Reenviar Código
                  </button>

                  <button 
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="flex-1 py-3 bg-[#1c2c4c] text-white font-bold text-xs rounded-2xl hover:bg-opacity-95 transition disabled:opacity-50"
                  >
                    {loading ? 'Verificando...' : 'Verificar Código'}
                  </button>
                </div>
              </form>
            )}

            {/* PASO 3: INGRESAR NUEVA CONTRASEÑA */}
            {step === 3 && (
              <form onSubmit={handleSaveNewPassword} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 mb-1 block">Nueva Contraseña</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full p-3 text-xs border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 mb-1 block">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full p-3 text-xs border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full py-3.5 bg-[#1c2c4c] text-[#d4af37] font-bold text-xs rounded-2xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Configuracion;
