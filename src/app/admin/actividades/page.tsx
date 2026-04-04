'use client';
import { useState } from 'react';
import { Button, Badge, Modal } from '@/components/ui';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { useActividades } from '@/hooks/useActividades';
import { formatearFecha } from '@/utils/formatters';
import { ActivityForm } from '@/components/forms/ActivityForm';

export default function AdminActividadesPage() {
  const { actividades, loading, refetch } = useActividades();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Actividades</h1>
          <p className="text-gray-500">Administra el catálogo de actividades</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nueva Actividad
        </Button>
      </div>

      <Card className="p-6">
        <Table columns={["Nombre", "Fechas", "Descripción", "Acciones"]}>
          {actividades.map(act => (
            <tr key={act.idactividades} className="bg-white border-b hover:bg-gray-50">
               <td className="px-6 py-4 font-bold text-gray-800">{act.nombreactividad}</td>
               <td className="px-6 py-4 text-sm text-gray-600">
                  Res: {formatearFecha(act.fechainicio)} 
                  <br /> 
                  Fin: {act.fechafin ? formatearFecha(act.fechafin) : 'N/A'}
               </td>
               <td className="px-6 py-4 text-sm text-gray-600">{act.descripcion || 'Sin descripción'}</td>
               <td className="px-6 py-4">
                 <Button variant="ghost" className="text-sm px-2 py-1 text-blue-600">Editar</Button>
                 <Button variant="ghost" className="text-sm px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-700 ml-2">Eliminar</Button>
               </td>
            </tr>
          ))}
          {!loading && actividades.length === 0 && (
            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No se encontraron actividades</td></tr>
          )}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Actividad">
        <ActivityForm onSuccess={() => { setIsModalOpen(false); refetch(); }} />
      </Modal>
    </div>
  );
}
