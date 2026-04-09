'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { useAuth } from '@/hooks/useAuth';
import { formatearFecha } from '@/utils/formatters';

export default function AdminPostulacionesPage() {
  const { token } = useAuth();
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchPostulaciones = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/postulaciones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar las postulaciones');
      const data = await res.json();
      setPostulaciones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostulaciones();
  }, [token]);

  const handleAction = async (idpostulaciones: number, nuevoEstado: 'Aprobada' | 'Rechazada') => {
    if (!token) return;
    setActionLoading(idpostulaciones);
    try {
      const res = await fetch('/api/admin/postulaciones', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idpostulaciones, nuevoEstado })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar estado');
      }
      
      // Refresh list after action
      await fetchPostulaciones();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Cargando postulaciones...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">Gestión de Postulaciones</h2>
          <p className="text-gray-500 mt-2">Aprueba o rechaza las solicitudes de voluntarios a actividades.</p>
        </div>
        <div className="bg-[#EAF4F0] text-[#2D6A4F] px-4 py-2 rounded-xl font-semibold">
          {postulaciones.length} Registros
        </div>
      </div>

      <Card className="p-6 overflow-hidden bg-white shadow-md border border-gray-100 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-4 text-sm font-semibold text-gray-600">Voluntario / Email</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600">Actividad</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600">Comentario</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {postulaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">No hay postulaciones registradas</td>
                </tr>
              ) : (
                postulaciones.map((p) => {
                  const voluntario = p.voluntarios?.usuarios;
                  const isPending = p.estadopostulacion === 'Pendiente';
                  
                  return (
                    <tr key={p.idpostulaciones} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">{voluntario?.nombrecompleto || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{voluntario?.correo || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium">
                        {p.actividades?.nombreactividad || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatearFecha(p.fechapostulacion)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate" title={p.comentario}>
                        {p.comentario || <span className="text-gray-400 italic">Sin comentario</span>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                          p.estadopostulacion === 'Aprobada' ? 'bg-[#D8F3DC] text-[#1B4332]' :
                          p.estadopostulacion === 'Rechazada' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {p.estadopostulacion}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          {isPending ? (
                            <>
                              <button
                                disabled={actionLoading === p.idpostulaciones}
                                onClick={() => handleAction(p.idpostulaciones, 'Aprobada')}
                                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                              >
                                {actionLoading === p.idpostulaciones ? '...' : 'Aprobar'}
                              </button>
                              <button
                                disabled={actionLoading === p.idpostulaciones}
                                onClick={() => handleAction(p.idpostulaciones, 'Rechazada')}
                                className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-transparent px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                              >
                                {actionLoading === p.idpostulaciones ? '...' : 'Rechazar'}
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400">Sin acciones</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
