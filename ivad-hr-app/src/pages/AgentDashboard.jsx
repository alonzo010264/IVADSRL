import { useState } from 'react';
import { Search, MoreVertical, Paperclip, Send, CheckCircle2, User, LogOut, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Datos mockeados de chats entrantes
  const [chats] = useState([
    {
      id: 1,
      employeeName: 'Juan Pérez',
      lastMessage: 'Tengo un problema con mis vacaciones',
      time: '10:45',
      unread: 2,
      department: 'Ventas',
      status: 'waiting'
    },
    {
      id: 2,
      employeeName: 'Ana Gómez',
      lastMessage: '¿Cuándo pagan el bono?',
      time: '09:30',
      unread: 0,
      department: 'Almacén',
      status: 'active'
    }
  ]);

  // Mensajes mockeados del chat activo
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, tengo una duda con mi solicitud de vacaciones.', sender: 'employee', time: '10:43' },
    { id: 2, text: 'El sistema dice que fue rechazada pero mi gerente me dijo que sí.', sender: 'employee', time: '10:45' }
  ]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setMessages([...messages, {
      id: Date.now(),
      text: newMessage,
      sender: 'agent',
      time: timeString
    }]);
    
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* PANEL IZQUIERDO (Lista de Chats) */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-white border-r border-gray-200 flex flex-col h-full z-10">
        
        {/* Header Perfil del Agente */}
        <div className="bg-[#0b1c3c] text-white p-4 flex items-center justify-between shrink-0 h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
              <User size={20} className="text-[#d4af37]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight">{currentUser?.name || 'Agente IVAD'}</span>
              <span className="text-[10px] text-[#d4af37]">En línea (Soporte)</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Cerrar sesión">
            <LogOut size={20} />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-3 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar chat o empleado..." 
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Lista de Chats */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center gap-3 p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                activeChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
                {chat.employeeName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{chat.employeeName}</h3>
                  <span className={`text-[10px] ${chat.unread > 0 ? 'text-[#0b1c3c] font-bold' : 'text-gray-400'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate pr-2">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-[#d4af37] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* PANEL DERECHO (Área de Mensajes) */}
      <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] relative">
        
        {activeChat ? (
          <>
            {/* Header del Chat Activo */}
            <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 h-16 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  {activeChat.employeeName.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 leading-tight">{activeChat.employeeName}</span>
                  <span className="text-xs text-gray-500">Depto: {activeChat.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-200 transition-colors">
                  <CheckCircle2 size={14} />
                  Marcar Resuelto
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Notificación de Sistema (Agente unido) */}
              <div className="flex justify-center mb-6">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs py-1.5 px-4 rounded-full font-medium shadow-sm">
                  {currentUser?.name || 'Agente'} se ha unido al chat.
                </div>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[70%] rounded-2xl p-3 shadow-sm relative ${
                      msg.sender === 'agent' 
                        ? 'bg-[#0b1c3c] text-white rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] block text-right mt-1.5 ${msg.sender === 'agent' ? 'text-white/60' : 'text-gray-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Mensaje */}
            <div className="bg-[#f0f2f5] p-4 shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip size={22} />
                </button>
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje para el empleado..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 py-2"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-[#d4af37] text-white rounded-lg flex items-center justify-center hover:bg-[#c8985c] transition-colors disabled:opacity-50"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Estado Vacío */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <MessageSquare size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-500 mb-2">IVAD Connect Support</h2>
            <p className="text-sm">Selecciona una conversación del panel izquierdo para comenzar a responder.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AgentDashboard;
