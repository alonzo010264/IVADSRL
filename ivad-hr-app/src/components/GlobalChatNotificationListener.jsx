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
  const triggerPushNotification = async (title, body, icon, tag, senderId) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const targetUrl = `/chat?contact=${senderId}`;
    const notificationOptions = {
      body,
      icon: icon || '/logo.png',
      badge: '/logo.png',
      tag,
      renotify: true,
      vibrate: [200, 100, 200], // Vibración física en teléfono móvil
      data: { url: targetUrl, senderId }
    };

    // 1. ServiceWorker Registration (Requisito obligatorio en Chrome Android y PWAs)
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

    // 2. Fallback para navegador Desktop
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

    // Solicitar permiso de notificaciones al montar
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Canal Global Real-Time que escucha SIEMPRE en cualquier parte de la App y en segundo plano
    const globalChannel = supabase
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
              newMsg.sender_id
            );
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, [currentUser, employees]);

  return null;
};
