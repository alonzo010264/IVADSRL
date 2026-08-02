import { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { getMimiResponse } from '../utils/mimiAI';

const HRChat = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'hr',
      text: '¡Hola! 👋 Soy Mimi, tu Asistente de Soporte IA e Inteligencia Corporativa de IVAD SRL.\n\n¿En qué puedo ayudarte hoy? Puedes preguntarme sobre vacaciones, permisos, nómina, el uso de la Radio IVAD o cualquier inquietud.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('es-ES')
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const userText = inputValue.trim();
    const newMsgObj = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    const updatedMessages = [...messages, newMsgObj];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Obtener respuesta inteligente de Mimi usando OpenRouter AI
      const mimiReplyText = await getMimiResponse(updatedMessages, userText, currentUser);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'hr',
          text: mimiReplyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error("Error obteniendo respuesta de Mimi:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'hr',
          text: '¡Hola! Tuve un pequeño contratiempo de conexión, pero dime en qué puedo orientarte sobre IVAD Connect.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl flex flex-col h-screen pb-20">
        
        {/* Header Oficial Mimi Soporte IA */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-[72px] z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition">
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center gap-3 ml-2 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] to-amber-200 border-2 border-white flex items-center justify-center shadow-xs relative">
                <img src="/logo.png" alt="Mimi" className="w-full h-full object-cover rounded-full" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h2 className="font-bold text-sm flex items-center gap-1.5">
                  Mimi <Sparkles size={14} className="text-[#d4af37]" />
                </h2>
                <p className="text-[11px] text-amber-200 font-medium">Asistente IA de Soporte & RR.HH. IVAD SRL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isMe = msg.sender === 'user';
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs leading-relaxed whitespace-pre-wrap ${
                  isMe 
                    ? 'bg-[#1c2c4c] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {!isMe && (
                    <div className="font-bold text-[10px] text-[#1c2c4c] mb-1 flex items-center gap-1">
                      <Bot size={12} className="text-[#d4af37]" /> Mimi (Soporte IA)
                    </div>
                  )}
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-400 italic bg-white p-3 rounded-2xl w-max border border-gray-100">
              <Sparkles size={14} className="animate-spin text-[#d4af37]" />
              <span>Mimi está escribiendo una respuesta...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu consulta a Mimi..."
            className="flex-1 p-3 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-[#1c2c4c] text-white rounded-2xl hover:bg-blue-950 transition disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default HRChat;
