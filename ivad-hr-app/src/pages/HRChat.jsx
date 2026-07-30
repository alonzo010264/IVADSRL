import { useState } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'hr',
      text: '¡Saludos!\nBienvenido al chat con Recursos Humanos. ¿En qué podemos ayudarte hoy?',
      time: '09:30 a.m.',
      date: '21/05/2024'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Hola, buen día.',
      time: '09:32 a.m.',
      status: 'read'
    },
    {
      id: 3,
      sender: 'user',
      text: 'Quisiera saber cómo solicitar vacaciones.',
      time: '09:33 a.m.',
      status: 'read'
    },
    {
      id: 4,
      sender: 'hr',
      text: 'Con gusto te ayudamos.\nPuedes realizar tu solicitud desde la opción "Solicitudes" en el menú principal, luego selecciona "Vacaciones" y completa el formulario.',
      time: '09:35 a.m.'
    },
    {
      id: 5,
      sender: 'user',
      text: 'Perfecto, muchas gracias.',
      time: '09:36 a.m.',
      status: 'read'
    },
    {
      id: 6,
      sender: 'hr',
      text: '¡De nada! Estamos aquí para apoyarte.\nSi tienes alguna otra consulta, no dudes en escribirnos.',
      time: '10:01 a.m.',
      date: '22/05/2024'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: 'user',
        text: inputValue,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'sent'
      }
    ]);
    setInputValue('');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col h-screen pb-20">
        
        {/* Header Específico del Chat */}
        <div className="bg-[#0b1b3d] text-white p-4 sticky top-[72px] z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1 text-center pr-8">
              <h2 className="font-bold text-lg">Chat con RR.HH.</h2>
              <div className="flex items-center justify-center text-xs text-gray-300">
                <div className="w-2 h-2 rounded-full bg-[#4caf50] mr-2"></div>
                Departamento de Recursos Humanos
              </div>
            </div>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const showDate = msg.date && (index === 0 || messages[index - 1].date !== msg.date);
            
            return (
              <div key={msg.id} className="flex flex-col">
                
                {/* Etiqueta de Fecha */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white border border-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm font-medium">
                      {msg.date}
                    </span>
                  </div>
                )}
                
                {/* Burbuja de mensaje */}
                <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                  <div className={`rounded-2xl p-4 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#e8f3ef] text-gray-800 rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.sender === 'hr' && index > 0 && messages[index-1].sender !== 'hr' && (
                       <div className="font-bold text-[#0b1b3d] mb-1 text-sm">RR.HH.</div>
                    )}
                    <p className="text-[15px] whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className="flex justify-end items-center gap-1 mt-2">
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                      {msg.sender === 'user' && (
                        <div className="flex">
                          {/* Doble check (visto) */}
                          <svg className="w-3 h-3 text-[#0b1b3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {msg.status === 'read' && (
                            <svg className="w-3 h-3 text-[#0b1b3d] -ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>

        {/* Input de Mensaje */}
        <div className="bg-white p-3 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-white border border-gray-200 rounded-full py-3 px-5 text-[15px] shadow-sm focus:outline-none focus:border-[#0b1b3d] focus:ring-1 focus:ring-[#0b1b3d]"
            />
            <button 
              type="submit" 
              className="bg-[#0b1b3d] text-white w-12 h-12 rounded-full flex justify-center items-center shrink-0 shadow-md hover:bg-[#152240] transition-colors"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default HRChat;
