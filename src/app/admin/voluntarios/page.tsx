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

  // Filter and Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | ''>('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filter & Sort Logic
  const filteredVoluntarios = voluntarios
    .filter(v => {
      const name = v.usuarios?.nombrecompleto || '';
      const email = v.usuarios?.correo || '';
      const doc = String(v.usuarios?.numerodocumento || '');
      const city = v.usuarios?.ciudad || '';
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const vDate = v.created_at || v.usuarios?.created_at;
      const matchesDate = !filterDate || (vDate && vDate.startsWith(filterDate)) || (vDate && vDate >= filterDate);
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const valA = a.usuarios?.nombrecompleto || '';
      const valB = b.usuarios?.nombrecompleto || '';
      return sortBy === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    });

  const totalItems = filteredVoluntarios.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVoluntarios = filteredVoluntarios.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-display">Directorio de Voluntarios</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Lista completa de voluntarios registrados en la plataforma.</p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 bg-surface p-4 rounded-2xl border border-border-custom shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Buscar</label>
          <input
            type="text"
            placeholder="Buscar por nombre, documento, correo o ciudad..."
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
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Filtrar por fecha registro (desde)</label>
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando voluntarios...</div>
        ) : (
          <>
            <Table columns={['Nombre', 'Documento', 'Correo', 'Ciudad', 'Estado', 'Acciones']}>
              {paginatedVoluntarios.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">No hay voluntarios registrados</td></tr>
              ) : paginatedVoluntarios.map((v: any) => (
                <tr key={v.idvoluntarios} className="border-b border-border-custom hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">{v.usuarios?.nombrecompleto || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{v.usuarios?.numerodocumento || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{v.usuarios?.correo || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{v.usuarios?.ciudad || 'No especificada'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      v.usuarios?.estadodecuenta === 'Activo' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {v.usuarios?.estadodecuenta || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="px-3 py-1 text-xs text-[#2D6A4F] dark:text-[#52B788] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30" 
                      onClick={() => toggleEstado(v.usuarios?.idusuarios, v.usuarios?.estadodecuenta)}
                    >
                      {v.usuarios?.estadodecuenta === 'Activo' ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 border-red-100 dark:border-red-900/30 px-3 py-1 text-xs" 
                      onClick={() => handleDelete(v.idvoluntarios)}
                    >
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
    </div>
  );
}
