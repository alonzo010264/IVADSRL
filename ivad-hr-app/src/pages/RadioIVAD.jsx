import React, { useState, useEffect, useRef } from 'react';
import { Radio, Mic, Volume2, VolumeX, ArrowLeft, Users, User, Clock, Play, Pause, AlertCircle, CheckCircle2, ShieldCheck, Smartphone, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';
import { VerificationBadge } from '../components/VerificationBadge';

const RadioIVAD = () => {
  const navigate = useNavigate();
  const { currentUser, employees } = useEmployees();

  const [isPowerOn, setIsPowerOn] = useState(true);
  const [testModeOverride, setTestModeOverride] = useState(true); // Activo para pruebas
  const [targetType, setTargetType] = useState('general'); // 'general' o 'direct'
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeakerName, setActiveSpeakerName] = useState('');

  const [transmissions, setTransmissions] = useState([]);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const isRecordingStateRef = useRef(false);

  // Mantener referencia actualizada del estado de grabación para event listeners de teclas
  useEffect(() => {
    isRecordingStateRef.current = isRecording;
  }, [isRecording]);

  // Comprobar si estamos dentro del Horario Laboral IVAD (Lunes a Sábado, 8:00 AM - 6:00 PM)
  const isWithinBusinessHours = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();

    if (day === 0) return false;
    return hours >= 8 && hours < 18;
  };

  const isOperational = isWithinBusinessHours() || testModeOverride;

  const otherEmployees = [
    { id: 'soporte-ivad-official', name: 'Soporte IVAD SRL', role: 'Atención Corporativa', avatar: '/logo.png', verification_status: 'gold' },
    ...employees.filter(emp => emp.id?.toString() !== currentUser?.id?.toString())
  ];

  // Solicitar permiso de micrófono al montar
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => console.log("Permiso de micrófono concedido."))
        .catch(err => console.log("Permiso de micrófono denegado:", err));
    }
  }, []);

  // Cargar transmisiones recientes de la radio
  const fetchRecentTransmissions = async () => {
    const { data } = await supabase
      .from('radio_transmissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setTransmissions(data);
    }
  };

  useEffect(() => {
    fetchRecentTransmissions();
  }, []);

  // Suscripción Real-Time Supabase a transmisiones de radio en vivo
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel(`radio_page_live_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'radio_transmissions'
      }, (payload) => {
        const newTrans = payload.new;
        
        setTransmissions(prev => [newTrans, ...prev.filter(t => t.id !== newTrans.id)]);

        if (isPowerOn && newTrans.sender_id.toString() !== currentUser.id.toString()) {
          const isForMe = newTrans.target_type === 'general' || newTrans.receiver_id?.toString() === currentUser.id.toString();
          
          if (isForMe && newTrans.audio_url) {
            playAudioTransmission(newTrans.audio_url, newTrans.sender_name, newTrans.id);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, isPowerOn]);

  // Reproducir audio recibido automáticamente en altavoz
  const playAudioTransmission = (audioUrl, speakerName, transId) => {
    if (!isPowerOn) return;

    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      setIsPlayingAudio(true);
      setActiveSpeakerName(speakerName);
      setCurrentlyPlayingId(transId);

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        setActiveSpeakerName('');
        setCurrentlyPlayingId(null);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setActiveSpeakerName('');
        setCurrentlyPlayingId(null);
      };

      audio.play().catch(e => console.log("Audio play error:", e));
    } catch (e) {
      console.log("Error playing radio audio:", e);
    }
  };

  // Iniciar Grabación (Push-to-Talk)
  const startRecording = async () => {
    if (isRecordingStateRef.current) return;
    if (!isPowerOn) {
      alert("Enciende la radio para transmitir.");
      return;
    }
    if (!isOperational) {
      alert("La radio IVAD está fuera de horario operativo.");
      return;
    }
    if (targetType === 'direct' && !selectedReceiver) {
      alert("Por favor selecciona un colaborador para la transmisión privada.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert("No se pudo acceder al micrófono. Por favor otorga los permisos en tu navegador/dispositivo.");
    }
  };

  // Detener Grabación y Transmitir
  const stopRecording = () => {
    if (!isRecordingStateRef.current || !mediaRecorderRef.current) return;

    clearInterval(recordingTimerRef.current);
    setIsRecording(false);

    try {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;

          const { data, error } = await supabase.from('radio_transmissions').insert([{
            sender_id: currentUser?.id,
            sender_name: currentUser?.name || 'Colaborador IVAD',
            target_type: targetType,
            receiver_id: targetType === 'direct' ? selectedReceiver?.id : null,
            audio_url: base64Audio,
            duration_seconds: recordingSeconds || 1,
            created_at: new Date().toISOString()
          }]).select();

          if (error) {
            console.error("Error enviando voz por Radio:", error);
            alert("Error al enviar la transmisión.");
          } else if (data && data[0]) {
            setTransmissions(prev => [data[0], ...prev]);
          }
        };

        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      };
    } catch (e) {
      console.log("Error stopping recording:", e);
    }
  };

  // SOPORTE PARA BOTONES FÍSICOS DE VOLUMEN EN TELÉFONOS CELULARES Y TECLADO EN LAPTOPS
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Interceptar teclas de volumen o espacio si la pantalla de radio está activa
      const isVolumeKey = ['AudioVolumeUp', 'AudioVolumeDown', 'VolumeUp', 'VolumeDown', 'Space', 'KeyR'].includes(e.code) || ['VolumeUp', 'VolumeDown'].includes(e.key);

      if (isVolumeKey) {
        // Evitar que el sistema cambie el volumen multimedia de Android/iOS/Windows mientras habla por radio
        e.preventDefault();
        if (!isRecordingStateRef.current) {
          startRecording();
        }
      }
    };

    const handleKeyUp = (e) => {
      const isVolumeKey = ['AudioVolumeUp', 'AudioVolumeDown', 'VolumeUp', 'VolumeDown', 'Space', 'KeyR'].includes(e.code) || ['VolumeUp', 'VolumeDown'].includes(e.key);

      if (isVolumeKey) {
        e.preventDefault();
        if (isRecordingStateRef.current) {
          stopRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetType, selectedReceiver, isPowerOn, isOperational]);

  // Alternar Grabación al Clic (Ideal para trackpads de laptop y ratón)
  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 pb-24 font-sans">
      
      {/* Header Limpio Corporativo IVAD (Azul Marino #1c2c4c y Blanco) */}
      <div className="bg-[#1c2c4c] text-white pt-10 pb-8 px-6 rounded-b-[2.5rem] shadow-md relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition">
              <ArrowLeft size={22} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shadow-xs">
                <Radio size={22} className={isPowerOn ? "text-[#d4af37]" : "text-gray-400"} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Radio IVAD Walkie-Talkie</h1>
                <p className="text-xs text-[#d4af37] font-semibold">Comunicación de Voz en Tiempo Real</p>
              </div>
            </div>
          </div>

          {/* Interruptor de Encendido de Radio */}
          <button 
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              isPowerOn 
                ? 'bg-emerald-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            {isPowerOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isPowerOn ? 'Radio Encendida' : 'Radio Apagada'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 -mt-4 relative z-20 space-y-6">

        {/* Tarjeta de Indicaciones y Teclas de Volumen Físicas */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-[#1c2c4c]">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1c2c4c]">Botones Físicos de Volumen Habilitados</h3>
              <p className="text-[11px] text-gray-500">
                Presiona las teclas de **Subir/Bajar Volumen** en tu móvil (o la Barra Espaciadora en Laptop) para hablar como una radio física.
              </p>
            </div>
          </div>

          <span className="text-[10px] bg-green-100 text-green-700 font-extrabold px-3 py-1 rounded-full shrink-0">
            ● Activo
          </span>
        </div>

        {/* SELECCIÓN DE CANAL DE TRANSMISIÓN */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            Selección de Canal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => { setTargetType('general'); setSelectedReceiver(null); }}
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                targetType === 'general'
                  ? 'bg-[#1c2c4c] text-white border-[#1c2c4c] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Users size={18} className={targetType === 'general' ? 'text-[#d4af37]' : 'text-gray-500'} />
              <span>Canal General (Todos)</span>
            </button>

            <button
              onClick={() => setTargetType('direct')}
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                targetType === 'direct'
                  ? 'bg-[#1c2c4c] text-white border-[#1c2c4c] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <User size={18} className={targetType === 'direct' ? 'text-[#d4af37]' : 'text-gray-500'} />
              <span>Canal Privado (1 a 1)</span>
            </button>
          </div>

          {/* Menú Desplegable de Destinatario Privado */}
          {targetType === 'direct' && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[#1c2c4c] block">Selecciona la persona para hablar en privado:</label>
              <select
                value={selectedReceiver ? selectedReceiver.id : ''}
                onChange={(e) => {
                  const target = otherEmployees.find(emp => emp.id.toString() === e.target.value);
                  setSelectedReceiver(target || null);
                }}
                className="w-full p-3 text-xs font-bold rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
              >
                <option value="">-- Seleccionar Colaborador --</option>
                {otherEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role || 'Colaborador'})
                  </option>
                ))}
              </select>

              {selectedReceiver && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Transmisión privada enrutada exclusivamente para: <strong>{selectedReceiver.name}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTÓN PRINCIPAL PUSH-TO-TALK (BLANCO Y AZUL MARINO IVAD) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          
          {isPlayingAudio && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <Volume2 size={18} className="text-[#1c2c4c] animate-bounce" />
              <span>Reproduciendo audio de: <strong>{activeSpeakerName}</strong></span>
            </div>
          )}

          <div className="relative flex items-center justify-center my-4">
            {/* Anillos de Animación durante la grabación */}
            {isRecording && (
              <>
                <div className="absolute w-48 h-48 rounded-full bg-red-500/20 animate-ping"></div>
                <div className="absolute w-56 h-56 rounded-full bg-red-500/10 animate-pulse"></div>
              </>
            )}

            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              onClick={handleButtonClick}
              disabled={!isPowerOn || !isOperational}
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-xl transition-all border-4 relative z-10 cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                isRecording
                  ? 'bg-red-600 text-white border-red-300 shadow-red-500/40 scale-105'
                  : isPowerOn && isOperational
                    ? 'bg-[#1c2c4c] text-[#d4af37] border-[#d4af37] shadow-[#1c2c4c]/20 hover:bg-blue-950'
                    : 'bg-gray-300 text-gray-500 border-gray-200'
              }`}
            >
              {isRecording ? (
                <>
                  <Mic size={48} className="animate-bounce mb-1 text-white" />
                  <span className="text-xs font-black tracking-wider text-white">TRANSMITIENDO...</span>
                  <span className="text-[10px] font-mono font-bold bg-black/40 text-white px-2.5 py-0.5 rounded-full mt-1">
                    {recordingSeconds}s • Clic para Enviar
                  </span>
                </>
              ) : (
                <>
                  <Radio size={46} className="mb-1 text-[#d4af37]" />
                  <span className="text-xs font-extrabold tracking-wider text-center px-3 text-white">
                    PRESIONAR PARA HABLAR
                  </span>
                  <span className="text-[9px] text-[#d4af37] font-semibold mt-1">
                    (Usa Botones de Volumen)
                  </span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 font-medium max-w-sm">
            {isRecording 
              ? "Soltar o presionar de nuevo para enviar tu mensaje de voz al canal." 
              : "Mantén presionado el botón o usa los botones físicos de volumen de tu móvil para hablar."}
          </p>

        </div>

        {/* HISTORIAL DE TRANSMISIONES RECIENTES */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            Historial de Transmisiones de Voz
          </h2>

          <div className="divide-y divide-gray-100">
            {transmissions.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8">No hay mensajes de voz recientes en la radio.</p>
            ) : (
              transmissions.map(item => {
                const isMe = item.sender_id.toString() === currentUser?.id?.toString();
                const timeStr = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isPlayingThis = currentlyPlayingId === item.id;

                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => playAudioTransmission(item.audio_url, item.sender_name, item.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                          isPlayingThis
                            ? 'bg-amber-500 text-white animate-pulse'
                            : isMe
                              ? 'bg-[#1c2c4c] text-white'
                              : 'bg-emerald-600 text-white'
                        }`}
                        title="Reproducir transmisión"
                      >
                        {isPlayingThis ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>

                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-gray-800 truncate">
                          {isMe ? 'Tú (Transmisión enviada)' : item.sender_name}
                        </h4>
                        <p className="text-[10px] text-gray-500 flex items-center gap-2">
                          <span>{item.target_type === 'general' ? 'Canal General' : 'Canal Privado'}</span>
                          <span>•</span>
                          <span>{item.duration_seconds || 1} seg</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                      {timeStr}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RadioIVAD;
