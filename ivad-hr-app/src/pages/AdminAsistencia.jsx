import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Save, CheckCircle2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AdminAsistencia = () => {
  const navigate = useNavigate();
  const { employees } = useEmployees();

  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState('');
  const [savingEmpId, setSavingEmpId] = useState(null);

  // Cargar datos reales desde Supabase o inicializar en 0
  useEffect(() => {
    const fetchAttendance = async () => {
      const { data } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('month_period', selectedMonth);

      const dbMap = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          dbMap[item.employee_id] = item;
        });
      }

      const map = {};
      employees.forEach(emp => {
        map[emp.id] = dbMap[emp.id] || {
          days_worked: 0,
          tardanzas: 0,
          justified_absences: 0,
          unjustified_absences: 0,
          overtime_hours: 0,
          performance_status: 'Excelente'
        };
      });

      setAttendanceData(map);
    };

    fetchAttendance();
  }, [employees, selectedMonth]);

  const handleInputChange = (empId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: value
      }
    }));
  };

  const handleSaveAttendance = async (emp) => {
    setSavingEmpId(emp.id);
    setMessage('');

    const record = {
      employee_id: emp.id,
      employee_name: emp.name,
      month_period: selectedMonth,
      ...attendanceData[emp.id],
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('attendance_records')
      .upsert([record], { onConflict: 'employee_id,month_period' });

    setMessage(`¡Asistencia de ${emp.name} guardada en Supabase para el período ${selectedMonth}!`);
    setSavingEmpId(null);
    setTimeout(() => setMessage(''), 4000);
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
            <h1 className="text-xl font-bold">Registro de Asistencia Mensual</h1>
            <p className="text-sm text-[#d4af37]">Control de Faltas, Tardanzas y Horas Extra</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Selector de Mes / Período */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1c2c4c]/10 text-[#1c2c4c] rounded-full flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c2c4c]">Seleccionar Período Mensual</h2>
              <p className="text-xs text-gray-500">Digita la asistencia del personal para el mes seleccionado</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#1c2c4c] focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]" 
            />
          </div>
        </div>

        {message && (
          <div className="p-4 bg-blue-50 text-[#1c2c4c] rounded-2xl font-medium text-sm border border-blue-100 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#d4af37]" />
            {message}
          </div>
        )}

        {/* Tabla / Lista de Empleados para Digitado */}
        <div className="space-y-4">
          {employees.map(emp => {
            const empData = attendanceData[emp.id] || {
              days_worked: 0,
              tardanzas: 0,
              justified_absences: 0,
              unjustified_absences: 0,
              overtime_hours: 0,
              performance_status: 'Excelente'
            };

            return (
              <div key={emp.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                
                {/* Cabecera del Empleado */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] p-[2px] shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                        {emp.avatar ? (
                          <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover scale-[1.35]" />
                        ) : (
                          <User size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1c2c4c] text-sm">{emp.name}</h3>
                      <p className="text-xs text-[#d4af37] font-semibold">{emp.role} • {emp.department || 'Operaciones'}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSaveAttendance(emp)}
                    disabled={savingEmpId === emp.id}
                    className="flex items-center gap-1.5 bg-[#1c2c4c] text-[#d4af37] text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-opacity-95 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{savingEmpId === emp.id ? 'Guardando...' : 'Guardar Asistencia'}</span>
                  </button>
                </div>

                {/* Grid de Inputs de Asistencia */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Días Asistidos</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={empData.days_worked} 
                      onChange={(e) => handleInputChange(emp.id, 'days_worked', parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1c2c4c] text-center" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tardanzas</label>
                    <input 
                      type="number" 
                      min="0"
                      value={empData.tardanzas} 
                      onChange={(e) => handleInputChange(emp.id, 'tardanzas', parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1c2c4c] text-center" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Ausencias Justificadas</label>
                    <input 
                      type="number" 
                      min="0"
                      value={empData.justified_absences} 
                      onChange={(e) => handleInputChange(emp.id, 'justified_absences', parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-blue-700 text-center" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Ausencias Injustificadas</label>
                    <input 
                      type="number" 
                      min="0"
                      value={empData.unjustified_absences} 
                      onChange={(e) => handleInputChange(emp.id, 'unjustified_absences', parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-amber-800 text-center" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Horas Extra</label>
                    <input 
                      type="number" 
                      min="0"
                      value={empData.overtime_hours} 
                      onChange={(e) => handleInputChange(emp.id, 'overtime_hours', parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#d4af37] text-center" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Estatus General</label>
                    <select 
                      value={empData.performance_status} 
                      onChange={(e) => handleInputChange(emp.id, 'performance_status', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1c2c4c]"
                    >
                      <option value="Excelente">Excelente</option>
                      <option value="Regular">Regular</option>
                      <option value="Atención Requerida">Atención Requerida</option>
                    </select>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AdminAsistencia;
