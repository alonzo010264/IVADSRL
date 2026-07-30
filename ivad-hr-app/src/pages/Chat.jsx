import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreVertical, Paperclip, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const Chat = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: '¡Hola! Bienvenido al canal de soporte oficial de IVAD. ¿En qué podemos ayudarte hoy?',
      time: '09:00',
      isMe: false,
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setMessages([...messages, {
      id: Date.now(),
      sender: currentUser?.name || 'Yo',
      text: newMessage,
      time: timeString,
      isMe: true
    }]);
    
    setNewMessage('');
    
    // Simulate auto-reply for demo purposes
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'system',
        text: 'Hemos recibido tu mensaje. Un agente de Administración Central te responderá en breve.',
        time: timeString,
        isMe: false
      }]);
    }, 1500);
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
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] rounded-2xl p-3 shadow-sm relative ${
                msg.isMe 
                  ? 'bg-[#0b1c3c] text-white rounded-tr-sm' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-snug">{msg.text}</p>
              <span className={`text-[9px] block text-right mt-1.5 ${msg.isMe ? 'text-white/60' : 'text-gray-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
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
