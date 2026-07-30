import { useState } from 'react';
import { ChevronLeft, ShieldAlert, Megaphone, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setAnnouncementMessage('');
    try {
      const { error } = await supabase.from('announcements').insert([{
        title: announcementTitle,
        content: announcementContent
      }]);
      if (error) throw error;
      setAnnouncementMessage('¡Anuncio publicado con éxito!');
      setAnnouncementTitle('');
      setAnnouncementContent('');
    } catch (error) {
      console.error(error);
      setAnnouncementMessage('Error al publicar el anuncio.');
    } finally {
      setIsPublishing(false);
      setTimeout(() => setAnnouncementMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white pt-12 pb-6 px-4 rounded-b-[2rem] shadow-md relative">
        <div className="flex items-center">
          <button onClick={() => navigate('/inicio')} className="p-2 absolute left-4 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Publicar Anuncio</h1>
            <p className="text-sm text-[#d4af37]">Tablero de Noticias</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-[#f8f9fc] rounded-full flex items-center justify-center">
              <Megaphone className="text-[#1c2c4c]" size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#1c2c4c]">Escribir Nuevo Anuncio</h2>
          </div>

          {announcementMessage && (
            <div className={`mb-6 p-4 rounded-xl font-medium text-sm flex items-center gap-2 border ${announcementMessage.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
               <ShieldAlert size={16} className={announcementMessage.includes('Error') ? 'text-red-600' : 'text-green-600'} />
               {announcementMessage}
            </div>
          )}

          <form onSubmit={handlePublishAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Anuncio</label>
              <input required type="text" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. ¡Nueva política de vacaciones!" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (Detalles)</label>
              <textarea required rows="8" value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none resize-none" placeholder="Escribe el mensaje que todos los empleados verán en su inicio..."></textarea>
            </div>
            <div className="pt-2">
              <button disabled={isPublishing} type="submit" className="w-full bg-[#d4af37] text-white font-bold py-4 rounded-xl shadow-md hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Send size={20} />
                {isPublishing ? 'Publicando...' : 'Publicar Anuncio en el Inicio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
