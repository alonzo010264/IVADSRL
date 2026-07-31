import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const LeaveApprovals = () => {
  const requests = [
    {
      id: 1,
      type: 'Permiso Personal',
      dateRange: '15 Oct - 17 Oct',
      requestedAt: '01 Oct',
      status: 'Aprobado',
      reviewer: 'María Rodriguez',
      reviewerRole: 'Recursos Humanos',
      reviewerImg: 'https://i.pravatar.cc/150?img=5',
      comments: 'Aprobado según política. Disfruta de tus días libres, María.'
    },
    {
      id: 2,
      type: 'Vacaciones',
      dateRange: '20 Nov - 30 Nov',
      requestedAt: '10 Oct',
      status: 'Pendiente',
      reviewer: 'Manuel Gómez',
      reviewerRole: 'Gerente de Área',
      reviewerImg: 'https://i.pravatar.cc/150?img=11',
      comments: 'En proceso de revisión por parte de la gerencia.'
    },
    {
      id: 3,
      type: 'Licencia Médica',
      dateRange: '05 Sep - 07 Sep',
      requestedAt: '04 Sep',
      status: 'Denegado',
      reviewer: 'Laura Fernández',
      reviewerRole: 'Coordinadora RRHH',
      reviewerImg: 'https://i.pravatar.cc/150?img=9',
      comments: 'Falta adjuntar el certificado médico original. Por favor, realiza una nueva solicitud con el documento adjunto.'
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Aprobado':
        return {
          bg: 'bg-[#1c2c4c] text-[#d4af37] border border-[#d4af37]/40',
          icon: <CheckCircle2 size={20} className="text-[#d4af37] mr-1.5" />
        };
      case 'Pendiente':
        return {
          bg: 'bg-[#1c2c4c]/90 text-amber-300 border border-amber-400/30',
          icon: <Clock size={20} className="text-amber-300 mr-1.5" />
        };
      case 'Denegado':
        return {
          bg: 'bg-gray-800 text-gray-200 border border-gray-600',
          icon: <XCircle size={20} className="text-red-400 mr-1.5" />
        };
      default:
        return {
          bg: 'bg-[#1c2c4c] text-white',
          icon: null
        };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="p-4 w-full max-w-3xl pt-8">
        
        <h1 className="text-2xl font-bold text-center text-[#0b1b3d] mb-10">Estatus de Solicitudes</h1>

        <div className="space-y-12">
          {requests.map((req) => {
            const statusConfig = getStatusConfig(req.status);
            
            return (
              <div key={req.id} className="relative bg-white rounded-xl p-6 shadow-md border border-gray-100 mt-6">
                
                {/* Badge Flotante (Estatus) */}
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 flex items-center px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-md ${statusConfig.bg}`}>
                  {statusConfig.icon}
                  {req.status}
                </div>

                <div className="text-center mt-4 border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-[#0b1b3d] mb-2">{req.type}</h2>
                  <p className="text-sm text-gray-700">Fecha: {req.dateRange}</p>
                  <p className="text-sm text-gray-700">Solicitado el: {req.requestedAt}</p>
                </div>

                <div className="py-4 border-b border-gray-100">
                  <h3 className="font-bold text-[#0b1b3d] mb-3">Revisado por</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] p-[2px] shrink-0 shadow-sm">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                        {req.reviewerImg ? (
                          <img src={req.reviewerImg} alt={req.reviewer} className="w-full h-full object-cover scale-[1.35]" />
                        ) : (
                          <img src="/logo.png" alt="IVAD" className="w-full h-full object-cover p-1" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 leading-tight">{req.reviewer}</p>
                      <p className="text-xs text-[#d4af37] font-bold mt-0.5">{req.reviewerRole}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-bold text-[#0b1b3d] mb-2">Comentarios</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {req.comments}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovals;
