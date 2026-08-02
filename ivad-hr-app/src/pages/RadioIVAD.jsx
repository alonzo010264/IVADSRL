import React, { useState, useEffect, useRef } from 'react';
import { Radio, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Users, User, Clock, ShieldCheck, Play, Pause, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';
import { VerificationBadge } from '../components/VerificationBadge';

const RadioIVAD = () => {
  const navigate = useNavigate();
  const { currentUser, employees } = useEmployees();

  const [isPowerOn, setIsPowerOn] = useState(true);
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

  // Comprobar si estamos dentro del Horario Laboral IVAD (Lunes a Sábado, 8:00 AM - 6:00 PM)
  const isWithinBusinessHours = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo
    const hours = now.getHours();

    // Domingo cerrado
    if (day === 0) return false;
    // Lunes a Sábado de 8 AM a 6 PM (18:00)
    return hours >= 8 && hours < 18;
  };

  const isOperational = isWithinBusinessHours();

  const otherEmployees = employees.filter(emp => emp.id?.toString() !== currentUser?.id?.toString());

  // Solicitar permiso de micrófono al cargar la página
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
      .limit(15);

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
      .channel(`radio_channel_live_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'radio_transmissions'
      }, (payload) => {
        const newTrans = payload.new;
        
        // Agregar al historial
        setTransmissions(prev => [newTrans, ...prev.filter(t => t.id !== newTrans.id)]);

        // Si la radio está ENCENDIDA y el mensaje no lo envié yo
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
    if (!isPowerOn) {
      alert("Enciende la radio para transmitir.");
      return;
    }
    if (!isOperational) {
      alert("La radio IVAD está fuera de horario operativo (8:00 AM - 6:00 PM).");
      return;
    }
    if (targetType === 'direct' && !selectedReceiver) {
      alert("Por favor selecciona un colaborador para transmisión privada.");
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
      alert("No se pudo acceder al micrófono. Por favor otorga los permisos en tu navegador.");
    }
  };

  // Detener Grabación y Transmitir
  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    clearInterval(recordingTimerRef.current);
    setIsRecording(false);

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convertir Blob a DataURL Base64
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

      // Apagar pistas del micrófono
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    };
  };

  return (
    <div className={`min-h-screen pb-24 font-sans transition-colors duration-200 ${isPowerOn ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-800'}`}>
      
      {/* Header Estilo Walkie-Talkie Militar / Corporativo */}
      <div className="bg-[#1c2c4c] text-white pt-10 pb-6 px-6 rounded-b-[2.5rem] shadow-xl relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition">
              <ArrowLeft size={22} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center">
                <Radio size={20} className={isPowerOn ? "animate-pulse text-green-400" : "text-gray-400"} />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-wide">Radio IVAD Walkie-Talkie</h1>
                <p className="text-[10px] text-[#d4af37] font-semibold">Comunicación Instantánea por Voz</p>
              </div>
            </div>
          </div>

          {/* Switch Encender / Apagar Radio */}
          <button 
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all ${
              isPowerOn 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-red-600 text-white shadow-red-600/20'
            }`}
          >
            {isPowerOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isPowerOn ? 'ENCENDIDA' : 'APAGADA'}</span>
          </button>
        </div>

        {/* Banner de Estado de Horario Laboral */}
        <div className={`mt-2 p-2.5 rounded-2xl flex items-center gap-2.5 text-[11px] font-semibold ${
          isOperational 
            ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-950/90 border border-amber-500/40 text-amber-300'
        }`}>
          <Clock size={15} className="shrink-0" />
          <span>
            {isOperational 
              ? 'Horario Operativo Activo (8:00 AM - 6:00 PM). Radio lista para transmitir.' 
              : 'Radio fuera de horario operativo (8:00 AM - 6:00 PM). La transmisión está deshabilitada.'}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6 space-y-6">
        
        {/* SELECCIÓN DE CANAL DE TRANSMISIÓN */}
        <div className={`p-4 rounded-3xl border shadow-sm ${isPowerOn ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-3">
            Canal de Transmisión
          </label>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setTargetType('general')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                targetType === 'general'
                  ? 'bg-[#1c2c4c] text-white border-[#d4af37] shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-transparent'
              }`}
            >
              <Users size={16} /> Canal General
            </button>

            <button
              onClick={() => setTargetType('direct')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                targetType === 'direct'
                  ? 'bg-[#1c2c4c] text-white border-[#d4af37] shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-transparent'
              }`}
            >
              <User size={16} /> Canal Privado
            </button>
          </div>

          {/* Desplegable de Colaborador Privado */}
          {targetType === 'direct' && (
            <div className="mt-2">
              <select
                value={selectedReceiver ? selectedReceiver.id : ''}
                onChange={(e) => {
                  const target = otherEmployees.find(emp => emp.id.toString() === e.target.value);
                  setSelectedReceiver(target || null);
                }}
                className={`w-full p-3 text-xs font-semibold rounded-2xl border focus:outline-none ${
                  isPowerOn ? 'bg-slate-950 text-white border-slate-700' : 'bg-gray-50 text-gray-800 border-gray-200'
                }`}
              >
                <option value="">-- Selecciona un colaborador --</option>
                {otherEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role || 'Colaborador'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* BOTÓN GIGANTE PUSH-TO-TALK (MANTENER PARA HABLAR) */}
        <div className="flex flex-col items-center justify-center py-6">
          
          {isPlayingAudio && (
            <div className="mb-4 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 animate-pulse">
              <Volume2 size={18} className="animate-bounce" />
              <span>Escuchando a: {activeSpeakerName}</span>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            {/* Anillos de Onda cuando está transmitiendo */}
            {isRecording && (
              <>
                <div className="absolute w-44 h-44 rounded-full bg-red-600/30 animate-ping"></div>
                <div className="absolute w-52 h-52 rounded-full bg-red-600/15 animate-pulse"></div>
              </>
            )}

            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={!isPowerOn || !isOperational}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all border-4 relative z-10 cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                isRecording
                  ? 'bg-red-600 text-white border-red-400 shadow-red-600/50 scale-105'
                  : isPowerOn && isOperational
                    ? 'bg-[#1c2c4c] text-[#d4af37] border-[#d4af37] shadow-[#1c2c4c]/40 hover:bg-blue-900'
                    : 'bg-gray-400 text-gray-200 border-gray-300'
              }`}
            >
              {isRecording ? (
                <>
                  <Mic size={40} className="animate-bounce mb-1" />
                  <span className="text-[11px] font-black tracking-wider">HABLANDO</span>
                  <span className="text-[10px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded-full mt-1">
                    {recordingSeconds}s
                  </span>
                </>
              ) : (
                <>
                  <Radio size={38} className="mb-1 text-[#d4af37]" />
                  <span className="text-[11px] font-extrabold tracking-wider text-center px-2">
                    PRESIONA PARA HABLAR
                  </span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center font-medium">
            {isRecording 
              ? "Suelta el botón para transmitir tu voz al instante." 
              : "Mantén presionado el botón central para enviar un mensaje de voz directo."}
          </p>

          <p className="text-[10px] text-emerald-400/80 mt-1 text-center font-bold">
            ⚡ Transmisión ultra-eficiente (sin consumo continuo de batería).
          </p>
        </div>

        {/* HISTORIAL DE TRANSMISIONES RECIENTES */}
        <div>
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 ml-2">
            Transmisiones Recientes
          </h2>

          <div className={`rounded-3xl border shadow-sm divide-y overflow-hidden ${
            isPowerOn ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-gray-100 divide-gray-50'
          }`}>
            {transmissions.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8">No hay transmisiones de voz recientes.</p>
            ) : (
              transmissions.map(item => {
                const isMe = item.sender_id.toString() === currentUser?.id?.toString();
                const timeStr = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isPlayingThis = currentlyPlayingId === item.id;

                return (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-black/5 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => playAudioTransmission(item.audio_url, item.sender_name, item.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                          isPlayingThis
                            ? 'bg-amber-500 text-white animate-pulse'
                            : isMe
                              ? 'bg-blue-900 text-white'
                              : 'bg-emerald-700 text-white'
                        }`}
                        title="Reproducir audio"
                      >
                        {isPlayingThis ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>

                      <div className="min-w-0">
                        <h4 className={`font-bold text-xs truncate ${isPowerOn ? 'text-gray-100' : 'text-gray-800'}`}>
                          {isMe ? 'Tú (Transmisión enviada)' : item.sender_name}
                        </h4>
                        <p className="text-[10px] text-gray-400 flex items-center gap-2">
                          <span>{item.target_type === 'general' ? '📢 Canal General' : '🔒 Privado'}</span>
                          <span>•</span>
                          <span>{item.duration_seconds || 1} seg</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-500 font-semibold shrink-0">
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
