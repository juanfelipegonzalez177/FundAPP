'use client';
import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Button, Input, Badge } from '@/components/ui';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { useAuth } from '@/hooks/useAuth';
import { useCertificados } from '@/hooks/useCertificados';
import { useDonaciones } from '@/hooks/useDonaciones';
import { useVoluntarios } from '@/hooks/useVoluntarios';
import { formatearFecha, formatearMonto } from '@/utils/formatters';

export default function PerfilPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'info' | 'certs'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // States for editing
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');

  const { postulaciones, fetchPostulaciones } = useVoluntarios();
  const { donaciones, fetchDonaciones } = useDonaciones();
  const { fetchCertificados, certificados, loading, error } = useCertificados();

  useEffect(() => {
    fetchPostulaciones();
    fetchDonaciones();
    fetchCertificados();
  }, []);

  useEffect(() => {
    if (user) {
      setTelefono(user.telefono || '');
      setDireccion(user.direccion || '');
      setCiudad(user.ciudad || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ telefono, direccion, ciudad })
      });
      if (!res.ok) throw new Error();
      // To strictly reload contextual user without a full page refresh we could update AuthContext
      // For simplicity, reload window or rely on user navigating
      window.location.reload();
    } catch {
      alert('Error guardando perfil');
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const aprobados = (Array.isArray(certificados) ? certificados : []).filter(c => c.estado === 'aprobado');

  const eventosRecientes = [
    ...(Array.isArray(postulaciones) ? postulaciones : []).map(p => ({ type: 'vol', date: p.fechapostulacion || new Date(), msg: `Postulación a actividad: ${(p as any).actividades?.nombreactividad || 'N/A'} — Estado: ${p.estadopostulacion}`, color: '#2D6A4F' })),
    ...(Array.isArray(donaciones) ? donaciones : []).map(d => ({ type: 'don', date: d.fechadonacion, msg: `Donación por ${formatearMonto(d.monto)} vía ${d.metodopago}`, color: '#3B82F6' })),
    ...(Array.isArray(certificados) ? certificados : []).map(c => ({ type: 'cert', date: c.created_at || new Date().toISOString(), msg: `Solicitud cert ${c.tipo_certificado || c.actividadasociada} — Estado: ${c.estado}`, color: '#F59E0B' }))
  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AuthGuard>
      <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-300">
        <div className="flex w-full border-b border-gray-200 mb-6">
          <button 
            className={`px-6 py-4 text-sm font-semibold transition-all ${tab === 'info' ? 'border-b-2 border-[#2D6A4F] text-[#2D6A4F] font-bold' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('info')}
          >
            👤 Información Personal
          </button>
          <button 
            className={`px-6 py-4 text-sm font-semibold transition-all ${tab === 'certs' ? 'border-b-2 border-[#2D6A4F] text-[#2D6A4F] font-bold' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('certs')}
          >
            🏅 Mis Certificados
          </button>
        </div>

        {tab === 'info' ? (
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1 p-8 h-max">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Información Personal</h3>
                </div>
                {!isEditing ? (
                  <Button variant="outline" className="text-sm py-1.5" onClick={() => setIsEditing(true)}>
                    ✏ Editar Perfil
                  </Button>
                ) : (
                  <Button variant="outline" className="text-sm py-1.5 text-gray-500" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nombre de Usuario" value={user?.nombrecompleto || ''} readOnly className="bg-gray-50" />
                <Input label="Correo Electrónico" value={user?.correo || ''} readOnly className="bg-gray-50" />
                <Input label="Documento" value={user?.numerodocumento || ''} readOnly className="bg-gray-50" />
                <Input label="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
                <Input label="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
                <Input label="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} readOnly={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
              </div>
              
              {isEditing && (
                 <div className="w-full flex justify-end mt-6">
                   <Button variant="primary" onClick={handleSave} isLoading={saving}>Guardar Cambios</Button>
                 </div>
              )}
            </Card>

            <Card className="w-full md:w-[350px] p-6 shrink-0 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                {eventosRecientes.length === 0 && <p className="text-sm text-gray-500">No hay eventos recientes.</p>}
                {eventosRecientes.map((e, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 text-sm flex gap-3 min-h-[70px] shadow-sm">
                    <div className="w-1.5 rounded-full" style={{ backgroundColor: e.color }}></div>
                    <div className="flex flex-col justify-center">
                      <span className="text-gray-800 font-medium leading-tight">{e.msg}</span>
                      <span className="text-xs text-gray-400 mt-1">Enviada el {formatearFecha(e.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-8">
            {aprobados.length === 0 ? (
               <div className="py-16 flex flex-col items-center justify-center text-center">
                 <h3 className="text-xl font-bold text-gray-900">No tienes certificados aprobados</h3>
                 <p className="text-gray-500 mt-2">No se han encontrado certificados vinculados a tu cuenta o están pendientes.</p>
               </div>
            ) : (
              <Table columns={["Certificado", "Fecha", "Estado", "Acción"]}>
                {aprobados.map(c => (
                  <tr key={c.idcertificados} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.actividadasociada || c.tipo_certificado}</td>
                    <td className="px-6 py-4">{formatearFecha(c.created_at || new Date().toISOString())}</td>
                    <td className="px-6 py-4"><Badge variant="success">Aprobado</Badge></td>
                    <td className="px-6 py-4">
                      <Button variant="outline" className="py-1.5 px-3 text-xs" onClick={() => alert('Generando PDF...')}>Descargar PDF</Button>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}
