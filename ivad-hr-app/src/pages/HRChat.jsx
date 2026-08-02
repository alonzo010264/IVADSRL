import { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const HRChat = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'hr',
      text: '¡Saludos! 👋 Bienvenido al canal directo con el Departamento de Recursos Humanos de IVAD SRL.\n\nUn oficial de Gestión Humana te responderá a la brevedad. ¿En qué podemos ayudarte hoy?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('es-ES')
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userText = inputValue.trim();
    const newMsgObj = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMsgObj]);
    setInputValue('');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl flex flex-col h-screen pb-20">
        
        {/* Header Oficial RR.HH. Humano */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-[72px] z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition">
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center gap-3 ml-2 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#1c2c4c] border-2 border-[#d4af37] flex items-center justify-center shadow-xs">
                <UserCheck size={20} className="text-[#d4af37]" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Atención Recursos Humanos</h2>
                <p className="text-[11px] text-amber-200 font-medium">Oficina Central de Gestión Humana IVAD SRL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs leading-relaxed whitespace-pre-wrap ${
                  isMe 
                    ? 'bg-[#1c2c4c] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {!isMe && (
                    <div className="font-bold text-[10px] text-[#1c2c4c] mb-1">
                      Recursos Humanos IVAD
                    </div>
                  )}
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje para Recursos Humanos..."
            className="flex-1 p-3 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
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
