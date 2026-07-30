import { ChevronLeft, CheckCircle2, Clock, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      title: 'Completar Evaluación de Desempeño',
      assignedBy: 'Recursos Humanos',
      dueDate: '30 May 2024',
      status: 'pending',
      description: 'Por favor completa tu autoevaluación correspondiente al primer semestre.'
    },
    {
      id: 2,
      title: 'Entregar Reporte de Ventas Mz',
      assignedBy: 'Gerencia',
      dueDate: '25 May 2024',
      status: 'completed',
      description: 'Cargar el reporte de ventas del mes de marzo en la carpeta compartida.'
    },
    {
      id: 3,
      title: 'Firmar Política de Confidencialidad',
      assignedBy: 'Recursos Humanos',
      dueDate: '15 Jun 2024',
      status: 'pending',
      description: 'Revisar y firmar el nuevo anexo de política de privacidad de datos.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-10">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Mis Tareas</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 mb-2">
            <div className="bg-[#d4af37]/20 p-4 rounded-full">
              <ClipboardList size={32} className="text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1c2c4c] text-lg">Asignaciones</h3>
              <p className="text-sm text-gray-500 leading-tight">Aquí verás las tareas que RR.HH. o Gerencia te han asignado.</p>
            </div>
          </div>

          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
              {/* Borde izquierdo de color según estado */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.status === 'completed' ? 'bg-green-500' : 'bg-[#d4af37]'}`}></div>
              
              <div className="flex justify-between items-start mb-2 pl-2">
                <h4 className="font-bold text-[#1c2c4c] text-lg">{task.title}</h4>
                {task.status === 'completed' ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={14} /> Completada
                  </span>
                ) : (
                  <span className="bg-yellow-50 text-[#d4af37] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <Clock size={14} /> Pendiente
                  </span>
                )}
              </div>
              
              <div className="pl-2 space-y-2">
                <p className="text-gray-600 text-sm">{task.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-500">Por:</span> {task.assignedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={14} /> {task.dueDate}
                  </span>
                </div>
              </div>
              
              {task.status === 'pending' && (
                <div className="mt-4 pl-2">
                  <button className="w-full bg-white border-2 border-[#1c2c4c] text-[#1c2c4c] font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Marcar como completada
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
