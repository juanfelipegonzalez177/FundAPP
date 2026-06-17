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

  // Filter and Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | ''>('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filter & Sort Logic
  const filteredPostulaciones = postulaciones
    .filter(p => {
      const name = p.voluntarios?.usuarios?.nombrecompleto || '';
      const email = p.voluntarios?.usuarios?.correo || '';
      const act = p.actividades?.nombreactividad || '';
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.toLowerCase().includes(searchTerm.toLowerCase());
      
      const pDate = p.fechapostulacion;
      const matchesDate = !filterDate || (pDate && pDate.startsWith(filterDate)) || (pDate && pDate >= filterDate);
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const valA = a.voluntarios?.usuarios?.nombrecompleto || '';
      const valB = b.voluntarios?.usuarios?.nombrecompleto || '';
      return sortBy === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    });

  const totalItems = filteredPostulaciones.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPostulaciones = filteredPostulaciones.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Cargando postulaciones...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border-custom">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-display">Gestión de Postulaciones</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Aprueba o rechaza las solicitudes de voluntarios a actividades.</p>
        </div>
        <div className="bg-[#EAF4F0] dark:bg-primary/20 text-[#2D6A4F] dark:text-secondary px-4 py-2 rounded-xl font-semibold">
          {filteredPostulaciones.length} Registros
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 bg-surface p-4 rounded-2xl border border-border-custom shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Buscar</label>
          <input
            type="text"
            placeholder="Buscar por voluntario, correo o actividad..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-border-custom bg-surface px-4 py-2.5 text-sm text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-surface dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Orden Alfabético</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-border-custom bg-surface px-4 py-2.5 text-sm text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-surface dark:text-gray-100"
          >
            <option value="">Sin ordenar</option>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Filtrar por fecha postulación (desde)</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border-custom bg-surface px-4 py-2.5 text-sm text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-surface dark:text-gray-100"
            />
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate('');
                  setCurrentPage(1);
                }}
                className="px-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      <Card className="p-6 overflow-hidden bg-white dark:bg-surface shadow-md border border-gray-100 dark:border-border-custom rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-border-custom">
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 dark:text-gray-350">Voluntario / Email</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 dark:text-gray-350">Actividad</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 dark:text-gray-350">Fecha</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 dark:text-gray-350">Comentario</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 dark:text-gray-350">Estado</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-600 dark:text-gray-350 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPostulaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">No hay postulaciones registradas</td>
                </tr>
              ) : (
                paginatedPostulaciones.map((p) => {
                  const voluntario = p.voluntarios?.usuarios;
                  const isPending = p.estadopostulacion === 'Pendiente';
                  
                  return (
                    <tr key={p.idpostulaciones} className="border-b border-gray-100 dark:border-border-custom hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{voluntario?.nombrecompleto || 'N/A'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{voluntario?.correo || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-200 font-medium">
                        {p.actividades?.nombreactividad || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-350">
                        {formatearFecha(p.fechapostulacion)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-350 max-w-xs truncate" title={p.comentario}>
                        {p.comentario || <span className="text-gray-400 dark:text-gray-500 italic">Sin comentario</span>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                          p.estadopostulacion === 'Aprobada' ? 'bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40' :
                          p.estadopostulacion === 'Rechazada' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/40' :
                          'bg-yellow-100 text-yellow-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40'
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
                                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md cursor-pointer"
                              >
                                {actionLoading === p.idpostulaciones ? '...' : 'Aprobar'}
                              </button>
                              <button
                                disabled={actionLoading === p.idpostulaciones}
                                onClick={() => handleAction(p.idpostulaciones, 'Rechazada')}
                                className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-600 border border-red-200 dark:border-red-900/50 hover:border-transparent px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md cursor-pointer"
                              >
                                {actionLoading === p.idpostulaciones ? '...' : 'Rechazar'}
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">Sin acciones</span>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border-custom pt-4 mt-6 text-text-muted">
            <span className="text-sm font-semibold dark:text-gray-300">
              Página {currentPage} de {totalPages} ({totalItems} registros)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-bold border border-border-custom rounded-lg bg-surface hover:bg-gray-150 dark:hover:bg-gray-800 text-text transition-all disabled:opacity-50 cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-bold border border-border-custom rounded-lg bg-surface hover:bg-gray-150 dark:hover:bg-gray-800 text-text transition-all disabled:opacity-50 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
