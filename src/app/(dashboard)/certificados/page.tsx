'use client';
import { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Input, Button } from '@/components/ui';
import { Card } from '@/components/shared/Card';
import { useNotif } from '@/context/NotifContext';
import { useAuth } from '@/hooks/useAuth';

export default function CertificadosPage() {
  const [tab, setTab] = useState<'participacion' | 'donacion'>('participacion');
  const { notify } = useNotif();
  const { token } = useAuth();
  
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!numeroDocumento) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/certificados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
          tipo_certificado: tab === 'donacion' ? 'Donación' : 'Participación'
        })
      });
      if (!res.ok) throw new Error();
      notify('Tu solicitud fue enviada. El equipo administrativo la revisará pronto.', 'success');
      setNumeroDocumento('');
    } catch {
      notify('Hubo un error al enviar tu solicitud.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-300">
        
        {/* TABS */}
        <div className="flex w-full bg-gray-200 rounded-lg p-1 mb-6 mt-4">
          <button 
            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${tab === 'participacion' ? 'bg-white shadow-sm text-[#2D6A4F]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('participacion')}
          >
            🏅 Certificado de Participación
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${tab === 'donacion' ? 'bg-white shadow-sm text-[#2D6A4F]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('donacion')}
          >
            💜 Certificado de Donación
          </button>
        </div>

        {/* FORMS */}
        <Card className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center bg-white min-h-[400px]">
          <div className="w-full md:w-3/5 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                {tab === 'participacion' ? 'Descargar Certificado de Participación' : 'Certificado de Donación'}
              </h2>
              <p className="text-gray-500 mt-1">Completa los datos para validar tu información en el sistema.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tipo de Documento</label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="TI">Tarjeta de Identidad (TI)</option>
                </select>
              </div>

              <Input
                label="Documento"
                placeholder="Número de documento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                required
              />

              {tab === 'participacion' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Tipo de Certificado</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                  >
                    <option value="Participación en actividad">Participación en actividad</option>
                    <option value="Voluntariado">Voluntariado</option>
                  </select>
                </div>
              )}

              <Button type="submit" variant="primary" className="mt-2 w-max" isLoading={submitting}>
                ⬇ SOLICITAR
              </Button>
            </form>
          </div>

          <div className="hidden md:flex w-full md:w-2/5 justify-center items-center">
             <div className={`w-48 h-48 rounded-full flex items-center justify-center opacity-90 ${tab === 'participacion' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                {tab === 'participacion' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
             </div>
          </div>
        </Card>

      </div>
    </AuthGuard>
  );
}
