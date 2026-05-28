'use client';
import { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useActividades } from '@/hooks/useActividades';
import { useNotif } from '@/context/NotifContext';
import { formatearFecha } from '@/utils/formatters';
import { TreePine, Globe, Users } from 'lucide-react';

export default function ActividadesPage() {
  const { user } = useAuth();
  const { actividades, loading } = useActividades();
  const { notify } = useNotif();
  
  const [actividadId, setActividadId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return notify('Debes iniciar sesión para postularte.', 'error');
    if (!actividadId) return notify('Selecciona una actividad.', 'error');
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ actividades_idactividades: actividadId })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error en la postulación');
      }
      notify('Postulación exitosa. Pronto te contactaremos.', 'success');
      setActividadId('');
    } catch (e: any) {
      notify(e.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
        <div className="bg-surface rounded-3xl shadow-xl border border-border-custom p-6 md:p-12 flex flex-col md:flex-row gap-12 min-h-[500px] transition-colors duration-300">
          
          {/* LEFT COLUMN - Form 45% */}
          <div className="w-full md:w-[45%] flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold text-text font-display">Postúlate como Voluntario</h2>
              <div className="w-12 h-1 bg-primary rounded-full mt-2"></div>
              <p className="text-text-muted mt-3 text-sm">Registra tu postulación para unirte a nuestras brigadas ecológicas.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Usuario (Automático)"
                type="text"
                value={user?.nombrecompleto || ''}
                readOnly
                className={user?.nombrecompleto ? "cursor-not-allowed opacity-60 bg-surface/50" : ""}
                required
              />
              <Input
                label="Correo Electrónico"
                type="text"
                value={user?.correo || ''}
                readOnly
                className={user?.correo ? "cursor-not-allowed opacity-60 bg-surface/50" : ""}
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text/85">Actividad Disponible</label>
                <select
                  value={actividadId}
                  onChange={(e) => setActividadId(e.target.value)}
                  className="w-full rounded-xl border border-border-custom bg-surface text-text px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  {!loading && actividades.map(act => (
                    <option key={act.idactividades} value={act.idactividades} className="text-text bg-surface">
                      {act.nombreactividad} - Inicio: {formatearFecha(act.fechainicio)}
                    </option>
                  ))}
                </select>
                {loading && <span className="text-xs text-text-muted mt-1">Cargando actividades...</span>}
              </div>

              <Button type="submit" variant="primary" className="w-full mt-4 cursor-pointer" isLoading={submitting}>
                POSTULARME
              </Button>
            </form>
          </div>

          {/* RIGHT COLUMN - Gallery/Information 55% */}
          <div className="w-full md:w-[55%] grid grid-cols-2 gap-4 min-h-[400px]">
             <div className="col-span-2 h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-primary to-secondary/80 flex flex-col items-center justify-center p-6 text-white group hover:scale-[1.01] transition-all duration-300 border border-primary/20">
                <TreePine className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform duration-500" />
                <span className="font-bold text-xl text-center text-white/95 font-display max-w-sm">Protegiendo ecosistemas juntos</span>
             </div>
             
             <div className="h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md bg-surface border border-border-custom flex flex-col items-center justify-center p-4 text-center hover:border-primary/45 transition-colors duration-300">
                <Globe className="w-10 h-10 text-primary mb-3" />
                <span className="font-bold text-sm text-text">Impacto Global</span>
                <span className="text-xs text-text-muted mt-1 leading-relaxed max-w-[120px]">Restaura el equilibrio natural.</span>
             </div>
             
             <div className="h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md bg-surface border border-border-custom flex flex-col items-center justify-center p-4 text-center hover:border-secondary/45 transition-colors duration-300">
                <Users className="w-10 h-10 text-secondary mb-3" />
                <span className="font-bold text-sm text-text">Comunidad Activa</span>
                <span className="text-xs text-text-muted mt-1 leading-relaxed max-w-[120px]">Sinergia ecosocial colectiva.</span>
             </div>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
