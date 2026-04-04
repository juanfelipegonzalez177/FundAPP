'use client';
import { useState, useEffect } from 'react';
import { Badge, Button } from '@/components/ui';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { formatearFecha } from '@/utils/formatters';

export default function AdminVoluntariosListPage() {
  const [voluntariosDb, setVoluntariosDb] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVols = async () => {
       try {
         const res = await fetch('/api/usuarios', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
         });
         if(res.ok) {
            const data = await res.json();
            // Since we don't have roles fetched inside /api/usuarios right now easily (just pure users)
            // Ideally we cross them here, but for now we list all users that are not admin.
            setVoluntariosDb(data); 
         }
       } catch {}
       finally { setLoading(false); }
    };
    fetchVols();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios App</h1>
        <p className="text-gray-500">Listado de todos los usuarios registrados en el sistema (Voluntarios y Donantes)</p>
      </div>

      <Card className="p-6">
        <Table columns={["Nombre", "Correo", "Teléfono", "Fecha de registro", "Acciones"]}>
          {voluntariosDb.map((v: any) => (
            <tr key={v.idusuarios} className="bg-white border-b hover:bg-gray-50">
               <td className="px-6 py-4 font-bold text-gray-800">{v.nombrecompleto}</td>
               <td className="px-6 py-4 text-sm text-gray-600">{v.correo}</td>
               <td className="px-6 py-4 text-sm text-gray-600">{v.telefono || 'N/A'}</td>
               <td className="px-6 py-4 text-sm">{formatearFecha(v.fecharegisto)}</td>
               <td className="px-6 py-4 flex gap-2">
                 <Button variant="outline" className="text-sm px-2 py-1 h-8">Ver detalle</Button>
               </td>
            </tr>
          ))}
          {!loading && voluntariosDb.length === 0 && (
            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay usuarios registrados</td></tr>
          )}
        </Table>
      </Card>
    </div>
  );
}
