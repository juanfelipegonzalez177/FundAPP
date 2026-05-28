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

  if (!stats) return <div className="p-8 text-text-muted font-semibold">Cargando métricas...</div>;
  if (stats.error) return <div className="p-8 text-red-500 font-semibold">Error cargando métricas: {stats.error}</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 text-text">
      <h2 className="text-3xl font-bold text-text font-display">Dashboard Administrativo</h2>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-surface border-l-4 border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Usuarios Activos</h3>
          <p className="text-3xl font-extrabold text-text mt-2">{stats.usuariosActivos}</p>
        </Card>
        <Card className="p-6 bg-surface border-l-4 border-secondary hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Total Voluntarios</h3>
          <p className="text-3xl font-extrabold text-text mt-2">{stats.totalVoluntarios}</p>
        </Card>
        <Card className="p-6 bg-surface border-l-4 border-accent hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Actividades Activas</h3>
          <p className="text-3xl font-extrabold text-text mt-2">{stats.actividadesActivas}</p>
        </Card>
        <Card className="p-6 bg-surface border-l-4 border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Donaciones Confirmadas</h3>
          <p className="text-3xl font-extrabold text-text mt-2">{stats.donacionesConfirmadas}</p>
        </Card>
        <Card className="p-6 bg-surface border-l-4 border-emerald-500 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Monto Total Recaudado</h3>
          <p className="text-3xl font-extrabold text-text mt-2">{formatearMonto(stats.montoTotal)}</p>
        </Card>
        <Card className="p-6 bg-surface border-l-4 border-red-500 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Postulaciones Pendientes</h3>
          <p className="text-3xl font-extrabold text-text mt-2">{stats.postulacionesPendientes}</p>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Donations Table */}
        <Card className="p-6 h-max bg-surface border border-border-custom shadow-sm">
          <h3 className="text-xl font-bold text-text mb-6 border-b border-border-custom pb-3 font-display">Últimas Donaciones Confirmadas</h3>
          <Table columns={['Usuario', 'Monto', 'Método', 'Fecha']}>
            {stats.ultimasDonaciones.length === 0 ? (
              <tr className="bg-surface"><td colSpan={4} className="text-center py-5 text-text-muted text-sm font-medium">No hay donaciones confirmadas</td></tr>
            ) : stats.ultimasDonaciones.map((d: any) => (
              <tr key={d.iddonaciones} className="border-b border-border-custom bg-surface hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-text">{d.usuarios?.nombrecompleto || 'Usuario'}</td>
                <td className="px-6 py-4 font-extrabold text-primary">{formatearMonto(d.monto)}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{d.metodopago || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{formatearFecha(d.fechadonacion)}</td>
              </tr>
            ))}
          </Table>
        </Card>

        {/* Volunteer applications Table */}
        <Card className="p-6 h-max bg-surface border border-border-custom shadow-sm">
          <h3 className="text-xl font-bold text-text mb-6 border-b border-border-custom pb-3 font-display">Últimas Postulaciones</h3>
          <Table columns={['Voluntario', 'Actividad', 'Estado', 'Fecha']}>
            {stats.ultimasPostulaciones.length === 0 ? (
              <tr className="bg-surface"><td colSpan={4} className="text-center py-5 text-text-muted text-sm font-medium">No hay postulaciones registradas</td></tr>
            ) : stats.ultimasPostulaciones.map((p: any) => (
              <tr key={p.idpostulaciones} className="border-b border-border-custom bg-surface hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-text">{p.voluntarios?.usuarios?.nombrecompleto || 'Desconocido'}</td>
                <td className="px-6 py-4 text-text">{p.actividades?.nombreactividad || 'Actividad'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-bold tracking-wide border ${
                    p.estadopostulacion === 'Pendiente' 
                      ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40'
                  }`}>
                    {p.estadopostulacion}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{formatearFecha(p.fechapostulacion || new Date().toISOString())}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}
