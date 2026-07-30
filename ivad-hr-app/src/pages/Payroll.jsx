import { useState, useEffect } from 'react';
import { ChevronLeft, Download, DollarSign, Calendar, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useEmployees } from '../context/EmployeeContext';

const Payroll = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  useEffect(() => {
    const fetchPayrolls = async () => {
      if (!currentUser?.id) return;
      
      const { data, error } = await supabase
        .from('payrolls')
        .select('*')
        .eq('employee_id', currentUser.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setPayrolls(data);
      }
      setLoading(false);
    };

    fetchPayrolls();
  }, [currentUser]);

  const lastPayment = payrolls.length > 0 ? payrolls[0] : null;

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-10 relative">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate('/inicio')} className="p-1 mr-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Nómina y Pagos</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="bg-[#1c2c4c] rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Último pago recibido</p>
              {lastPayment ? (
                <>
                  <h3 className="text-3xl font-bold text-[#d4af37]">RD$ {lastPayment.net_amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h3>
                  <p className="text-sm mt-1 flex items-center gap-1 text-gray-300"><Calendar size={14} /> {lastPayment.period}</p>
                </>
              ) : (
                <h3 className="text-xl font-bold text-[#d4af37]">Sin pagos registrados</h3>
              )}
            </div>
            <div className="bg-white/10 p-4 rounded-full">
              <DollarSign size={32} className="text-[#d4af37]" />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-[#1c2c4c] text-lg mb-4 px-2">Historial de Pagos</h3>
            
            {loading ? (
              <p className="text-center text-gray-500 py-10">Cargando pagos...</p>
            ) : payrolls.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100">
                <p className="text-gray-500">No tienes historial de pagos aún.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payrolls.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#f8f9fc] p-2.5 rounded-xl mt-1">
                          <FileText size={20} className="text-[#1c2c4c]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{payment.period}</h4>
                          <p className="text-sm text-gray-500">{payment.type}</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-sm whitespace-nowrap">
                        RD$ {payment.net_amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                      <span className="text-xs font-medium text-gray-400">Estado: <span className="text-gray-600">{payment.status}</span></span>
                      
                      <button 
                        onClick={() => setSelectedPayroll(payment)}
                        className="flex items-center gap-1 text-sm font-bold text-[#1c2c4c] hover:text-[#d4af37] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
                      >
                        <Download size={16} /> Volante de Pago
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Recibo Modal (Estilo Documento Formal) */}
      {selectedPayroll && (
        <div className="fixed inset-0 bg-gray-900/80 z-50 flex items-center justify-center p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-md w-full max-w-2xl shadow-2xl animate-fade-in relative my-auto">
            <button onClick={() => setSelectedPayroll(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10 bg-gray-100 rounded-full p-1.5 shadow-sm">
              <X size={20} />
            </button>
            
            <div id="receipt-content" className="p-10 text-gray-800">
              {/* Encabezado del Documento */}
              <div className="flex justify-between items-start border-b-2 border-[#1c2c4c] pb-6 mb-8">
                <div>
                  <img src="/logo.png" alt="IVAD Logo" className="h-16 object-contain mb-2" />
                  <p className="text-xs text-gray-500">IVAD Home & Goods S.R.L.</p>
                  <p className="text-xs text-gray-500">RNC: 1-32-45678-9</p>
                </div>
                <div className="text-right">
                  <h2 className="text-[#1c2c4c] font-bold text-2xl uppercase tracking-wider mb-1">Volante de Pago</h2>
                  <p className="text-sm font-medium text-gray-600">Comprobante Digital</p>
                  <p className="text-xs text-gray-500 mt-2">Nº Transacción: <span className="font-mono">{selectedPayroll.id.split('-')[0].toUpperCase()}</span></p>
                </div>
              </div>

              {/* Información del Empleado y Período */}
              <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                  <h3 className="font-bold text-[#1c2c4c] border-b border-gray-200 pb-1 mb-3 uppercase text-xs">Datos del Empleado</h3>
                  <table className="w-full">
                    <tbody>
                      <tr><td className="py-1 text-gray-500 w-24 font-medium">Nombre:</td><td className="py-1 font-bold">{currentUser?.name}</td></tr>
                      <tr><td className="py-1 text-gray-500 w-24 font-medium">Cargo:</td><td className="py-1">{currentUser?.role}</td></tr>
                      <tr><td className="py-1 text-gray-500 w-24 font-medium">Depto:</td><td className="py-1">{currentUser?.department}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-bold text-[#1c2c4c] border-b border-gray-200 pb-1 mb-3 uppercase text-xs">Detalles del Pago</h3>
                  <table className="w-full">
                    <tbody>
                      <tr><td className="py-1 text-gray-500 w-24 font-medium">Período:</td><td className="py-1 font-bold">{selectedPayroll.period}</td></tr>
                      <tr><td className="py-1 text-gray-500 w-24 font-medium">Emisión:</td><td className="py-1">{new Date(selectedPayroll.created_at).toLocaleDateString('es-DO')}</td></tr>
                      <tr><td className="py-1 text-gray-500 w-24 font-medium">Concepto:</td><td className="py-1">{selectedPayroll.type}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tabla de Desglose */}
              <div className="mb-8">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-[#1c2c4c]">
                      <th className="py-3 px-4 text-left font-bold border border-gray-200 w-2/3">Concepto</th>
                      <th className="py-3 px-4 text-right font-bold border border-gray-200 w-1/3">Importe (RD$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border border-gray-200">Monto Bruto ({selectedPayroll.type})</td>
                      <td className="py-3 px-4 border border-gray-200 text-right">{selectedPayroll.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    {selectedPayroll.deductions > 0 && (
                      <tr>
                        <td className="py-3 px-4 border border-gray-200 text-red-600">Deducciones (TSS/AFP)</td>
                        <td className="py-3 px-4 border border-gray-200 text-right text-red-600">- {selectedPayroll.deductions.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                    <tr className="bg-gray-50">
                      <td className="py-4 px-4 border border-gray-200 font-bold text-lg text-[#1c2c4c] text-right">TOTAL NETO A PAGAR:</td>
                      <td className="py-4 px-4 border border-gray-200 font-bold text-xl text-[#1c2c4c] text-right">
                        {selectedPayroll.net_amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Notas Opcionales */}
              {selectedPayroll.notes && (
                <div className="mb-8 bg-[#fffcf3] border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
                  <span className="block font-bold text-yellow-800 mb-1 uppercase text-xs">Observaciones / Detalles Adicionales:</span>
                  <span className="whitespace-pre-wrap">{selectedPayroll.notes}</span>
                </div>
              )}

              {/* Datos Bancarios y Firmas */}
              <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 text-xs uppercase">Vía de Pago Depositado En:</h3>
                  <p className="text-gray-600">Banco: <span className="font-bold text-gray-900">{selectedPayroll.bank_name}</span></p>
                  <p className="text-gray-600">Cuenta: <span className="font-bold text-gray-900">****{selectedPayroll.account_number.slice(-4)}</span></p>
                </div>
                <div className="text-center pt-8">
                  <div className="border-t border-gray-400 mx-8 pt-2">
                    <p className="font-medium text-gray-700">Firma del Empleado</p>
                    <p className="text-xs text-gray-400 mt-1">Aceptación de conformidad</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-12 text-xs text-gray-400">
                Este documento es generado automáticamente por el sistema de RRHH de IVAD. No requiere firma física del empleador.
              </div>
            </div>

            {/* Acción Botón Modal */}
            <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end rounded-b-md print:hidden">
              <button onClick={() => window.print()} className="bg-[#1c2c4c] text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-colors shadow-md">
                <Download size={18} /> Imprimir / Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payroll;
