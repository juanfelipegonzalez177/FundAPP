'use client';
import { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useActividades } from '@/hooks/useActividades';
import { useNotif } from '@/context/NotifContext';
import { formatearFecha } from '@/utils/formatters';

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 min-h-[500px]">
          
          {/* COLUMNA IZQUIERDA - Formulario 40% */}
          <div className="w-full md:w-[40%] flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1B4332] font-display">Postúlate como Voluntario</h2>
              <p className="text-gray-600 mt-1">Completa los datos para postularte a una actividad.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Usuario (Automático)"
                type="text"
                value={user?.nombrecompleto || ''}
                readOnly
                className={user?.nombrecompleto ? "cursor-not-allowed opacity-70" : ""}
                required
              />
              <Input
                label="Correo"
                type="text"
                value={user?.correo || ''}
                readOnly
                className={user?.correo ? "cursor-not-allowed opacity-70" : ""}
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Actividades Disponibles</label>
                <select
                  value={actividadId}
                  onChange={(e) => setActividadId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  {!loading && actividades.map(act => (
                    <option key={act.idactividades} value={act.idactividades}>
                      {act.nombreactividad} - Inicio: {formatearFecha(act.fechainicio)}
                    </option>
                  ))}
                </select>
                {loading && <span className="text-xs text-gray-500">Cargando actividades...</span>}
              </div>

              <Button type="submit" variant="primary" className="w-full mt-4" isLoading={submitting}>
                POSTULARME
              </Button>
            </form>
          </div>

          {/* COLUMNA DERECHA - Galería 60% */}
          <div className="w-full md:w-[60%] grid grid-cols-2 gap-4 h-full min-h-[400px]">
             <div className="col-span-2 h-[200px] md:h-[250px] rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-[#1B4332] to-emerald-800 flex flex-col items-center justify-center p-6 text-emerald-100/30 hover:text-emerald-100 transition-colors duration-500">
                <svg className="w-24 h-24 mb-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-lg max-w-xs text-center text-emerald-200/80">Protegiendo ecosistemas juntos</span>
             </div>
             
             <div className="h-[150px] md:h-[200px] rounded-xl overflow-hidden shadow-sm bg-gradient-to-tr from-emerald-600 to-teal-400 flex flex-col items-center justify-center p-4">
                <svg className="w-16 h-16 text-white/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-medium text-sm text-teal-50">Impacto Global</span>
             </div>
             
             <div className="h-[150px] md:h-[200px] rounded-xl overflow-hidden shadow-sm bg-gradient-to-bl from-[#2D6A4F] to-[#1B4332] flex flex-col items-center justify-center p-4">
                <svg className="w-16 h-16 text-white/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium text-sm text-emerald-100/90 text-center">Comunidad en Acción</span>
             </div>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
