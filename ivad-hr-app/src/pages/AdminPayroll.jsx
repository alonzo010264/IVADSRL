import { useState } from 'react';
import { ChevronLeft, DollarSign, Send, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AdminPayroll = () => {
  const navigate = useNavigate();
  const { employees } = useEmployees();
  
  const [formData, setFormData] = useState({
    employee_id: '',
    period: '',
    type: 'Quincena Normal',
    amount: '',
    deductions: '',
    bank_name: '',
    account_number: '',
    notes: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) {
      setMessage('Error: Debes seleccionar un empleado.');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const grossAmount = parseFloat(formData.amount) || 0;
      const deductions = parseFloat(formData.deductions) || 0;
      const netAmount = grossAmount - deductions;

      const { error } = await supabase.from('payrolls').insert([{
        employee_id: formData.employee_id,
        period: formData.period,
        type: formData.type,
        amount: grossAmount,
        deductions: deductions,
        net_amount: netAmount,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        notes: formData.notes,
        status: 'Pagado'
      }]);

      if (error) throw error;
      
      setMessage('¡Pago registrado con éxito!');
      setFormData({
        employee_id: '',
        period: '',
        type: 'Quincena Normal',
        amount: '',
        deductions: '',
        bank_name: '',
        account_number: '',
        notes: '',
      });
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar el pago.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
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
            <h1 className="text-xl font-bold">Administración de Nómina</h1>
            <p className="text-sm text-[#d4af37]">Registrar Pagos</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-[#f8f9fc] rounded-full flex items-center justify-center">
              <DollarSign className="text-[#1c2c4c]" size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#1c2c4c]">Generar Volante de Pago</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl font-medium text-sm flex items-center gap-2 border ${message.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
               <ShieldAlert size={16} className={message.includes('Error') ? 'text-red-600' : 'text-green-600'} />
               {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
              <select required name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none">
                <option value="">-- Selecciona un empleado --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período de Pago</label>
                <input required type="text" name="period" value={formData.period} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. 15 de Mayo, 2024" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concepto / Tipo de Pago</label>
                <select required name="type" value={formData.type} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none">
                  <option value="Quincena Normal">Quincena Normal</option>
                  <option value="Pago Mensual">Pago Mensual</option>
                  <option value="Quincena + Bono">Quincena + Bono</option>
                  <option value="Liquidación">Liquidación</option>
                  <option value="Bono Especial">Bono Especial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Bruto (RD$)</label>
                <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="25000.00" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deducciones (RD$)</label>
                <input type="number" step="0.01" name="deductions" value={formData.deductions} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="0.00 (TSS, AFP, etc.)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banco Destino</label>
                <input required type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. Banco Popular" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta</label>
                <input required type="text" name="account_number" value={formData.account_number} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. 763489234" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Más detalles / Notas (Opcional)</label>
              <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none resize-none" placeholder="Ej. El pago incluye reembolso de viáticos..."></textarea>
            </div>

            <div className="pt-4">
              <button disabled={isSubmitting} type="submit" className="w-full bg-[#1c2c4c] text-white font-bold py-4 rounded-xl shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Send size={20} />
                {isSubmitting ? 'Registrando...' : 'Emitir Volante de Pago'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPayroll;
