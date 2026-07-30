import { useState, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Send, CheckCircle2, User, LogOut, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  // Cargar sesiones de chat al iniciar
  useEffect(() => {
    fetchSessions();
    
    // Suscribirse a nuevas sesiones
    const channel = supabase
      .channel('public:chat_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, (payload) => {
        fetchSessions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
      
    if (data) setChats(data);
  };

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', activeChat.id)
        .order('created_at', { ascending: true });
        
      if (data) setMessages(data);
    };

    fetchMessages();

    // Marcar sesión como active y asignar agente si estaba waiting
    if (activeChat.status === 'waiting') {
      const joinChat = async () => {
        await supabase
          .from('chat_sessions')
          .update({ status: 'active', agent_id: currentUser.id, agent_name: currentUser.name })
          .eq('id', activeChat.id);
          
        // Enviar alerta de sistema de que el agente se unió
        await supabase
          .from('chat_messages')
          .insert([{
            session_id: activeChat.id,
            sender_id: 'system',
            sender_name: 'System',
            sender_role: 'system_alert',
            text: `${currentUser.name} se ha unido al chat.`
          }]);
      };
      joinChat();
    }

    // Suscribirse a los mensajes de este chat
    const channel = supabase
      .channel(`chat_${activeChat.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `session_id=eq.${activeChat.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, currentUser]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const textToSend = newMessage;
    setNewMessage('');

    // Mostrar optimísticamente
    const timeString = new Date().toISOString();
    setMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      text: textToSend,
      sender_role: 'agent',
      created_at: timeString
    }]);

    await supabase
      .from('chat_messages')
      .insert([{
        session_id: activeChat.id,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_role: 'agent',
        text: textToSend
      }]);
      
    await supabase
      .from('chat_sessions')
      .update({ updated_at: timeString })
      .eq('id', activeChat.id);
  };

  const handleResolve = async () => {
    if (!activeChat) return;
    
    await supabase
      .from('chat_sessions')
      .update({ status: 'resolved' })
      .eq('id', activeChat.id);
      
    await supabase
      .from('chat_messages')
      .insert([{
        session_id: activeChat.id,
        sender_id: 'system',
        sender_name: 'System',
        sender_role: 'system_alert',
        text: `El chat ha sido marcado como resuelto por ${currentUser.name}.`
      }]);
      
    setActiveChat(null);
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
                {chat.employee_name ? chat.employee_name.charAt(0) : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{chat.employee_name}</h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(chat.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate pr-2">
                    {chat.status === 'waiting' ? 'Esperando agente...' : `Atendido por ${chat.agent_name || 'Agente'}`}
                  </p>
                  {chat.status === 'waiting' && (
                    <span className="bg-red-500 w-2.5 h-2.5 rounded-full shrink-0"></span>
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
                  {activeChat.employee_name ? activeChat.employee_name.charAt(0) : '?'}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 leading-tight">{activeChat.employee_name}</span>
                  <span className="text-xs text-gray-500">Depto: {activeChat.employee_dept}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleResolve}
                  className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-200 transition-colors"
                >
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
              
              {messages.map((msg) => {
                if (msg.sender_role === 'system_alert') {
                  return (
                    <div key={msg.id} className="flex justify-center mb-6">
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs py-1.5 px-4 rounded-full font-medium shadow-sm">
                        {msg.text}
                      </div>
                    </div>
                  );
                }
                
                const isAgent = msg.sender_role === 'agent';
                
                return (
                  <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[70%] rounded-2xl p-3 shadow-sm relative ${
                        isAgent 
                          ? 'bg-[#0b1c3c] text-white rounded-tr-sm' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className={`text-[10px] block text-right mt-1.5 ${isAgent ? 'text-white/60' : 'text-gray-400'}`}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
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
