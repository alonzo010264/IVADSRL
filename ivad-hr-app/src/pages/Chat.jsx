import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreVertical, Paperclip, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const Chat = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar chat (buscar sesión activa o cargar mensaje inicial)
  useEffect(() => {
    const initChat = async () => {
      if (!currentUser) return;
      
      // Buscar si el empleado ya tiene una sesión abierta
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('employee_id', currentUser.id)
        .in('status', ['waiting', 'active'])
        .single();
        
      if (session) {
        setSessionId(session.id);
        // Cargar mensajes existentes
        const { data: msgData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true });
          
        if (msgData) {
          const formatted = msgData.map(m => formatMsg(m));
          setMessages(formatted);
        }
      } else {
        // Mostrar mensaje por defecto si no hay sesión
        setMessages([{
          id: 'sys-1',
          sender: 'system',
          text: 'Gracias por escribir a Soporte IVAD. Envíanos tu consulta y en un momento te atenderemos.',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isMe: false,
          isSystemAlert: false
        }]);
      }
    };
    initChat();
  }, [currentUser]);

  // Suscribirse a mensajes nuevos
  useEffect(() => {
    if (!sessionId) return;
    
    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        const newMsg = payload.new;
        // Solo agregar si no es mío (los míos ya los agregué al enviarlos para que sea instantáneo)
        if (newMsg.sender_id !== currentUser.id) {
          setMessages(prev => [...prev, formatMsg(newMsg)]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, currentUser]);

  const formatMsg = (m) => {
    const timeString = new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return {
      id: m.id,
      sender: m.sender_name,
      text: m.text,
      time: timeString,
      isMe: m.sender_id === currentUser.id,
      isSystemAlert: m.sender_role === 'system_alert',
      isAgent: m.sender_role === 'agent'
    };
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const textToSend = newMessage;
    setNewMessage('');
    
    // 1. Mostrar localmente de inmediato
    const tempId = `temp-${Date.now()}`;
    const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setMessages(prev => [...prev, {
      id: tempId,
      sender: currentUser.name,
      text: textToSend,
      time: timeString,
      isMe: true
    }]);

    let activeSessionId = sessionId;

    // 2. Si no hay sesión, crearla
    if (!activeSessionId) {
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert([{
          employee_id: currentUser.id,
          employee_name: currentUser.name,
          employee_dept: currentUser.department || 'General'
        }])
        .select()
        .single();
        
      if (newSession) {
        activeSessionId = newSession.id;
        setSessionId(newSession.id);
      }
    }

    // 3. Enviar mensaje a la BD
    if (activeSessionId) {
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: activeSessionId,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          sender_role: 'employee',
          text: textToSend
        }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <div className="bg-[#0b1c3c] text-white px-4 py-4 flex items-center justify-between shadow-md relative z-10 shrink-0 pt-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center -ml-1">
              <img src="/logo.png" alt="IVAD" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight flex items-center gap-1.5">
                Soporte IVAD
                <BadgeCheck size={18} className="text-[#d4af37] fill-white/10" />
              </h1>
              <p className="text-[11px] text-[#d4af37] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                En línea
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] custom-scrollbar">
        <div className="text-center text-xs text-gray-400 my-4">Hoy</div>
        
        {messages.map((msg) => {
          if (msg.isSystemAlert) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs py-1.5 px-4 rounded-full font-medium shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl p-3 shadow-sm relative ${
                  msg.isMe 
                    ? 'bg-[#0b1c3c] text-white rounded-tr-sm' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                }`}
              >
                {msg.isAgent && (
                  <div className="flex items-center gap-1 mb-1 border-b border-gray-100 pb-1">
                    <span className="text-[10px] font-bold text-[#1c2c4c]">{msg.sender}</span>
                    <BadgeCheck size={12} className="text-[#d4af37]" />
                  </div>
                )}
                <p className="text-sm leading-snug">{msg.text}</p>
                <span className={`text-[9px] block text-right mt-1.5 ${msg.isMe ? 'text-white/60' : 'text-gray-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 pb-8 shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto relative">
          <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <Paperclip size={22} />
          </button>
          
          <div className="flex-1 bg-gray-100 rounded-[1.5rem] relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 max-h-32 text-sm text-gray-800"
              rows={1}
              style={{ minHeight: '44px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="w-11 h-11 bg-[#d4af37] text-white rounded-full flex items-center justify-center shrink-0 shadow-md hover:bg-[#c8985c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chat;
