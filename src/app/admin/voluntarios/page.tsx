'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useNotif } from '@/context/NotifContext';

export default function AdminVoluntariosPage() {
  const { token } = useAuth();
  const { notify } = useNotif();
  const [voluntarios, setVoluntarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/admin/voluntarios', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setVoluntarios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const toggleEstado = async (idusuarios: number, currentStatus: string) => {
    if (!idusuarios) return;
    const nuevoEstado = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      const res = await fetch('/api/admin/voluntarios', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idusuarios, nuevoEstado })
      });

      if (!res.ok) {
        notify('Error al cambiar el estado', 'error');
        return;
      }
      notify(`Estado actualizado a ${nuevoEstado}`, 'success');
      loadData();
    } catch (error) {
      notify('Error de red', 'error');
    }
  };

  const handleDelete = async (idvoluntarios: number) => {
    if(!confirm('¿Seguro que deseas eliminar este voluntario permanentemente?')) return;
    try {
      const res = await fetch(`/api/admin/voluntarios?id=${idvoluntarios}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
        notify('Voluntario eliminado exitosamente', 'success');
        loadData();
      } else {
        notify('Error al eliminar el voluntario', 'error');
      }
    } catch (error) {
      notify('Error de red al eliminar', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 font-display">Directorio de Voluntarios</h2>
        <p className="text-gray-500 mt-1">Lista completa de voluntarios registrados en la plataforma.</p>
      </div>
      
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando voluntarios...</div>
        ) : (
          <Table columns={['Nombre', 'Documento', 'Correo', 'Ciudad', 'Estado', 'Acciones']}>
            {voluntarios.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 text-gray-500 text-sm">No hay voluntarios registrados</td></tr>
            ) : voluntarios.map((v: any) => (
              <tr key={v.idvoluntarios} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{v.usuarios?.nombrecompleto || 'N/A'}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{v.usuarios?.numerodocumento || 'N/A'}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{v.usuarios?.correo || 'N/A'}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{v.usuarios?.ciudad || 'No especificada'}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${v.usuarios?.estadodecuenta === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                    {v.usuarios?.estadodecuenta || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="px-3 py-1 text-xs text-[#2D6A4F] hover:bg-emerald-50 border-emerald-100" 
                    onClick={() => toggleEstado(v.usuarios?.idusuarios, v.usuarios?.estadodecuenta)}
                  >
                    {v.usuarios?.estadodecuenta === 'Activo' ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50 hover:border-red-200 border-red-100 px-3 py-1 text-xs" 
                    onClick={() => handleDelete(v.idvoluntarios)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
