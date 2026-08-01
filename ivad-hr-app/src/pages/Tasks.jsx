import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Clock, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const Tasks = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTasks = async () => {
      setLoading(true);
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('employee_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setTasks(data);
      } else {
        setTasks([]);
      }
      setLoading(false);
    };

    fetchMyTasks();
  }, [currentUser]);

  const handleToggleComplete = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completada' ? 'Pendiente' : 'Completada';
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-16">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 pt-10 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2 text-white hover:bg-white/10 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Mis Tareas Asignadas</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-[#1c2c4c]/10 p-3 rounded-full text-[#1c2c4c]">
              <ClipboardList size={26} />
            </div>
            <div>
              <h3 className="font-bold text-[#1c2c4c] text-base">Asignaciones & Objetivos</h3>
              <p className="text-xs text-gray-500">Supervisa tus tareas asignadas por supervisores o gerencia.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-gray-400">Cargando tareas...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
              <CheckCircle2 size={36} className="text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-700 text-base">No tienes tareas pendientes</h3>
              <p className="text-xs text-gray-400 mt-1">Todas tus asignaciones están al día.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.status === 'Completada' ? 'bg-green-500' : 'bg-[#d4af37]'}`}></div>
                
                <div className="flex justify-between items-start mb-2 pl-2">
                  <h4 className={`font-bold text-[#1c2c4c] text-base ${task.status === 'Completada' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h4>
                  {task.status === 'Completada' ? (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={12} /> Completada
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <Clock size={12} /> {task.priority || 'Pendiente'}
                    </span>
                  )}
                </div>
                
                <div className="pl-2 space-y-2">
                  <p className="text-gray-600 text-xs leading-relaxed">{task.description || 'Sin instrucciones adicionales.'}</p>
                  
                  <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400 pt-2 border-t border-gray-50">
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={13} /> Límite: {task.due_date || 'Sin fecha'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pl-2">
                  <button 
                    onClick={() => handleToggleComplete(task.id, task.status)}
                    className={`w-full font-bold py-2 rounded-xl text-xs transition-colors border ${
                      task.status === 'Completada' 
                        ? 'bg-gray-100 text-gray-600 border-gray-200' 
                        : 'bg-[#1c2c4c] text-[#d4af37] border-[#d4af37]/30 hover:bg-opacity-95'
                    }`}
                  >
                    {task.status === 'Completada' ? 'Marcar como pendiente' : 'Marcar como completada'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
