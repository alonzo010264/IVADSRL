import React, { useEffect } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

export const GlobalChatNotificationListener = () => {
  const { currentUser, employees } = useEmployees();

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

  // Notificación Push Híbrida (Service Worker para Chrome Android + PWA + Desktop)
  const triggerPushNotification = async (title, body, icon, tag, targetUrl = '/chat') => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const notificationOptions = {
      body,
      icon: icon || '/logo.png',
      badge: '/logo.png',
      tag,
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: targetUrl }
    };

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, notificationOptions);
          return;
        }
      } catch (err) {
        console.log("SW notification error, falling back:", err);
      }
    }

    try {
      const notif = new Notification(title, notificationOptions);
      notif.onclick = () => {
        window.focus();
        window.location.href = targetUrl;
      };
    } catch (err) {
      console.log("Desktop Notification error:", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 1. Canal Global Real-Time para Mensajes Directos del Chat
    const chatChannel = supabase
      .channel(`app_wide_chat_listener_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `receiver_id=eq.${currentUser.id}`
      }, (payload) => {
        const newMsg = payload.new;

        if (newMsg && newMsg.sender_id.toString() !== currentUser.id.toString()) {
          let senderObj = null;
          if (newMsg.sender_id.toString() === 'soporte-ivad-official') {
            senderObj = { name: 'Soporte IVAD SRL', avatar: '/logo.png' };
          } else {
            senderObj = employees.find(e => e.id.toString() === newMsg.sender_id.toString());
          }

          const senderName = senderObj ? senderObj.name : 'Colaborador IVAD';
          const bodyText = newMsg.message || (newMsg.media_url ? 'Envió una imagen' : 'Envió un archivo');

          const isCurrentRouteChat = window.location.pathname === '/chat';
          const isDocumentHidden = document.hidden;

          if (!isCurrentRouteChat || isDocumentHidden) {
            playNotificationSound();
            triggerPushNotification(
              `Mensaje de ${senderName}`,
              bodyText,
              senderObj?.avatar || '/logo.png',
              `global-msg-${newMsg.sender_id}`,
              `/chat?contact=${newMsg.sender_id}`
            );
          }
        }
      })
      .subscribe();

    // 2. Canal Global Real-Time para Transmisiones de Radio IVAD Walkie-Talkie
    // (Reproduce el audio de voz en altavoz automáticamente aunque estés en otra sección de la app)
    const radioChannel = supabase
      .channel(`app_wide_radio_listener_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'radio_transmissions'
      }, (payload) => {
        const newTrans = payload.new;

        if (newTrans && newTrans.sender_id.toString() !== currentUser.id.toString()) {
          const isForMe = newTrans.target_type === 'general' || newTrans.receiver_id?.toString() === currentUser.id.toString();
          
          if (isForMe && newTrans.audio_url) {
            const isCurrentRouteRadio = window.location.pathname === '/radio';

            // Si NO estamos dentro de la pantalla de radio, reproducir el audio de voz por el altavoz automáticamente
            if (!isCurrentRouteRadio) {
              try {
                const radioAudio = new Audio(newTrans.audio_url);
                radioAudio.play().catch(err => console.log("Background radio play error:", err));
              } catch (e) {
                console.log("Radio audio play error:", e);
              }

              triggerPushNotification(
                `Transmisión de Voz - Radio IVAD`,
                `${newTrans.sender_name} ha transmitido un mensaje de voz por radio`,
                '/logo.png',
                `radio-trans-${newTrans.id}`,
                '/radio'
              );
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(radioChannel);
    };
  }, [currentUser, employees]);

  return null;
};
