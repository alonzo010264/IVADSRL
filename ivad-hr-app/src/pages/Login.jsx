import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, EyeOff } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useEmployees();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/inicio');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-64 h-auto flex items-center justify-center">
            <img src="/logo.png" alt="IVAD Logo" className="w-full h-auto object-contain" />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-ivad-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivad-blue"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-ivad-blue hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
