import React, { useState, useEffect } from 'react';
import { ChevronLeft, ClipboardList, Plus, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AdminTareas = () => {
  const navigate = useNavigate();
  const { employees } = useEmployees();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    employee_id: '',
    title: '',
    description: '',
    due_date: '',
    priority: 'Normal'
  });

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTasks(data);
    } else {
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [employees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.title) return;
    
    setIsSubmitting(true);
    setMessage('');

    const targetEmp = employees.find(emp => emp.id.toString() === formData.employee_id.toString());
    const newTask = {
      employee_id: formData.employee_id,
      employee_name: targetEmp?.name || 'Empleado',
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date,
      priority: formData.priority,
      status: 'Pendiente',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('tasks').insert([newTask]).select();

    if (data) {
      setTasks([data[0], ...tasks]);
    } else {
      setTasks([{ id: Date.now().toString(), ...newTask }, ...tasks]);
    }

    setMessage(`¡Tarea "${formData.title}" asignada correctamente a ${targetEmp?.name || 'empleado'}!`);
    setFormData({ employee_id: '', title: '', description: '', due_date: '', priority: 'Normal' });
    setIsSubmitting(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('¿Deseas eliminar esta tarea asignada?')) {
      await supabase.from('tasks').delete().eq('id', taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completada' ? 'Pendiente' : 'Completada';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      
      {/* Header Superior Azul IVAD */}
      <div className="bg-[#1c2c4c] text-white pt-12 pb-8 px-4 rounded-b-[2rem] shadow-md relative">
        <div className="max-w-4xl mx-auto flex items-center">
          <button onClick={() => navigate('/admin')} className="p-2 absolute left-4 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Asignación de Tareas</h1>
            <p className="text-sm text-[#d4af37]">Panel de Gestión Operativa IVAD Connect</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Formulario de Asignación de Tarea */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-[#1c2c4c]/10 text-[#1c2c4c] rounded-full flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#1c2c4c]">Asignar Nueva Tarea a Empleado</h2>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-blue-50 text-[#1c2c4c] rounded-xl font-medium text-sm border border-blue-100">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Seleccionar Empleado</label>
                <select 
                  required 
                  value={formData.employee_id} 
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-medium"
                >
                  <option value="">-- Elige un colaborador --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Título de la Tarea</label>
                <input 
                  required 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Auditoría de Pasillo 3" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Fecha Límite de Entrega</label>
                <input 
                  required 
                  type="date" 
                  value={formData.due_date} 
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Prioridad</label>
                <select 
                  value={formData.priority} 
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-medium"
                >
                  <option value="Normal">Normal</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta (Urgente)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Descripción / Instrucciones</label>
              <textarea 
                rows={3} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalla los pasos o requerimientos de la tarea..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm"
              />
            </div>

            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full bg-[#1c2c4c] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} className="text-[#d4af37]" />
              <span>{isSubmitting ? 'Asignando...' : 'Asignar Tarea'}</span>
            </button>
          </form>
        </div>

        {/* Lista de Tareas Asignadas */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#1c2c4c] mb-4">Tareas Asignadas Recentemente</h2>

          {loading ? (
            <p className="text-center text-gray-500 py-6">Cargando tareas...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No hay tareas asignadas aún.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const assignedEmp = employees.find(e => e.id.toString() === task.employee_id?.toString());
                const empName = task.employee_name || assignedEmp?.name || 'Empleado';

                return (
                  <div key={task.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => handleToggleStatus(task)}
                        className={`p-2 rounded-xl transition-colors shrink-0 mt-0.5 ${
                          task.status === 'Completada' 
                            ? 'bg-[#1c2c4c] text-[#d4af37]' 
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                      >
                        <CheckCircle2 size={20} />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold text-sm ${task.status === 'Completada' ? 'line-through text-gray-400' : 'text-[#1c2c4c]'}`}>
                            {task.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            task.priority === 'Alta' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-blue-50 text-[#1c2c4c] border-blue-200'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-1.5">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                          <span className="font-bold text-[#1c2c4c]">Asignado a: {empName}</span>
                          <span>Fecha Límite: {task.due_date}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center shrink-0"
                      title="Eliminar tarea"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminTareas;
