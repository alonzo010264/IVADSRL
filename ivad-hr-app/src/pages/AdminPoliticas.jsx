import { useState, useEffect } from 'react';
import { ChevronLeft, Scale, Plus, Trash2, Edit3, Shield, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminPoliticas = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([
    {
      id: 1,
      title: 'Código de Ética y Conducta',
      description: 'Valores, principios y estándares de comportamiento esperados de todos los colaboradores de IVAD.',
      updated: '10 Ene 2024'
    },
    {
      id: 2,
      title: 'Política Disciplinaria',
      description: 'Normas de comportamiento, faltas, sanciones y procedimientos disciplinarios.',
      updated: '15 Feb 2024'
    },
    {
      id: 3,
      title: 'Política de Facturación',
      description: 'Procedimientos correctos para el manejo de caja, facturación a clientes y devoluciones.',
      updated: '05 Mar 2024'
    },
    {
      id: 4,
      title: 'Reglamento Interno de Trabajo',
      description: 'Condiciones de trabajo, horarios, descansos y obligaciones generales.',
      updated: '20 Nov 2023'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddPolicy = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const newItem = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      updated: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setPolicies([newItem, ...policies]);
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  const handleDeletePolicy = (id) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md relative">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin')} className="p-2 absolute left-4 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Gestión de Políticas</h1>
            <p className="text-sm text-[#d4af37]">Publicar normativas para empleados</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1c2c4c] rounded-full flex items-center justify-center text-[#d4af37]">
                <Scale size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c2c4c]">Políticas Publicadas</h2>
                <p className="text-xs text-gray-500">Documentos oficiales visibles en la sección "Políticas de la Empresa"</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#1c2c4c] text-[#d4af37] text-xs font-bold rounded-xl hover:bg-opacity-90 transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Nueva Política
            </button>
          </div>

          <div className="space-y-3">
            {policies.map((p) => (
              <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1c2c4c]/10 text-[#1c2c4c] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1c2c4c] text-sm">{p.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{p.description}</p>
                    <span className="text-[11px] text-gray-400 mt-2 block">Actualizado: {p.updated}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeletePolicy(p.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg shrink-0"
                  title="Eliminar política"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para añadir política */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-[#1c2c4c] mb-2">Publicar Nueva Política</h3>
            <p className="text-xs text-gray-500 mb-4">Ingresa el título y descripción explicativa de la norma.</p>

            <form onSubmit={handleAddPolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título del Documento</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Política de Uso de Equipos"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-[#1c2c4c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción General</label>
                <textarea
                  required
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Resumen del contenido y propósito de la normativa..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-[#1c2c4c] focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1c2c4c] text-[#d4af37] rounded-xl font-bold text-xs hover:bg-opacity-90 transition shadow-sm"
                >
                  Guardar y Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPoliticas;
