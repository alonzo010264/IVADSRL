import { useState } from 'react';
import { Search, Mail, Phone, Plus, Edit, Trash2, X } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import { Link } from 'react-router-dom';
import { CustomVerificationBadge } from '../components/VerificationBadge';

const Directory = () => {
  const [activeTab, setActiveTab] = useState('Todos');
  const { employees, currentUser, updateEmployee, deleteEmployee } = useEmployees();
  
  const [editingEmp, setEditingEmp] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', role: '', department: '', email: '', phone: '', birthday: '' });

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setEditForm({ name: emp.name, role: emp.role, department: emp.department || emp.dept || '', email: emp.email || '', phone: emp.phone || '', birthday: emp.birthday || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateEmployee(editingEmp.id, editForm);
    setEditingEmp(null);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${editingEmp.name}?`)) {
      await deleteEmployee(editingEmp.id);
      setEditingEmp(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      
      <div className="bg-white pt-4 pb-2 px-4 shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-ivad-blue">Equipo de Trabajo</h2>
            {currentUser?.is_admin && (
              <Link to="/admin" className="flex items-center gap-1 bg-ivad-gold text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                <Plus size={16} /> Crear usuario
              </Link>
            )}
          </div>
          
          {/* Búsqueda */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            <input
              type="text"
              placeholder="Buscar por nombre, cargo o área..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ivad-blue"
            />
          </div>
          <button className="text-ivad-blue font-medium px-2">Filtros</button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['Todos', 'Por Área', 'Aniversarios'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Lista de Empleados */}
      <div className="p-4 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees
            .filter(emp => emp.id !== currentUser?.id) // Ocultar al usuario actual
            .map((emp) => {
              // Asignación de verificación temporal (para Alonzo u otros)
              // En un entorno real esto vendría de emp.verification_status
              const isVerified = emp.verification_status;

              return (
                <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow relative">
                
                <Link to={`/empleado/${emp.id}`} className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] shrink-0 bg-white shadow-sm flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  {emp.avatar ? (
                    <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover scale-[1.35]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                  )}
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/empleado/${emp.id}`} className="flex items-center gap-1 hover:underline">
                    <h3 className="font-bold text-ivad-blue truncate">{emp.name}</h3>
                    <CustomVerificationBadge status={isVerified} className="w-[18px] h-[18px] shrink-0" />
                  </Link>
                  <p className="text-xs text-ivad-gold font-medium truncate">{emp.role}</p>
                  <p className="text-[11px] text-gray-500 truncate">{emp.department}</p>
                  <p className="text-[11px] text-gray-500 truncate">{emp.email}</p>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 items-center justify-center">
                  <a href={`mailto:${emp.email}`} className="bg-gray-100 p-2 rounded-full text-ivad-blue hover:bg-gray-200 border border-ivad-blue">
                    <Mail size={16} />
                  </a>
                  {currentUser?.is_admin && (
                    <button onClick={() => openEditModal(emp)} className="bg-gray-100 p-2 rounded-full text-ivad-gold hover:bg-gray-200 border border-ivad-gold">
                      <Edit size={16} />
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-ivad-blue text-lg">Editar Empleado</h3>
              <button onClick={() => setEditingEmp(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ivad-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ivad-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input required type="text" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ivad-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input required type="text" value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ivad-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ivad-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input type="date" value={editForm.birthday} onChange={e => setEditForm({...editForm, birthday: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ivad-blue" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button type="button" onClick={handleDelete} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} /> Eliminar
                </button>
                <div className="space-x-2">
                  <button type="button" onClick={() => setEditingEmp(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-ivad-gold rounded-lg hover:bg-yellow-600">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Directory;
