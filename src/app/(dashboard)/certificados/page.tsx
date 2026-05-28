'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Input, Button } from '@/components/ui';
import { Card } from '@/components/shared/Card';
import { useNotif } from '@/context/NotifContext';
import { useAuth } from '@/hooks/useAuth';
import { Award, Heart } from 'lucide-react';

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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ tipo_documento: tipoDocumento, numero_documento: numeroDocumento, tipo: tab })
      });

      if (!res.ok) {
        const err = await res.json();
        notify(err.message || 'Hubo un error al procesar tu solicitud.', 'error');
        return;
      }

      const { data } = await res.json();
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Diseño Base Fondo
      doc.setFillColor(245, 247, 250);
      doc.rect(0, 0, 297, 210, 'F');
      
      // Borde Interno
      doc.setDrawColor(45, 106, 79);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);

      // Logo Nombre FUNDAPP
      doc.setTextColor(45, 106, 79);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("FUNDAPP", 148.5, 40, { align: 'center' });

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Fundación para el Desarrollo Local", 148.5, 48, { align: 'center' });

      if (tab === 'participacion') {
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Certificado de Participación", 148.5, 75, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Otorgado a:", 148.5, 95, { align: 'center' });

        doc.setTextColor(45, 106, 79);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(data.nombreVoluntario || '', 148.5, 110, { align: 'center' });

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text(`Por su valiosa colaboración y compromiso en la actividad:`, 148.5, 130, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`"${data.actividad}"`, 148.5, 145, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const fechaIn = new Date(data.fechaInicio).toLocaleDateString('es-CO');
        const fechaFin = new Date(data.fechaFin).toLocaleDateString('es-CO');
        doc.text(`Realizada desde ${fechaIn} hasta ${fechaFin}`, 148.5, 155, { align: 'center' });

      } else {
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Certificado de Donación", 148.5, 75, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Otorgado con profundo agradecimiento a:", 148.5, 95, { align: 'center' });

        doc.setTextColor(59, 130, 246);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(data.nombreDonante || '', 148.5, 110, { align: 'center' });

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text(`Por su donación de $${data.monto?.toLocaleString('es-CO') || '0'}`, 148.5, 130, { align: 'center' });
        
        doc.setFontSize(12);
        const fDon = new Date(data.fechaDonacion).toLocaleDateString('es-CO');
        doc.text(`Realizada el ${fDon} mediante ${data.metodoPago}`, 148.5, 145, { align: 'center' });
        
        doc.setFont("helvetica", "italic");
        doc.text(`Comprobante: ${data.codigoComprobante}`, 148.5, 155, { align: 'center' });
      }

      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.line(70, 180, 227, 180);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(`Documento generado electrónicamente el ${new Date().toLocaleDateString('es-CO')}`, 148.5, 190, { align: 'center' });

      doc.save(`certificado_${tab}.pdf`);
      notify('¡Certificado descargado exitosamente!', 'success');
      setNumeroDocumento('');
    } catch {
      notify('Hubo un error al generar tu certificado.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-300 flex flex-col gap-6">
        
        {/* TABS */}
        <div className="flex w-full bg-surface border border-border-custom rounded-2xl p-1.5 mb-2 mt-4 shadow-sm">
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'participacion' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-text-muted hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => setTab('participacion')}
          >
            <Award className="w-4 h-4" /> Certificado de Participación
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'donacion' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-text-muted hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => setTab('donacion')}
          >
            <Heart className="w-4 h-4" /> Certificado de Donación
          </button>
        </div>

        {/* FORMS */}
        <Card className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center bg-surface min-h-[400px]">
          <div className="w-full md:w-3/5 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-text font-display">
                {tab === 'participacion' ? 'Descargar Certificado de Participación' : 'Descargar Certificado de Donación'}
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full mt-2"></div>
              <p className="text-text-muted mt-3 text-sm">Completa los datos para validar tu información en el sistema.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text/85">Tipo de Documento</label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full rounded-xl border border-border-custom bg-surface text-text px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="CC" className="bg-surface text-text">Cédula de Ciudadanía (CC)</option>
                  <option value="CE" className="bg-surface text-text">Cédula de Extranjería (CE)</option>
                  <option value="Pasaporte" className="bg-surface text-text">Pasaporte</option>
                  <option value="TI" className="bg-surface text-text">Tarjeta de Identidad (TI)</option>
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
                  <label className="text-sm font-semibold text-text/85">Tipo de Certificado</label>
                  <select
                    className="w-full rounded-xl border border-border-custom bg-surface text-text px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="Participación en actividad" className="bg-surface text-text">Participación en actividad</option>
                    <option value="Voluntariado" className="bg-surface text-text">Voluntariado</option>
                  </select>
                </div>
              )}

              <Button type="submit" variant="primary" className="mt-4 w-max cursor-pointer shadow-sm animate-in fade-in" isLoading={submitting}>
                ⬇ SOLICITAR
              </Button>
            </form>
          </div>

          <div className="hidden md:flex w-full md:w-2/5 justify-center items-center">
             <div className={`w-52 h-52 rounded-full flex items-center justify-center transition-colors duration-500 shadow-md ${
               tab === 'participacion' 
                 ? 'bg-primary/10 border border-primary/20 text-primary' 
                 : 'bg-secondary/10 border border-secondary/20 text-secondary'
             }`}>
                {tab === 'participacion' ? (
                  <Award className="h-24 w-24 animate-pulse" />
                ) : (
                  <Heart className="h-24 w-24 animate-pulse" />
                )}
             </div>
          </div>
        </Card>

      </div>
    </AuthGuard>
  );
}
