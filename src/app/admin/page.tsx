'use client';
import { useState, useEffect } from 'react';
import { Badge, Button } from '@/components/ui';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { useVoluntarios } from '@/hooks/useVoluntarios';
import { useCertificados } from '@/hooks/useCertificados';
import { formatearFecha } from '@/utils/formatters';
import { useNotif } from '@/context/NotifContext';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'postulaciones' | 'certificados'>('postulaciones');
  const { postulaciones, loading: load1, fetchPostulaciones } = useVoluntarios();
  const { certificados, loading: load2, fetchCertificados } = useCertificados();
  const { notify } = useNotif();
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPostulaciones();
    fetchCertificados();
  }, [fetchPostulaciones, fetchCertificados]);

  const stats = {
    postulaciones: postulaciones.length,
    aprobadas: certificados.filter(c => c.estado === 'aprobado').length,
    pendientes: postulaciones.filter(p => p.estadopostulacion === 'pendiente').length + certificados.filter(c => c.estado === 'pendiente').length
  };

  const handleUpdateVol = async (id: string, estado: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/voluntarios', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id, estado }) // API still expects 'estado' in body mapping to 'estadopostulacion'
      });
      if(!res.ok) throw new Error();
      notify(`Postulación ${estado}`, 'success');
      fetchPostulaciones();
    } catch {
      notify('Error al actualizar estado', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateCert = async (id: string, estado: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/certificados', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id, estado })
      });
      if(!res.ok) throw new Error();
      notify(`Certificado ${estado}`, 'success');
      fetchCertificados();
    } catch {
      notify('Error al procesar certificado', 'error');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col pt-8 relative">
           <div className="absolute top-4 right-4 text-gray-300">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
           </div>
           <span className="text-gray-500 font-medium tracking-tight mb-2">Total Postulaciones</span>
           <span className="text-4xl font-bold text-gray-900 mb-1">{stats.postulaciones}</span>
           <span className="text-xs text-emerald-600 font-medium">+12% desde el mes pasado</span>
        </Card>
        <Card className="p-6 flex flex-col pt-8 relative">
           <div className="absolute top-4 right-4 text-gray-300">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           </div>
           <span className="text-gray-500 font-medium tracking-tight mb-2">Actividades Certificadas</span>
           <span className="text-4xl font-bold text-gray-900 mb-1">{stats.aprobadas}</span>
           <span className="text-xs text-gray-400 font-medium">Certificados disponibles</span>
        </Card>
        <Card className="p-6 flex flex-col pt-8 relative border-l-4 border-l-amber-400">
           <div className="absolute top-4 right-4 text-amber-200">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
           </div>
           <span className="text-gray-500 font-medium tracking-tight mb-2">Pendientes Totales</span>
           <span className="text-4xl font-bold text-gray-900 mb-1">{stats.pendientes}</span>
           <span className="text-xs text-amber-600 font-medium">Requieren revisión</span>
        </Card>
      </div>

      {/* REVISIÓN BOARD */}
      <div>
        <div className="flex w-full mb-6 gap-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'postulaciones' ? 'bg-[#1B4332] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
            onClick={() => setTab('postulaciones')}
          >
            👥 Postulaciones
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'certificados' ? 'bg-[#1B4332] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
            onClick={() => setTab('certificados')}
          >
            🏅 Solicitudes de Certificados
          </button>
        </div>

        <Card className="p-6 shadow-sm">
          {tab === 'postulaciones' ? (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Gestión de Postulaciones</h3>
                <p className="text-gray-500 text-sm">Revisar y aprobar postulaciones de voluntarios</p>
              </div>
              <Table columns={["Voluntario", "Fecha", "Actividad", "Estado", "Acciones"]}>
                {postulaciones.map(p => (
                  <tr key={p.idpostulaciones} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{(p as any).voluntarios?.usuarios?.nombrecompleto || 'Usuario N/A'}</td>
                    <td className="px-6 py-4 text-sm">{formatearFecha(p.fechapostulacion)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{(p as any).actividades?.nombreactividad || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={p.estadopostulacion === 'aprobada' ? 'success' : p.estadopostulacion === 'rechazada' ? 'error' : p.estadopostulacion === 'completada' ? 'info' : 'warning'}>
                        {p.estadopostulacion.charAt(0).toUpperCase() + p.estadopostulacion.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {p.estadopostulacion === 'pendiente' ? (
                         <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="text-emerald-700 border-emerald-600 hover:bg-emerald-50 px-3 py-1 text-xs h-8"
                              onClick={() => handleUpdateVol(p.idpostulaciones, 'aprobada')}
                              isLoading={updating === p.idpostulaciones}
                            >
                              ✓ Aprobar
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-red-700 border-red-600 hover:bg-red-50 px-3 py-1 text-xs h-8"
                              onClick={() => handleUpdateVol(p.idpostulaciones, 'rechazada')}
                              disabled={updating === p.idpostulaciones}
                            >
                              ✗ Rechazar
                            </Button>
                         </div>
                      ) : (
                        <span className={`text-sm font-semibold ${p.estadopostulacion === 'aprobada' ? 'text-emerald-700' : p.estadopostulacion === 'rechazada' ? 'text-red-600' : 'text-blue-600'}`}>
                          {p.estadopostulacion === 'aprobada' ? '✓ Aprobada' : p.estadopostulacion === 'rechazada' ? '✗ Rechazada' : '✓ Completada'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {postulaciones.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">No hay postulaciones registradas.</td>
                  </tr>
                )}
              </Table>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Solicitudes de Certificación</h3>
                <p className="text-gray-500 text-sm">Generación y aprobación de certificados para voluntarios/donantes</p>
              </div>
              
              {certificados.filter(c => c.estado === 'pendiente').length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">🏅</div>
                  <p className="text-gray-500">No hay solicitudes de certificación pendientes</p>
                </div>
              ) : (
                <Table columns={["Voluntario", "Certificado / Actividad", "Fecha Solicitud", "Estado", "Acciones"]}>
                  {certificados.filter(c => c.estado === 'pendiente').map(c => (
                    <tr key={c.idcertificados} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">{c.nombrevoluntario}</td>
                      <td className="px-6 py-4 text-sm">{c.actividadasociada}</td>
                      <td className="px-6 py-4 text-sm">{formatearFecha(c.created_at || new Date().toISOString())}</td>
                      <td className="px-6 py-4"><Badge variant="warning">Pendiente</Badge></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                            <Button 
                              variant="primary" 
                              className="px-3 py-1 text-xs h-8"
                              onClick={() => handleUpdateCert(c.idcertificados, 'aprobado')}
                              isLoading={updating === c.idcertificados}
                            >
                              ✓ Aprobar
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-red-700 border-red-600 hover:bg-red-50 px-3 py-1 text-xs h-8"
                              onClick={() => handleUpdateCert(c.idcertificados, 'rechazado')}
                              disabled={updating === c.idcertificados}
                            >
                              ✗ Rechazar
                            </Button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
            </>
          )}
        </Card>
      </div>

    </div>
  );
}
