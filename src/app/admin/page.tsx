'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { useAuth } from '@/hooks/useAuth';
import { formatearMonto, formatearFecha } from '@/utils/formatters';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          setStats({ error: data.error });
        } else {
          setStats(data);
        }
      })
      .catch(err => setStats({ error: err.message }));
  }, [token]);

  if (!stats) return <div className="p-8 text-gray-500">Cargando métricas...</div>;
  if (stats.error) return <div className="p-8 text-red-500">Error cargando métricas: {stats.error}</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <h2 className="text-3xl font-bold text-gray-900 font-display">Dashboard Administrativo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-l-4 border-[#2D6A4F] shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Usuarios Activos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.usuariosActivos}</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-[#1B4332] shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Total Voluntarios</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVoluntarios}</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-yellow-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Actividades Activas</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.actividadesActivas}</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-blue-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Donaciones Confirmadas</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.donacionesConfirmadas}</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-emerald-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Monto Total Recaudado</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatearMonto(stats.montoTotal)}</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-red-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500">Postulaciones Pendientes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.postulacionesPendientes}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <Card className="p-6 h-max">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Últimas Donaciones Confirmadas</h3>
          <Table columns={['Usuario', 'Monto', 'Método', 'Fecha']}>
            {stats.ultimasDonaciones.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4 text-gray-500 text-sm">No hay donaciones confirmadas</td></tr>
            ) : stats.ultimasDonaciones.map((d: any) => (
              <tr key={d.iddonaciones} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{d.usuarios?.nombrecompleto || 'Usuario'}</td>
                <td className="px-4 py-3 font-semibold">{formatearMonto(d.monto)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{d.metodopago || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatearFecha(d.fechadonacion)}</td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card className="p-6 h-max">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Últimas Postulaciones</h3>
          <Table columns={['Voluntario', 'Actividad', 'Estado', 'Fecha']}>
            {stats.ultimasPostulaciones.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4 text-gray-500 text-sm">No hay postulaciones registradas</td></tr>
            ) : stats.ultimasPostulaciones.map((p: any) => (
              <tr key={p.idpostulaciones} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p.voluntarios?.usuarios?.nombrecompleto || 'Desconocido'}</td>
                <td className="px-4 py-3">{p.actividades?.nombreactividad || 'Actividad'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${p.estadopostulacion === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {p.estadopostulacion}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatearFecha(p.fechapostulacion || new Date().toISOString())}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}
