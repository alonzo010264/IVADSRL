import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreVertical, Paperclip, Search, User, CheckCheck, Check, Lock, Headphones, FileText, Download, X, Eye, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';
import { VerificationBadge } from '../components/VerificationBadge';

const Chat = () => {
  const navigate = useNavigate();
  const { currentUser, employees } = useEmployees();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Canal Oficial de Soporte IVAD SRL
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
  
  // Estado local del Chat
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState({});
  const [newMessageText, setNewMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Modal de Eliminación de Mensajes
  const [selectedMsgToDelete, setSelectedMsgToDelete] = useState(null);
  const [deletedForMeIds, setDeletedForMeIds] = useState(new Set());

  // Lightbox / Vista Previa Modal de Imagen
  const [activePreviewImage, setActivePreviewImage] = useState(null);

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
        // Marcar automáticamente como leídos los mensajes que recibo
        const unreadIds = data
          .filter(m => m.receiver_id.toString() === currentUser.id.toString() && !m.is_read)
          .map(m => m.id);

        if (unreadIds.length > 0) {
          await supabase
            .from('direct_messages')
            .update({ is_read: true })
            .in('id', unreadIds);
        }

        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: data.map(m => ({
            id: m.id,
            text: m.message,
            mediaUrl: m.media_url || null,
            mediaType: m.media_type || (m.media_url ? (m.media_url.startsWith('data:image') ? 'image' : 'document') : null),
            fileName: m.file_name || 'Archivo adjunto',
            isRead: m.is_read || false,
            createdAt: m.created_at,
            isDeletedForEveryone: m.is_deleted_for_everyone || false,
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
        event: '*',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id.toString() === selectedContact.id.toString() && newMsg.receiver_id.toString() === currentUser.id.toString()) ||
            (newMsg.sender_id.toString() === currentUser.id.toString() && newMsg.receiver_id.toString() === selectedContact.id.toString())
          ) {
            setMessages(prev => ({
              ...prev,
              [selectedContact.id]: [
                ...(prev[selectedContact.id] || []).filter(m => m.id !== newMsg.id.toString()),
                {
                  id: newMsg.id,
                  text: newMsg.message,
                  mediaUrl: newMsg.media_url || null,
                  mediaType: newMsg.media_type || (newMsg.media_url ? (newMsg.media_url.startsWith('data:image') ? 'image' : 'document') : null),
                  fileName: newMsg.file_name || 'Archivo adjunto',
                  isRead: newMsg.is_read || false,
                  createdAt: newMsg.created_at,
                  isDeletedForEveryone: newMsg.is_deleted_for_everyone || false,
                  time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isMe: newMsg.sender_id.toString() === currentUser.id.toString()
                }
              ]
            }));
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new;
          setMessages(prev => ({
            ...prev,
            [selectedContact.id]: (prev[selectedContact.id] || []).map(m => 
              m.id.toString() === updatedMsg.id.toString() 
                ? { 
                    ...m, 
                    isRead: updatedMsg.is_read, 
                    text: updatedMsg.is_deleted_for_everyone ? '🚫 Este mensaje fue eliminado' : updatedMsg.message,
                    isDeletedForEveryone: updatedMsg.is_deleted_for_everyone
                  }
                : m
            )
          }));
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id;
          setMessages(prev => ({
            ...prev,
            [selectedContact.id]: (prev[selectedContact.id] || []).filter(m => m.id.toString() !== deletedId.toString())
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedContact, currentUser]);

  // Enviar mensaje de texto
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedContact) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgObj = {
      id: Date.now().toString(),
      text: textToSend,
      mediaUrl: null,
      mediaType: null,
      isRead: false,
      createdAt: new Date().toISOString(),
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
      is_read: false,
      created_at: new Date().toISOString()
    }]);
  };

  // Adjuntar y Enviar Imagen o Documento (SIN texto automático de "Imagen adjunta")
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedContact) return;

    setIsUploading(true);

    try {
      // Convertir archivo a Base64 para vista previa inmediata
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const isImage = file.type.startsWith('image/');
      const mediaType = isImage ? 'image' : 'document';
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Solo si el usuario escribió texto como comentario se incluye texto
      const textComment = newMessageText.trim();
      setNewMessageText('');

      const newMsgObj = {
        id: Date.now().toString(),
        text: textComment, // Si no escribió comentario, queda totalmente vacío (estilo WhatsApp)
        mediaUrl: base64Data,
        mediaType: mediaType,
        fileName: file.name,
        isRead: false,
        createdAt: new Date().toISOString(),
        time: timeNow,
        isMe: true
      };

      // Mostrar de inmediato en la UI
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsgObj]
      }));

      // Guardar en Supabase Cloud con metadatos del archivo
      await supabase.from('direct_messages').insert([{
        sender_id: currentUser?.id,
        receiver_id: selectedContact.id,
        message: textComment,
        media_url: base64Data,
        media_type: mediaType,
        file_name: file.name,
        is_read: false,
        created_at: new Date().toISOString()
      }]);

    } catch (err) {
      console.error("Error subiendo archivo:", err);
      alert("Hubo un problema al adjuntar el archivo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Eliminar solo para mí
  const handleDeleteForMe = (msgId) => {
    setDeletedForMeIds(prev => new Set(prev).add(msgId.toString()));
    setSelectedMsgToDelete(null);
  };

  // Eliminar para todos (Solo si es mi mensaje y el destinatario NO lo ha visto aún)
  const handleDeleteForEveryone = async (msg) => {
    if (!msg.isMe) return;
    if (msg.isRead) {
      alert("No se puede eliminar para todos porque la otra persona ya vio el mensaje.");
      return;
    }

    // Actualizar en Supabase para que a la otra persona le aparezca "Este mensaje fue eliminado"
    await supabase
      .from('direct_messages')
      .update({ message: '🚫 Este mensaje fue eliminado', media_url: null, media_type: null, is_deleted_for_everyone: true })
      .eq('id', msg.id);

    // Actualizar estado local
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: (prev[selectedContact.id] || []).map(m => 
        m.id.toString() === msg.id.toString() 
          ? { ...m, text: '🚫 Este mensaje fue eliminado', mediaUrl: null, mediaType: null, isDeletedForEveryone: true }
          : m
      )
    }));

    setSelectedMsgToDelete(null);
  };

  const filteredContacts = otherEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeMessages = (selectedContact ? (messages[selectedContact.id] || []) : [])
    .filter(m => !deletedForMeIds.has(m.id.toString()));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-800 pb-16 md:pb-0">
      
      {/* COLUMNA IZQUIERDA: SELECCIÓN DE CHAT EN MÓVIL/DESKTOP */}
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

        {/* Buscador */}
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

        {/* Lista de Contactos */}
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
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] overflow-hidden shadow-sm flex items-center justify-center">
                    {emp.avatar ? (
                      <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover scale-[1.25]" />
                    ) : (
                      <User size={22} className="text-white" />
                    )}
                  </div>
                  <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute bottom-0 right-0"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-[#1c2c4c] text-xs truncate flex items-center gap-1.5">
                      <span>{emp.name}</span>
                      <VerificationBadge emp={emp} size={16} />
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

                <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] overflow-hidden shrink-0 flex items-center justify-center">
                  {selectedContact.avatar ? (
                    <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover scale-[1.25]" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                    <span>{selectedContact.name}</span>
                    <VerificationBadge emp={selectedContact} size={16} />
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
                Conversación cifrada. Los mensajes se guardan de forma privada y segura en IVAD Connect.
              </span>
            </div>

            {/* Lista de Mensajes con Formato WhatsApp Limpio */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {activeMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  {selectedContact.isSupportChannel 
                    ? "Bienvenido a Soporte IVAD SRL. Escribe tu consulta a continuación."
                    : "No hay mensajes guardados en este chat. Escribe el primer mensaje a continuación."}
                </div>
              ) : (
                activeMessages.map((msg) => (
                  <div key={msg.id} className={`flex group relative ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    
                    {/* Botón de opciones/eliminar mensaje */}
                    {!msg.isDeletedForEveryone && (
                      <button 
                        onClick={() => setSelectedMsgToDelete(msg)}
                        className={`absolute top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-black/40 text-white hover:bg-black/60 ${
                          msg.isMe ? '-left-7' : '-right-7'
                        }`}
                        title="Opciones de mensaje"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                    <div 
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-2.5 shadow-sm relative ${
                        msg.isMe 
                          ? 'bg-[#1c2c4c] text-white rounded-tr-sm' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                      } ${msg.isDeletedForEveryone ? 'italic text-gray-400 opacity-75' : ''}`}
                    >
                      {/* VISTA PREVIA DE IMAGEN (SIN TEXTO FORZADO ABAJO) */}
                      {msg.mediaType === 'image' && msg.mediaUrl && !msg.isDeletedForEveryone && (
                        <div 
                          onClick={() => setActivePreviewImage(msg.mediaUrl)}
                          className="relative rounded-xl overflow-hidden cursor-pointer group/img border border-white/20 bg-black/10 flex items-center justify-center"
                        >
                          <img 
                            src={msg.mediaUrl} 
                            alt="Imagen adjunta" 
                            className="w-full h-auto max-h-64 object-cover group-hover/img:scale-105 transition-transform duration-200" 
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                            <Eye size={18} /> Ver Completa
                          </div>
                        </div>
                      )}

                      {/* TARJETA DE DOCUMENTO ADJUNTO */}
                      {msg.mediaType === 'document' && msg.mediaUrl && !msg.isDeletedForEveryone && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/20 my-1">
                          <FileText size={24} className={msg.isMe ? 'text-[#d4af37]' : 'text-[#1c2c4c]'} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{msg.fileName}</p>
                            <p className="text-[9px] opacity-75">Documento adjunto</p>
                          </div>
                          <a 
                            href={msg.mediaUrl} 
                            download={msg.fileName}
                            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition shrink-0"
                            title="Descargar archivo"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      )}

                      {/* COMENTARIO / TEXTO DEL MENSAJE (Solo si existe texto escrito por el usuario) */}
                      {msg.text && (
                        <p className="text-xs leading-relaxed break-words px-1 pt-1">{msg.text}</p>
                      )}

                      {/* HORA Y PALOMITAS DEL VISTO (WhatsApp Double Check) */}
                      <div className="flex items-center justify-end gap-1 mt-1 px-1">
                        <span className={`text-[9px] ${msg.isMe ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                        
                        {/* Indicadores de Estado de Lectura / Visto */}
                        {msg.isMe && !msg.isDeletedForEveryone && (
                          msg.isRead ? (
                            <CheckCheck size={14} className="text-[#1d9bf0] font-bold" title="Visto" />
                          ) : (
                            <CheckCheck size={14} className="text-gray-400/80" title="Entregado" />
                          )
                        )}
                      </div>

                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensaje y Adjuntos */}
            <div className="bg-white border-t border-gray-200 p-3 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />

                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 text-gray-400 hover:text-[#1c2c4c] hover:bg-gray-100 rounded-full transition-colors shrink-0 disabled:opacity-50"
                  title="Adjuntar imagen o documento"
                >
                  {isUploading ? (
                    <span className="w-5 h-5 block animate-spin rounded-full border-2 border-[#1c2c4c] border-t-transparent"></span>
                  ) : (
                    <Paperclip size={20} />
                  )}
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

      {/* MODAL / POPUP DE ELIMINAR MENSAJE (Estilo WhatsApp) */}
      {selectedMsgToDelete && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-[#1c2c4c]">¿Deseas eliminar este mensaje?</h3>
              <button onClick={() => setSelectedMsgToDelete(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Aviso si la otra persona ya vio el mensaje */}
            {selectedMsgToDelete.isMe && selectedMsgToDelete.isRead && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-[11px] text-amber-800">
                <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <span>
                  El destinatario <strong>ya vio</strong> este mensaje. Solo puedes eliminarlo para ti.
                </span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              
              {/* Botón Eliminar para todos (Solo si es mi mensaje y NO ha sido leído) */}
              {selectedMsgToDelete.isMe && !selectedMsgToDelete.isRead && (
                <button
                  onClick={() => handleDeleteForEveryone(selectedMsgToDelete)}
                  className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-2xl hover:bg-red-700 transition shadow-sm"
                >
                  Eliminar para todos
                </button>
              )}

              {/* Botón Eliminar para mí (Siempre disponible) */}
              <button
                onClick={() => handleDeleteForMe(selectedMsgToDelete.id)}
                className="w-full py-3 bg-gray-100 text-[#1c2c4c] font-bold text-xs rounded-2xl hover:bg-gray-200 transition"
              >
                Eliminar para mí
              </button>

              <button
                onClick={() => setSelectedMsgToDelete(null)}
                className="w-full py-2.5 text-gray-500 font-bold text-xs hover:bg-gray-50 rounded-2xl"
              >
                Cancelar
              </button>

            </div>

          </div>
        </div>
      )}

      {/* LIGHTBOX / MODAL DE VISTA PREVIA DE IMAGEN */}
      {activePreviewImage && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[85vh] flex items-center justify-center">
            <button 
              onClick={() => setActivePreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
            
            <img 
              src={activePreviewImage} 
              alt="Vista previa completa" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
          
          <div className="mt-4 flex gap-4">
            <a 
              href={activePreviewImage} 
              download="imagen-ivad-connect.png"
              className="bg-[#d4af37] text-[#1c2c4c] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-yellow-500 transition shadow-md"
            >
              <Download size={16} /> Descargar Imagen
            </a>
            <button 
              onClick={() => setActivePreviewImage(null)}
              className="bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;
