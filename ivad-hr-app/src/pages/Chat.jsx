import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreVertical, Paperclip, Search, User, CheckCheck, Lock, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';
import { VerificationBadge } from '../components/VerificationBadge';

const Chat = () => {
  const navigate = useNavigate();
  const { currentUser, employees } = useEmployees();
  const messagesEndRef = useRef(null);

  // Canal Oficial de Soporte IVAD SRL (Siempre en primer lugar con Insignia Dorada)
  const SOPORTE_CONTACT = {
    id: 'soporte-ivad-official',
    name: 'Soporte IVAD SRL',
    role: 'Soporte Técnico & Atención al Colaborador',
    department: 'Recursos Humanos & Sistemas',
    avatar: '/logo.png',
    verification_status: 'verificado',
    verification_type: 'dorada',
    is_admin: true,
    isSupportChannel: true
  };

  const otherEmployees = [
    SOPORTE_CONTACT,
    ...employees.filter(emp => emp.id?.toString() !== currentUser?.id?.toString())
  ];
  
  // En móvil/teléfono NO entra a ningún chat automáticamente por defecto
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState({});
  const [newMessageText, setNewMessageText] = useState('');

  // Autoscroll al final del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  // Cargar mensajes directos reales desde Supabase y suscribirse en TIEMPO REAL
  useEffect(() => {
    if (!currentUser || !selectedContact) return;

    const fetchDirectMessages = async () => {
      const { data } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: data.map(m => ({
            id: m.id,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: m.sender_id.toString() === currentUser.id.toString()
          }))
        }));
      } else {
        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: []
        }));
      }
    };

    fetchDirectMessages();

    // Suscripción en Tiempo Real Supabase
    const channel = supabase
      .channel(`direct_chat_${currentUser.id}_${selectedContact.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        const newMsg = payload.new;
        if (
          (newMsg.sender_id.toString() === selectedContact.id.toString() && newMsg.receiver_id.toString() === currentUser.id.toString())
        ) {
          setMessages(prev => ({
            ...prev,
            [selectedContact.id]: [
              ...(prev[selectedContact.id] || []),
              {
                id: newMsg.id,
                text: newMsg.message,
                time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false
              }
            ]
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedContact, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedContact) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgObj = {
      id: Date.now().toString(),
      text: textToSend,
      time: timeNow,
      isMe: true
    };

    // Mostrar de inmediato en la UI
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsgObj]
    }));

    // Guardar en Supabase Cloud
    await supabase.from('direct_messages').insert([{
      sender_id: currentUser?.id,
      receiver_id: selectedContact.id,
      message: textToSend,
      created_at: new Date().toISOString()
    }]);
  };

  const filteredContacts = otherEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeMessages = selectedContact ? (messages[selectedContact.id] || []) : [];

  // Helper para renderizar la insignia según estatus y tipo adquirido (con tooltip)
  const renderBadge = (emp) => {
    const isVerified = emp.verification_status === 'verificado' || emp.is_admin || emp.isSupportChannel;
    if (!isVerified) return null;

    const badgeType = (emp.verification_type === 'dorada' || emp.is_admin || emp.isSupportChannel) ? 'dorada' : 'azul';
    return <VerificationBadge type={badgeType} size={16} />;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-800 pb-16 md:pb-0">
      
      {/* COLUMNA IZQUIERDA: PANTALLA PRINCIPAL EN TELÉFONO DE SELECCIÓN DE CHAT */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header Lista de Empleados */}
        <div className="bg-[#1c2c4c] text-white p-4 pt-10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 text-white hover:bg-white/10 rounded-full md:hidden">
              <ArrowLeft size={22} />
            </button>
            <h1 className="font-bold text-base">Chat Interno / Ayuda</h1>
          </div>
          <span className="text-[11px] font-bold text-[#d4af37] bg-white/10 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
            {otherEmployees.length} Canales
          </span>
        </div>

        {/* Buscador de Empleados */}
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar compañero o Soporte IVAD..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none"
            />
          </div>
        </div>

        {/* Lista de Contactos (Soporte IVAD de primero con Insignia Dorada + Empleados Verificados) */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filteredContacts.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-8">No se encontraron canales.</p>
          ) : (
            filteredContacts.map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelectedContact(emp)}
                className={`w-full p-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedContact?.id === emp.id ? 'bg-blue-50/60 border-l-4 border-[#1c2c4c]' : ''
                } ${emp.isSupportChannel ? 'bg-blue-50/30' : ''}`}
              >
                {/* Avatar con anillo dorado */}
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-full border-2 p-[2px] shadow-sm ${emp.isSupportChannel ? 'border-[#d4af37] bg-[#1c2c4c]' : 'border-[#d4af37] bg-[#1c2c4c]'}`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                      {emp.avatar ? (
                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-contain" />
                      ) : (
                        <User size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute bottom-0 right-0"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    {/* Nombre del colaborador o Soporte con Insignia correspondiente */}
                    <h3 className="font-bold text-[#1c2c4c] text-xs truncate flex items-center gap-1.5">
                      <span>{emp.name}</span>
                      {renderBadge(emp)}
                    </h3>
                    <span className="text-[9px] text-gray-400 font-medium">En línea</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">{emp.role || emp.department || 'Colaborador IVAD'}</p>
                </div>
              </button>
            ))
          )}
        </div>

      </div>

      {/* COLUMNA DERECHA: VENTANA DE CHAT ACTIVO (Estilo WhatsApp) */}
      <div className={`flex-1 flex flex-col h-full bg-[#f4f6f9] ${!selectedContact ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        
        {!selectedContact ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-[#1c2c4c]/10 text-[#1c2c4c] flex items-center justify-center mx-auto mb-3">
              <Headphones size={32} />
            </div>
            <h2 className="font-bold text-[#1c2c4c] text-base">Selecciona un canal para chatear</h2>
            <p className="text-xs text-gray-500 mt-1">Elige entre Soporte IVAD SRL o un colaborador para iniciar la conversación.</p>
          </div>
        ) : (
          <>
            {/* Header del Chat Activo */}
            <div className="bg-[#1c2c4c] text-white px-4 py-3 flex items-center justify-between shadow-sm shrink-0 pt-8 md:pt-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedContact(null)} className="p-1.5 text-white hover:bg-white/10 rounded-full md:hidden">
                  <ArrowLeft size={20} />
                </button>

                <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-white p-[1.5px] overflow-hidden shrink-0">
                  {selectedContact.avatar ? (
                    <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      <User size={18} />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                    <span>{selectedContact.name}</span>
                    {renderBadge(selectedContact)}
                  </h2>
                  <p className="text-[10px] text-[#d4af37] font-semibold">{selectedContact.role} • En línea</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Banner de Privacidad y Cifrado */}
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-center flex items-center justify-center gap-2 text-[11px] text-amber-900 shrink-0">
              <Lock size={13} className="text-[#1c2c4c] shrink-0" />
              <span>
                Conversación cifrada. Los mensajes se guardan de forma privada y segura en IVAD Connect únicamente entre los participantes autorizados.
              </span>
            </div>

            {/* Mensajes en Tiempo Real */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {activeMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  {selectedContact.isSupportChannel 
                    ? "Bienvenido a Soporte IVAD SRL. Escribe tu consulta a continuación para ayudarte."
                    : "No hay mensajes guardados en este chat. Escribe el primer mensaje a continuación."}
                </div>
              ) : (
                activeMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3 shadow-sm relative ${
                        msg.isMe 
                          ? 'bg-[#1c2c4c] text-white rounded-tr-sm' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={`text-[9px] ${msg.isMe ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                        {msg.isMe && <CheckCheck size={12} className="text-[#d4af37]" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensaje */}
            <div className="bg-white border-t border-gray-200 p-3 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
                <button type="button" className="p-2 text-gray-400 hover:text-[#1c2c4c] transition-colors shrink-0">
                  <Paperclip size={20} />
                </button>

                <input 
                  type="text" 
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={`Escribe un mensaje para ${selectedContact.name.split(' ')[0]}...`}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-gray-800"
                />

                <button 
                  type="submit" 
                  disabled={!newMessageText.trim()}
                  className="w-10 h-10 bg-[#1c2c4c] text-[#d4af37] rounded-full flex items-center justify-center shrink-0 shadow-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>

          </>
        )}

      </div>

    </div>
  );
};

export default Chat;
