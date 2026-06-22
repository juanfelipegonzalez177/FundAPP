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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
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

  const toggleEstado = async (id: number, fechainicio: string, fechafin: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isActiva = fechafin ? fechafin >= todayStr : false;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let updateBody = {};
    if (isActiva) {
      updateBody = { fechainicio: yesterdayStr, fechafin: yesterdayStr };
    } else {
      const today = new Date();
      const fechainicioDate = fechainicio ? new Date(fechainicio) : today;
      const baseDate = fechainicioDate > today ? fechainicioDate : today;
      
      const futureDate = new Date(baseDate);
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      updateBody = { fechafin: futureDateStr };
    }

    try {
      const res = await fetch(`/api/actividades?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateBody)
      });

      if (res.ok) {
        loadData(true);
      } else {
        console.error('Error al cambiar estado');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTodas = async (activar: boolean) => {
    if (confirm(`¿Seguro que deseas ${activar ? 'activar' : 'desactivar'} TODAS las actividades?`)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const updateBody = activar 
        ? { fechafin: '2030-12-31' } 
        : { fechainicio: yesterdayStr, fechafin: yesterdayStr };

      try {
        const res = await fetch(`/api/actividades?id=all`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateBody)
        });

        if (res.ok) {
          loadData(true);
        } else {
          console.error('Error al actualizar todas las actividades');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const totalItems = actividades.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedActividades = actividades.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">Gestión de Actividades</h2>
          <p className="text-gray-500 mt-1">Administra las actividades y eventos de la fundación.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 text-xs font-semibold" onClick={() => toggleTodas(true)}>
            Activar Todas
          </Button>
          <Button variant="outline" className="text-amber-700 border-amber-200 hover:bg-amber-50 px-3 py-1.5 text-xs font-semibold" onClick={() => toggleTodas(false)}>
            Desactivar Todas
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Nueva Actividad
          </Button>
        </div>
      </div>
      
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando actividades...</div>
        ) : (
          <>
            <Table columns={['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Ubicación', 'Acciones']}>
              {paginatedActividades.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">No hay actividades registradas</td></tr>
              ) : paginatedActividades.map((a: any) => {
                const isActiva = a.fechafin ? a.fechafin >= new Date().toISOString().split('T')[0] : false;
                return (
                  <tr key={a.idactividades} className="border-b border-border-custom hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">{a.nombreactividad}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">{a.descripcion}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{formatearFecha(a.fechainicio)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{formatearFecha(a.fechafin)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${isActiva ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {isActiva ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{a.ubicacion}</td>
                    <td className="px-4 py-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        className={`px-3 py-1 text-xs ${isActiva ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-200 border-amber-100 dark:border-amber-900/30' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-200 border-emerald-100 dark:border-emerald-900/30'}`} 
                        onClick={() => toggleEstado(a.idactividades, a.fechainicio, a.fechafin)}
                      >
                        {isActiva ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 border-red-100 dark:border-red-900/30 px-3 py-1 text-xs" onClick={() => handleDelete(a.idactividades)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border-custom pt-4 mt-6 text-text-muted">
                <span className="text-sm font-semibold dark:text-gray-300">
                  Página {activePage} de {totalPages} ({totalItems} registros)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={activePage === 1}
                    className="px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 dark:border-border-custom dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={activePage === totalPages}
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
              <ActivityForm onSuccess={() => { setIsModalOpen(false); loadData(true); }} />
           </div>
        </div>
      )}
    </div>
  );
}
