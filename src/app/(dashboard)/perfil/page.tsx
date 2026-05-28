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
  const { fetchCertificados, certificados } = useCertificados();

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
    ...(Array.isArray(postulaciones) ? postulaciones : []).map(p => ({ type: 'vol', date: p.fechapostulacion || new Date(), msg: `Postulación a: ${(p as any).actividades?.nombreactividad || 'Actividad'} — Estado: ${p.estadopostulacion}`, color: '#2D6A4F' })),
    ...(Array.isArray(donaciones) ? donaciones : []).map(d => ({ type: 'don', date: d.fechadonacion, msg: `Donación por ${formatearMonto(d.monto)} vía ${d.metodopago}`, color: '#52B788' })),
    ...(Array.isArray(certificados) ? certificados : []).map(c => ({ type: 'cert', date: c.created_at || new Date().toISOString(), msg: `Solicitud cert: ${c.tipo_certificado || c.actividadasociada} — Estado: ${c.estado}`, color: '#F4A261' }))
  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AuthGuard>
      <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-300 flex flex-col gap-6">
        
        {/* TABS */}
        <div className="flex w-full border-b border-border-custom mb-4 mt-2">
          <button 
            className={`px-6 py-4 text-sm font-bold transition-all duration-300 cursor-pointer ${
              tab === 'info' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-text-muted hover:text-primary'
            }`}
            onClick={() => setTab('info')}
          >
            👤 Información Personal
          </button>
          <button 
            className={`px-6 py-4 text-sm font-bold transition-all duration-300 cursor-pointer ${
              tab === 'certs' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-text-muted hover:text-primary'
            }`}
            onClick={() => setTab('certs')}
          >
            🏅 Mis Certificados
          </button>
        </div>

        {tab === 'info' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Info Card */}
            <Card className="flex-1 p-8 h-max">
              <div className="flex justify-between items-center border-b border-border-custom pb-5 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text font-display">Información Personal</h3>
                  <p className="text-xs text-text-muted mt-1">Revisa y actualiza tus datos de contacto.</p>
                </div>
                {!isEditing ? (
                  <Button variant="outline" className="text-xs px-4 py-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                    ✏ Editar Perfil
                  </Button>
                ) : (
                  <Button variant="outline" className="text-xs px-4 py-2 text-text-muted border-border-custom cursor-pointer" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nombre de Usuario" value={user?.nombrecompleto || ''} readOnly className="bg-surface/50 opacity-80 cursor-not-allowed border-border-custom" />
                <Input label="Correo Electrónico" value={user?.correo || ''} readOnly className="bg-surface/50 opacity-80 cursor-not-allowed border-border-custom" />
                <Input label="Documento" value={user?.numerodocumento || ''} readOnly className="bg-surface/50 opacity-80 cursor-not-allowed border-border-custom" />
                <Input label="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} readOnly={!isEditing} className={!isEditing ? "bg-surface/50 opacity-80 cursor-not-allowed border-border-custom" : "border-primary"} />
                <Input label="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} readOnly={!isEditing} className={!isEditing ? "bg-surface/50 opacity-80 cursor-not-allowed border-border-custom" : "border-primary"} />
                <Input label="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} readOnly={!isEditing} className={!isEditing ? "bg-surface/50 opacity-80 cursor-not-allowed border-border-custom" : "border-primary"} />
              </div>
              
              {isEditing && (
                 <div className="w-full flex justify-end mt-8">
                   <Button variant="primary" onClick={handleSave} className="cursor-pointer shadow-sm" isLoading={saving}>Guardar Cambios</Button>
                 </div>
              )}
            </Card>

            {/* Timeline Sidebar Card */}
            <Card className="w-full lg:w-[360px] p-6 shrink-0 bg-surface/50 border border-border-custom">
              <h3 className="text-lg font-bold text-text font-display mb-1">Actividad Reciente</h3>
              <p className="text-xs text-text-muted mb-5">Historial de tus solicitudes y aportes.</p>
              
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-1">
                {eventosRecientes.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-8">No hay eventos registrados.</p>
                )}
                {eventosRecientes.map((e, idx) => (
                  <div key={idx} className="bg-surface p-4 rounded-xl border border-border-custom text-xs flex gap-3 shadow-sm transition-all duration-300 hover:border-primary/20">
                    <div className="w-1.5 rounded-full shrink-0" style={{ backgroundColor: e.color }}></div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-text font-semibold leading-relaxed">{e.msg}</span>
                      <span className="text-[10px] text-text-muted font-medium">Registrado: {formatearFecha(e.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Certificates Card */
          <Card className="p-8 bg-surface">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text font-display">Tus Certificados Oficiales</h3>
              <p className="text-xs text-text-muted mt-1">Descarga tus certificados de voluntariado y donaciones validados.</p>
            </div>
            
            {aprobados.length === 0 ? (
               <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-border-custom rounded-2xl bg-surface/30">
                 <h3 className="text-lg font-bold text-text mb-1">No tienes certificados aprobados</h3>
                 <p className="text-xs text-text-muted max-w-sm">No se han encontrado certificados aprobados vinculados a tu cuenta o aún se encuentran en revisión.</p>
               </div>
            ) : (
              <Table columns={["Certificado", "Fecha de Generación", "Estado", "Acción"]}>
                {aprobados.map(c => (
                  <tr key={c.idcertificados} className="bg-surface hover:bg-primary/5 transition-colors border-b border-border-custom">
                    <td className="px-6 py-4.5 font-semibold text-text">{c.actividadasociada || c.tipo_certificado}</td>
                    <td className="px-6 py-4.5 text-text-muted font-medium">{formatearFecha(c.created_at || new Date().toISOString())}</td>
                    <td className="px-6 py-4.5"><Badge variant="success">Aprobado</Badge></td>
                    <td className="px-6 py-4.5">
                      <Button variant="outline" className="py-2 px-4 text-xs font-bold cursor-pointer" onClick={() => alert('Generando PDF...')}>Descargar PDF</Button>
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
