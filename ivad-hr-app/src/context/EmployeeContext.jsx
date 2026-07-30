import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const EmployeeContext = createContext();

export const useEmployees = () => {
  return useContext(EmployeeContext);
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('ivad_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cargar empleados desde Supabase
  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setEmployees(data);
      setCurrentUser(prevUser => {
        if (!prevUser) return prevUser;
        const updatedUser = data.find(emp => emp.id === prevUser.id);
        return updatedUser || prevUser;
      });
    }
    if (error) console.error("Error fetching employees:", error);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ivad_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ivad_current_user');
    }
  }, [currentUser]);

  const addEmployee = async (employee) => {
    const isAdmin = employee.accessLevel === 'Administrador' || employee.accessLevel === 'Gerencia';
    const initialVerificationStatus = isAdmin ? 'gold' : null;

    const { data, error } = await supabase
      .from('employees')
      .insert([{
        name: employee.name,
        role: employee.role,
        department: employee.dept || employee.department,
        email: employee.email,
        phone: employee.phone || '',
        birthday: employee.birthday || null,
        avatar: null,
        is_admin: isAdmin,
        verification_status: initialVerificationStatus
      }])
      .select();
      
    if (data) setEmployees([...employees, data[0]]);
    if (error) console.error("Error adding employee:", error);
  };

  const updateEmployee = async (id, updatedData) => {
    const { data, error } = await supabase
      .from('employees')
      .update(updatedData)
      .eq('id', id)
      .select();

    if (data && data.length > 0) {
      setEmployees(prev => prev.map(emp => emp.id === id ? data[0] : emp));
      if (currentUser && currentUser.id === id) {
        setCurrentUser(data[0]);
      }
    }
    if (error) console.error("Error updating employee:", error);
  };
  
  const deleteEmployee = async (id) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (!error) {
      setEmployees(employees.filter(emp => emp.id !== id));
    } else {
      console.error("Error deleting employee:", error);
    }
  };
  
  const login = async (email, password) => {
    // Como esta es una versión inicial sin auth real, buscamos por correo.
    // admin principal
    if (email === 'admin@ivad.com' && password === 'admin') {
      const { data } = await supabase.from('employees').select('*').eq('email', email).single();
      if(data) {
        setCurrentUser(data);
        return true;
      } else {
        // En caso de que el admin no exista, crear mock en memoria
        setCurrentUser({ id: '000-admin', name: 'Administrador', role: 'RRHH', email, is_admin: true, avatar: null, verification_status: 'gold' });
        return true;
      }
    }
    
    // Buscar en la DB (en un escenario real validariamos con supabase auth)
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
      
    if (data) {
      // Falta validar password real, por ahora asumimos success
      setCurrentUser(data);
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setCurrentUser(null);
  };

  // ----- VERIFICATION SYSTEM (Supabase) -----
  const [verificationRequests, setVerificationRequests] = useState([]);

  const fetchVerificationRequests = async () => {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('id, employee_id, status, comment, created_at')
      .order('created_at', { ascending: false });
    
    if (data) setVerificationRequests(data);
    if (error) console.error("Error fetching verification requests:", error);
  };

  const fetchVerificationDocument = async (id) => {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('document_base64')
      .eq('id', id)
      .single();
    if (error) {
      console.error("Error fetching document:", error);
      return null;
    }
    return data.document_base64;
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const submitVerification = async (employeeId, fileBase64) => {
    // Primero, verificamos si ya existe una solicitud para este empleado
    const existingIndex = verificationRequests.findIndex(r => r.employee_id === employeeId);
    
    const requestData = {
      employee_id: employeeId,
      document_base64: fileBase64,
      status: 'pending',
      comment: null
    };

    let response;
    
    if (existingIndex >= 0) {
      // Actualizar la existente
      const existingId = verificationRequests[existingIndex].id;
      response = await supabase
        .from('verification_requests')
        .update(requestData)
        .eq('id', existingId)
        .select();
    } else {
      // Crear nueva
      response = await supabase
        .from('verification_requests')
        .insert([requestData])
        .select();
    }

    if (response.error) {
      console.error("Error submitting verification:", response.error);
      return { error: response.error };
    } else if (response.data) {
      await fetchVerificationRequests(); // Recargar solicitudes
      return { data: response.data };
    }
  };

  const approveVerification = async (requestId) => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (req) {
      // 1. Actualizar la solicitud en Supabase
      const { error: reqError } = await supabase
        .from('verification_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
        
      if (!reqError) {
        // 2. Actualizar el empleado en Supabase
        await updateEmployee(req.employee_id, { verification_status: 'verified' });
        await fetchVerificationRequests();
        await fetchEmployees(); // Asegurarnos de recargar la lista de empleados
      } else {
        console.error("Error approving request:", reqError);
      }
    }
  };

  const rejectVerification = async (requestId, comment) => {
    const { error } = await supabase
      .from('verification_requests')
      .update({ status: 'rejected', comment })
      .eq('id', requestId);
      
    if (!error) {
      await fetchVerificationRequests();
    } else {
      console.error("Error rejecting request:", error);
    }
  };

  const revokeVerification = async (employeeId, reason) => {
    // 1. Quitar el estatus verificado del empleado en base de datos
    await updateEmployee(employeeId, { verification_status: null });
    
    // 2. Si tenía una solicitud previa, marcarla como rechazada con el motivo
    const req = verificationRequests.find(r => r.employee_id === employeeId);
    if (req) {
      const { error } = await supabase
        .from('verification_requests')
        .update({ status: 'rejected', comment: `Revocado por: ${reason}` })
        .eq('id', req.id);
        
      if (!error) {
        await fetchVerificationRequests();
      } else {
        console.error("Error revoking request:", error);
      }
    }
    
    // Recargar empleados
    await fetchEmployees();
  };

  return (
    <EmployeeContext.Provider value={{ 
      employees, addEmployee, updateEmployee, deleteEmployee, currentUser, login, logout,
      verificationRequests, submitVerification, approveVerification, rejectVerification, revokeVerification,
      fetchVerificationDocument
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
