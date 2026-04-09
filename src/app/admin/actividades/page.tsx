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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">Gestión de Actividades</h2>
          <p className="text-gray-500 mt-1">Administra las actividades y eventos de la fundación.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nueva Actividad
        </Button>
      </div>
      
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando actividades...</div>
        ) : (
          <Table columns={['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Ubicación', 'Acciones']}>
            {actividades.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 text-gray-500 text-sm">No hay actividades registradas</td></tr>
            ) : actividades.map((a: any) => (
              <tr key={a.idactividades} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{a.nombreactividad}</td>
                <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-xs">{a.descripcion}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{formatearFecha(a.fechainicio)}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{formatearFecha(a.fechafin)}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{a.ubicacion}</td>
                <td className="px-4 py-4">
                  <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:border-red-200 border-red-100 px-3 py-1 text-xs" onClick={() => handleDelete(a.idactividades)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Modal - ActivityForm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-900">Nueva Actividad</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
