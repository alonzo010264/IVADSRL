import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreVertical, Paperclip, Search, User, Lock, Headphones, FileText, Download, X, Eye, Trash2, AlertCircle, BellOff, Bell, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';
import { VerificationBadge } from '../components/VerificationBadge';

const EMOJI_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

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

  // Menú de Opciones del Header (Los 3 puntitos)
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [inChatSearchTerm, setInChatSearchTerm] = useState('');
  const [showInChatSearch, setShowInChatSearch] = useState(false);

  // Reacciones & Modales
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState(null);
  const [selectedMsgToDelete, setSelectedMsgToDelete] = useState(null);
  const [deletedForMeIds, setDeletedForMeIds] = useState(new Set());

  // Lightbox / Vista Previa Modal de Imagen
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  // Sintetizador de Sonido de Notificación Web Audio
  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log("Audio notify error:", e);
    }
  };

  // Solicitar permiso de notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Autoscroll al final del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  // Cargar TODOS los mensajes directos para todos los contactos (para badges y previews en la izquierda)
  const fetchAllDirectMessages = async () => {
    if (!currentUser) return;

    const { data } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true });

    if (data) {
      const grouped = {};
      
      data.forEach(m => {
        const contactId = m.sender_id.toString() === currentUser.id.toString() 
          ? m.receiver_id.toString() 
          : m.sender_id.toString();

        if (!grouped[contactId]) grouped[contactId] = [];

        grouped[contactId].push({
          id: m.id,
          text: m.message,
          mediaUrl: m.media_url || null,
          mediaType: m.media_type || (m.media_url ? (m.media_url.startsWith('data:image') ? 'image' : 'document') : null),
          fileName: m.file_name || 'Archivo adjunto',
          reactions: Array.isArray(m.reactions) ? m.reactions : [],
          isRead: m.is_read || false,
          createdAt: m.created_at,
          isDeletedForEveryone: m.is_deleted_for_everyone || false,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: m.sender_id.toString() === currentUser.id.toString()
        });
      });

      setMessages(grouped);
    }
  };

  useEffect(() => {
    fetchAllDirectMessages();
  }, [currentUser]);

  // Marcar mensajes recibidos como leídos automáticamente cuando el chat está activo
  useEffect(() => {
    if (!currentUser || !selectedContact) return;

    const markAsRead = async () => {
      const contactMsgs = messages[selectedContact.id] || [];
      const unreadIds = contactMsgs
        .filter(m => !m.isMe && !m.isRead)
        .map(m => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('direct_messages')
          .update({ is_read: true })
          .in('id', unreadIds);

        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: (prev[selectedContact.id] || []).map(m => 
            unreadIds.includes(m.id) ? { ...m, isRead: true } : m
          )
        }));
      }
    };

    markAsRead();
  }, [selectedContact, messages, currentUser]);

  // Suscripción Global Real-Time Supabase WebSocket
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel(`global_direct_chat_${currentUser.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new;
          const isSenderMe = newMsg.sender_id.toString() === currentUser.id.toString();
          const isReceiverMe = newMsg.receiver_id.toString() === currentUser.id.toString();

          if (isSenderMe || isReceiverMe) {
            const contactId = isSenderMe ? newMsg.receiver_id.toString() : newMsg.sender_id.toString();
            
            const msgObj = {
              id: newMsg.id,
              text: newMsg.message,
              mediaUrl: newMsg.media_url || null,
              mediaType: newMsg.media_type || (newMsg.media_url ? (newMsg.media_url.startsWith('data:image') ? 'image' : 'document') : null),
              fileName: newMsg.file_name || 'Archivo adjunto',
              reactions: Array.isArray(newMsg.reactions) ? newMsg.reactions : [],
              isRead: newMsg.is_read || false,
              createdAt: newMsg.created_at,
              isDeletedForEveryone: newMsg.is_deleted_for_everyone || false,
              time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: isSenderMe
            };

            setMessages(prev => ({
              ...prev,
              [contactId]: [
                ...(prev[contactId] || []).filter(m => m.id !== newMsg.id.toString()),
                msgObj
              ]
            }));

            // Notificación sonora y Push de Navegador si me envían un mensaje
            if (isReceiverMe) {
              playNotificationSound();

              if ('Notification' in window && Notification.permission === 'granted' && !isMuted) {
                const senderObj = otherEmployees.find(e => e.id.toString() === contactId);
                const senderName = senderObj ? senderObj.name : 'Colaborador IVAD';
                const bodyText = newMsg.message || (newMsg.media_url ? '📷 Envió una imagen' : 'Envió un archivo');
                
                try {
                  const notif = new Notification(`💬 Mensaje de ${senderName}`, {
                    body: bodyText,
                    icon: senderObj?.avatar || '/logo.png',
                    badge: '/logo.png',
                    tag: `chat-msg-${contactId}`,
                    renotify: true
                  });

                  notif.onclick = () => {
                    window.focus();
                    if (senderObj) setSelectedContact(senderObj);
                  };
                } catch (err) {
                  console.log("Notification error:", err);
                }
              }
            }
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new;
          const isSenderMe = updatedMsg.sender_id.toString() === currentUser.id.toString();
          const isReceiverMe = updatedMsg.receiver_id.toString() === currentUser.id.toString();

          if (isSenderMe || isReceiverMe) {
            const contactId = isSenderMe ? updatedMsg.receiver_id.toString() : updatedMsg.sender_id.toString();
            
            setMessages(prev => ({
              ...prev,
              [contactId]: (prev[contactId] || []).map(m => 
                m.id.toString() === updatedMsg.id.toString() 
                  ? { 
                      ...m, 
                      isRead: updatedMsg.is_read, 
                      text: updatedMsg.is_deleted_for_everyone ? '🚫 Este mensaje fue eliminado' : updatedMsg.message,
                      mediaUrl: updatedMsg.is_deleted_for_everyone ? null : updatedMsg.media_url,
                      mediaType: updatedMsg.is_deleted_for_everyone ? null : updatedMsg.media_type,
                      reactions: Array.isArray(updatedMsg.reactions) ? updatedMsg.reactions : [],
                      isDeletedForEveryone: updatedMsg.is_deleted_for_everyone
                    }
                  : m
              )
            }));
          }
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id;
          setMessages(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => {
              next[k] = next[k].filter(m => m.id.toString() !== deletedId.toString());
            });
            return next;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, otherEmployees, isMuted]);

  // Helper para optimizar imágenes
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Enviar mensaje de texto
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedContact) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const { data } = await supabase.from('direct_messages').insert([{
      sender_id: currentUser?.id,
      receiver_id: selectedContact.id,
      message: textToSend,
      is_read: false,
      reactions: [],
      created_at: new Date().toISOString()
    }]).select();

    if (data && data[0]) {
      const inserted = data[0];
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [
          ...(prev[selectedContact.id] || []).filter(m => m.id !== inserted.id.toString()),
          {
            id: inserted.id,
            text: inserted.message,
            mediaUrl: null,
            mediaType: null,
            reactions: [],
            isRead: false,
            createdAt: inserted.created_at,
            time: timeNow,
            isMe: true
          }
        ]
      }));
    }
  };

  // Adjuntar e guardar archivo
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedContact) return;

    setIsUploading(true);

    try {
      const isImage = file.type.startsWith('image/');
      let fileDataUrl = '';

      if (isImage) {
        fileDataUrl = await compressImage(file);
      } else {
        fileDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      const mediaType = isImage ? 'image' : 'document';
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const textComment = newMessageText.trim();
      setNewMessageText('');

      const { data, error } = await supabase.from('direct_messages').insert([{
        sender_id: currentUser?.id,
        receiver_id: selectedContact.id,
        message: textComment,
        media_url: fileDataUrl,
        media_type: mediaType,
        file_name: file.name,
        is_read: false,
        reactions: [],
        created_at: new Date().toISOString()
      }]).select();

      if (error) {
        console.error("Error guardando adjunto en Supabase:", error);
        alert("Error al guardar el archivo.");
      } else if (data && data[0]) {
        const inserted = data[0];
        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: [
            ...(prev[selectedContact.id] || []).filter(m => m.id !== inserted.id.toString()),
            {
              id: inserted.id,
              text: inserted.message,
              mediaUrl: inserted.media_url,
              mediaType: inserted.media_type,
              fileName: inserted.file_name,
              reactions: [],
              isRead: false,
              createdAt: inserted.created_at,
              time: timeNow,
              isMe: true
            }
          ]
        }));
      }

    } catch (err) {
      console.error("Error procesando archivo:", err);
      alert("Hubo un problema al procesar el archivo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Alternar Reacción Emoji
  const handleToggleReaction = async (msg, emoji) => {
    if (!currentUser || msg.isDeletedForEveryone) return;

    let currentReactions = Array.isArray(msg.reactions) ? [...msg.reactions] : [];
    const userIdStr = currentUser.id.toString();

    const existingIndex = currentReactions.findIndex(r => r.user_id?.toString() === userIdStr && r.emoji === emoji);

    if (existingIndex > -1) {
      currentReactions.splice(existingIndex, 1);
    } else {
      currentReactions = currentReactions.filter(r => r.user_id?.toString() !== userIdStr);
      currentReactions.push({
        emoji,
        user_id: currentUser.id,
        user_name: currentUser.name
      });
    }

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: (prev[selectedContact.id] || []).map(m => 
        m.id.toString() === msg.id.toString() 
          ? { ...m, reactions: currentReactions } 
          : m
      )
    }));

    setActiveReactionPickerMsgId(null);

    await supabase
      .from('direct_messages')
      .update({ reactions: currentReactions })
      .eq('id', msg.id);
  };

  // Vaciar todos los mensajes de la conversación
  const handleClearChatHistory = () => {
    if (!selectedContact) return;
    if (window.confirm(`¿Estás seguro de vaciar todos los mensajes del chat con ${selectedContact.name}?`)) {
      const currentMsgIds = (messages[selectedContact.id] || []).map(m => m.id.toString());
      setDeletedForMeIds(prev => {
        const next = new Set(prev);
        currentMsgIds.forEach(id => next.add(id));
        return next;
      });
      setShowHeaderMenu(false);
    }
  };

  // Eliminar solo para mí
  const handleDeleteForMe = (msgId) => {
    setDeletedForMeIds(prev => new Set(prev).add(msgId.toString()));
    setSelectedMsgToDelete(null);
  };

  // Eliminar para todos
  const handleDeleteForEveryone = async (msg) => {
    if (!msg.isMe) return;
    if (msg.isRead) {
      alert("No se puede eliminar para todos porque la otra persona ya vio el mensaje.");
      return;
    }

    await supabase
      .from('direct_messages')
      .update({ message: '🚫 Este mensaje fue eliminado', media_url: null, media_type: null, reactions: [], is_deleted_for_everyone: true })
      .eq('id', msg.id);

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: (prev[selectedContact.id] || []).map(m => 
        m.id.toString() === msg.id.toString() 
          ? { ...m, text: '🚫 Este mensaje fue eliminado', mediaUrl: null, mediaType: null, reactions: [], isDeletedForEveryone: true }
          : m
      )
    }));

    setSelectedMsgToDelete(null);
  };

  const filteredContacts = otherEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const rawActiveMessages = selectedContact ? (messages[selectedContact.id] || []) : [];
  
  // Filtrar por mensajes eliminados para mí y por término de búsqueda en chat
  const activeMessages = rawActiveMessages
    .filter(m => !deletedForMeIds.has(m.id.toString()))
    .filter(m => !inChatSearchTerm.trim() || (m.text && m.text.toLowerCase().includes(inChatSearchTerm.toLowerCase())));

  // Galería de Archivos y Fotos Compartidas en esta conversación
  const sharedMediaList = rawActiveMessages.filter(m => m.mediaUrl && !m.isDeletedForEveryone);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-800 pb-16 md:pb-0">
      
      {/* COLUMNA IZQUIERDA: SELECCIÓN DE CHAT Y CANALES */}
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

        {/* Lista de Contactos con Conteo de No Leídos y Último Mensaje tipo WhatsApp */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filteredContacts.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-8">No se encontraron canales.</p>
          ) : (
            filteredContacts.map(emp => {
              const contactMsgs = messages[emp.id] || [];
              const unreadCount = contactMsgs.filter(m => !m.isMe && !m.isRead).length;
              const lastMsg = contactMsgs[contactMsgs.length - 1];

              let lastMsgSnippet = emp.role || emp.department || 'Colaborador IVAD';
              if (lastMsg) {
                if (lastMsg.isDeletedForEveryone) {
                  lastMsgSnippet = '🚫 Mensaje eliminado';
                } else if (lastMsg.text) {
                  lastMsgSnippet = (lastMsg.isMe ? 'Tú: ' : '') + lastMsg.text;
                } else if (lastMsg.mediaType === 'image') {
                  lastMsgSnippet = (lastMsg.isMe ? 'Tú: ' : '') + '📷 Imagen';
                } else if (lastMsg.mediaType === 'document') {
                  lastMsgSnippet = (lastMsg.isMe ? 'Tú: ' : '') + '📄 Documento';
                }
              }

              return (
                <button
                  key={emp.id}
                  onClick={() => { setSelectedContact(emp); setShowHeaderMenu(false); setShowInChatSearch(false); }}
                  className={`w-full p-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left relative ${
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
                        <VerificationBadge emp={emp} size={16} position="bottom" />
                      </h3>
                      {lastMsg && (
                        <span className="text-[9px] text-gray-400 font-medium shrink-0 ml-1">
                          {lastMsg.time}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-[11px] truncate flex-1 ${unreadCount > 0 ? 'font-bold text-[#1c2c4c]' : 'text-gray-500'}`}>
                        {lastMsgSnippet}
                      </p>
                      
                      {unreadCount > 0 && (
                        <span className="bg-[#d4af37] text-[#1c2c4c] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs shrink-0 animate-bounce">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* COLUMNA DERECHA: VENTANA DE CHAT ACTIVO */}
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
            <div className="bg-[#1c2c4c] text-white px-4 py-3 flex items-center justify-between shadow-sm shrink-0 pt-8 md:pt-3 z-30 relative">
              <div className="flex items-center gap-3">
                <button onClick={() => { setSelectedContact(null); setShowHeaderMenu(false); }} className="p-1.5 text-white hover:bg-white/10 rounded-full md:hidden">
                  <ArrowLeft size={20} />
                </button>

                <div 
                  onClick={() => !selectedContact.isSupportChannel && navigate(`/empleado/${selectedContact.id}`)}
                  className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                >
                  {selectedContact.avatar ? (
                    <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover scale-[1.25]" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>

                <div>
                  <h2 
                    onClick={() => !selectedContact.isSupportChannel && navigate(`/empleado/${selectedContact.id}`)}
                    className="font-bold text-sm leading-tight text-white flex items-center gap-1.5 cursor-pointer hover:underline"
                  >
                    <span>{selectedContact.name}</span>
                    <VerificationBadge emp={selectedContact} size={16} position="bottom" />
                  </h2>
                  <p className="text-[10px] text-[#d4af37] font-semibold">{selectedContact.role} • En línea</p>
                </div>
              </div>

              {/* Botón de Los 3 Puntitos con Menú Desplegable */}
              <div className="relative">
                <button 
                  onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                  className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  title="Opciones de chat"
                >
                  <MoreVertical size={20} />
                </button>

                {/* MENÚ DESPLEGABLE CON ICONOS AZUL MARINO OFICIAL DE IVAD (#1c2c4c) */}
                {showHeaderMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 text-[#1c2c4c] animate-in fade-in duration-150">
                    
                    {!selectedContact.isSupportChannel && (
                      <button 
                        onClick={() => { setShowHeaderMenu(false); navigate(`/empleado/${selectedContact.id}`); }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/60 font-bold text-xs flex items-center gap-2.5 text-[#1c2c4c]"
                      >
                        <User size={16} className="text-[#1c2c4c]" /> Ver Perfil Completo
                      </button>
                    )}

                    <button 
                      onClick={() => { setShowHeaderMenu(false); setShowMediaGallery(true); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/60 font-bold text-xs flex items-center gap-2.5 text-[#1c2c4c]"
                    >
                      <ImageIcon size={16} className="text-[#1c2c4c]" /> Archivos y Fotos ({sharedMediaList.length})
                    </button>

                    <button 
                      onClick={() => { setShowHeaderMenu(false); setShowInChatSearch(!showInChatSearch); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/60 font-bold text-xs flex items-center gap-2.5 text-[#1c2c4c]"
                    >
                      <Search size={16} className="text-[#1c2c4c]" /> Buscar en la Conversación
                    </button>

                    <button 
                      onClick={() => { setIsMuted(!isMuted); setShowHeaderMenu(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/60 font-bold text-xs flex items-center gap-2.5 text-[#1c2c4c]"
                    >
                      {isMuted ? <Bell size={16} className="text-[#1c2c4c]" /> : <BellOff size={16} className="text-[#1c2c4c]" />} 
                      {isMuted ? 'Activar Notificaciones' : 'Silenciar Notificaciones'}
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button 
                      onClick={handleClearChatHistory}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 font-bold text-xs flex items-center gap-2.5 text-red-600"
                    >
                      <Trash2 size={16} className="text-red-500" /> Vaciar Conversación
                    </button>

                  </div>
                )}
              </div>
            </div>

            {/* Buscador dentro del chat activo */}
            {showInChatSearch && (
              <div className="bg-white border-b border-gray-200 p-2.5 flex items-center gap-2 z-20">
                <Search size={16} className="text-gray-400 ml-2" />
                <input 
                  type="text" 
                  placeholder="Buscar texto en este chat..." 
                  value={inChatSearchTerm}
                  onChange={(e) => setInChatSearchTerm(e.target.value)}
                  className="flex-1 text-xs bg-gray-50 p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1c2c4c]"
                  autoFocus
                />
                <button onClick={() => { setShowInChatSearch(false); setInChatSearchTerm(''); }} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Banner de Privacidad y Cifrado */}
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-center flex items-center justify-center gap-2 text-[11px] text-amber-900 shrink-0 z-10">
              <Lock size={13} className="text-[#1c2c4c] shrink-0" />
              <span>
                Conversación cifrada. Los mensajes se guardan de forma privada y segura en IVAD Connect.
              </span>
            </div>

            {/* Lista de Mensajes con Visto en Texto Pequeño */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar relative z-20">
              {activeMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  {inChatSearchTerm 
                    ? `No se encontraron mensajes con "${inChatSearchTerm}".`
                    : (selectedContact.isSupportChannel 
                        ? "Bienvenido a Soporte IVAD SRL. Escribe tu consulta a continuación."
                        : "No hay mensajes guardados en este chat. Escribe el primer mensaje a continuación.")}
                </div>
              ) : (
                activeMessages.map((msg, index) => {
                  const hasReactions = Array.isArray(msg.reactions) && msg.reactions.length > 0;
                  const isTopMessage = index === 0;
                  
                  const groupedReactions = (msg.reactions || []).reduce((acc, r) => {
                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                    return acc;
                  }, {});

                  const myReactedEmojis = (msg.reactions || [])
                    .filter(r => r.user_id?.toString() === currentUser?.id?.toString())
                    .map(r => r.emoji);

                  return (
                    <div 
                      key={msg.id} 
                      onMouseEnter={() => setHoveredMsgId(msg.id)}
                      onMouseLeave={() => setHoveredMsgId(null)}
                      className={`flex items-end gap-2 group relative ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      
                      {/* AVATAR A LA IZQUIERDA PARA MENSAJES RECIBIDOS */}
                      {!msg.isMe && (
                        <div className="w-7 h-7 rounded-full border border-[#d4af37] bg-[#1c2c4c] overflow-hidden shrink-0 self-end mb-0.5 flex items-center justify-center shadow-xs">
                          {selectedContact.avatar ? (
                            <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover scale-[1.25]" />
                          ) : (
                            <User size={14} className="text-white" />
                          )}
                        </div>
                      )}

                      {/* BARRA FLOTANTE DE REACCIONES RÁPIDAS */}
                      {!msg.isDeletedForEveryone && (hoveredMsgId === msg.id || activeReactionPickerMsgId === msg.id) && (
                        <div 
                          className={`absolute z-[60] bg-white rounded-full shadow-2xl border border-gray-200 px-2 py-1 flex items-center gap-1.5 animate-in fade-in duration-150 ${
                            isTopMessage ? 'top-full mt-1' : '-top-10'
                          } ${msg.isMe ? 'right-0' : 'left-9'}`}
                        >
                          {EMOJI_REACTIONS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleToggleReaction(msg, emoji)}
                              className={`text-base hover:scale-125 transition-transform px-1 py-0.5 rounded-full ${
                                myReactedEmojis.includes(emoji) ? 'bg-blue-100' : 'hover:bg-gray-100'
                              }`}
                              title={`Reaccionar con ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setSelectedMsgToDelete(msg)}
                            className="text-gray-400 hover:text-red-500 p-1 border-l border-gray-200 ml-1 transition"
                            title="Eliminar mensaje"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}

                      {/* BURBUJA DEL MENSAJE (COLOR AZUL SUAVE PARA ENVIADO, GRIS SUAVE PARA RECIBIDO) */}
                      <div 
                        className={`max-w-[82%] sm:max-w-[68%] rounded-2xl p-2.5 shadow-xs relative ${
                          msg.isMe 
                            ? 'bg-[#d3e3fd] text-[#041e49] rounded-tr-xs' 
                            : 'bg-[#f1f3f4] text-[#1c2c4c] rounded-tl-xs'
                        } ${msg.isDeletedForEveryone ? 'italic text-gray-400 opacity-75' : ''}`}
                      >
                        {/* VISTA PREVIA DE IMAGEN */}
                        {msg.mediaType === 'image' && msg.mediaUrl && !msg.isDeletedForEveryone && (
                          <div 
                            onClick={() => setActivePreviewImage(msg.mediaUrl)}
                            className="relative rounded-xl overflow-hidden cursor-pointer group/img border border-gray-200/50 bg-black/5 flex items-center justify-center min-h-[140px]"
                          >
                            <img 
                              src={msg.mediaUrl} 
                              alt="Imagen adjunta guardada" 
                              className="w-full h-auto max-h-64 object-cover group-hover/img:scale-105 transition-transform duration-200" 
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                              <Eye size={18} /> Ver Completa
                            </div>
                          </div>
                        )}

                        {/* TARJETA DE DOCUMENTO ADJUNTO */}
                        {msg.mediaType === 'document' && msg.mediaUrl && !msg.isDeletedForEveryone && (
                          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 border border-gray-200 my-1">
                            <FileText size={24} className="text-[#1c2c4c]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate text-[#1c2c4c]">{msg.fileName}</p>
                              <p className="text-[9px] text-gray-500">Documento adjunto</p>
                            </div>
                            <a 
                              href={msg.mediaUrl} 
                              download={msg.fileName}
                              className="p-1.5 bg-white hover:bg-gray-100 rounded-lg transition shrink-0 border border-gray-200"
                              title="Descargar archivo"
                            >
                              <Download size={16} className="text-[#1c2c4c]" />
                            </a>
                          </div>
                        )}

                        {/* TEXTO DEL MENSAJE */}
                        {msg.text && (
                          <p className="text-xs leading-relaxed break-words px-1 pt-1 font-normal">{msg.text}</p>
                        )}

                        {/* HORA Y VISTO EN TEXTO PEQUEÑO */}
                        <div className="flex items-center justify-end gap-1.5 mt-1 px-1">
                          <span className={`text-[9px] font-medium ${msg.isMe ? 'text-[#041e49]/70' : 'text-gray-500'}`}>
                            {msg.time}
                          </span>
                          
                          {/* SI ES MI MENSAJE, MOSTRAR ESTADO EN TEXTO PEQUEÑO */}
                          {msg.isMe && !msg.isDeletedForEveryone && (
                            msg.isRead ? (
                              <span className="text-[9px] font-bold text-blue-600 tracking-tight">Visto</span>
                            ) : (
                              <span className="text-[9px] font-medium text-gray-400/80">Entregado</span>
                            )
                          )}
                        </div>

                        {/* BADGES DE REACCIONES */}
                        {hasReactions && !msg.isDeletedForEveryone && (
                          <div className={`absolute -bottom-3.5 ${msg.isMe ? 'left-2' : 'right-2'} flex gap-1 z-20`}>
                            {Object.entries(groupedReactions).map(([emoji, count]) => {
                              const isMyReaction = myReactedEmojis.includes(emoji);
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleToggleReaction(msg, emoji)}
                                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-0.5 shadow-sm border border-gray-200 transition-all ${
                                    isMyReaction 
                                      ? 'bg-blue-50 text-[#1c2c4c] border-blue-300 scale-105' 
                                      : 'bg-white text-gray-700 hover:bg-gray-50'
                                  }`}
                                  title={`Reaccionado por ${count} persona(s)`}
                                >
                                  <span>{emoji}</span>
                                  {count > 1 && <span className="text-[9px] text-gray-500 font-semibold">{count}</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensaje y Adjuntos */}
            <div className="bg-white border-t border-gray-200 p-3 shrink-0 z-30">
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

      {/* MODAL DE GALERÍA DE ARCHIVOS Y MULTIMEDIA COMPARTIDOS */}
      {showMediaGallery && selectedContact && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-[#1c2c4c]">Archivos y Fotos Compartidas</h3>
              <button onClick={() => setShowMediaGallery(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {sharedMediaList.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">
                  No hay fotos ni documentos compartidos en esta conversación.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sharedMediaList.map(item => (
                    <div key={item.id} className="relative group border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                      {item.mediaType === 'image' ? (
                        <img 
                          src={item.mediaUrl} 
                          alt="Media compartida" 
                          onClick={() => { setActivePreviewImage(item.mediaUrl); setShowMediaGallery(false); }}
                          className="w-full h-28 object-cover rounded-xl cursor-pointer hover:scale-105 transition" 
                        />
                      ) : (
                        <div className="p-3 text-center flex flex-col items-center justify-center">
                          <FileText size={28} className="text-[#1c2c4c] mb-1" />
                          <p className="text-[10px] font-bold truncate w-full text-gray-700">{item.fileName}</p>
                          <a href={item.mediaUrl} download={item.fileName} className="mt-2 text-[10px] text-blue-600 font-bold hover:underline">
                            Descargar
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowMediaGallery(false)}
              className="mt-4 w-full py-2.5 bg-gray-100 font-bold text-xs text-gray-600 rounded-2xl hover:bg-gray-200"
            >
              Cerrar Galería
            </button>
          </div>
        </div>
      )}

      {/* MODAL / POPUP DE ELIMINAR MENSAJE */}
      {selectedMsgToDelete && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-[#1c2c4c]">¿Deseas eliminar este mensaje?</h3>
              <button onClick={() => setSelectedMsgToDelete(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {selectedMsgToDelete.isMe && selectedMsgToDelete.isRead && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-[11px] text-amber-800">
                <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <span>
                  El destinatario <strong>ya vio</strong> este mensaje. Solo puedes eliminarlo para ti.
                </span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              {selectedMsgToDelete.isMe && !selectedMsgToDelete.isRead && (
                <button
                  onClick={() => handleDeleteForEveryone(selectedMsgToDelete)}
                  className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-2xl hover:bg-red-700 transition shadow-sm"
                >
                  Eliminar para todos
                </button>
              )}

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
