'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { formatearFecha } from '@/utils/formatters';
import { ActivityForm } from '@/components/forms/ActivityForm';

export default function AdminActividadesPage() {
  const { token } = useAuth();
  const [actividades, setActividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | ''>('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/admin/actividades', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setActividades(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleDelete = async (id: number) => {
    if(confirm('¿Seguro que deseas eliminar esta actividad?')) {
        try {
          const res = await fetch(`/api/actividades?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if(res.ok) {
            setActividades(actividades.filter(a => a.idactividades !== id));
            // Opcional: mostrar notificación o alert
          } else {
            console.error('Error al eliminar');
          }
        } catch (error) {
          console.error(error);
        }
    }
  };

  // Filter & Sort Logic
  const filteredActividades = actividades
    .filter(a => {
      const matchesSearch = 
        (a.nombreactividad?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (a.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesDate = !filterDate || (a.fechainicio && a.fechainicio >= filterDate);
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const valA = a.nombreactividad || '';
      const valB = b.nombreactividad || '';
      return sortBy === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    });

  const totalItems = filteredActividades.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActividades = filteredActividades.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-display">Gestión de Actividades</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Administra las actividades y eventos de la fundación.</p>
        </div>
        <Button variant="primary" onClick={() => { setIsModalOpen(true); }}>
          + Nueva Actividad
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 bg-surface p-4 rounded-2xl border border-border-custom shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Buscar</label>
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o ubicación..."
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
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Filtrar por fecha inicio (desde)</label>
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
      
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando actividades...</div>
        ) : (
          <>
            <Table columns={['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Ubicación', 'Acciones']}>
              {paginatedActividades.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">No hay actividades registradas</td></tr>
              ) : paginatedActividades.map((a: any) => (
                <tr key={a.idactividades} className="border-b border-border-custom hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">{a.nombreactividad}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">{a.descripcion}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{formatearFecha(a.fechainicio)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{formatearFecha(a.fechafin)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{a.ubicacion}</td>
                  <td className="px-4 py-4">
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 border-red-100 dark:border-red-900/30 px-3 py-1 text-xs" onClick={() => handleDelete(a.idactividades)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border-custom pt-4 mt-6 text-text-muted">
                <span className="text-sm font-semibold dark:text-gray-300">
                  Página {currentPage} de {totalPages} ({totalItems} registros)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 dark:border-border-custom dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 dark:border-border-custom dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal - ActivityForm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-surface rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-custom">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nueva Actividad</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                    ✕
                 </button>
              </div>
              <ActivityForm onSuccess={() => { setIsModalOpen(false); loadData(); }} />
           </div>
        </div>
      )}
    </div>
  );
}
