import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CertificadoDatos {
  nombre: string;
  tipo: 'participacion' | 'donacion';
  documento: string;
}

export const generarCertificadoPDF = (datos: CertificadoDatos): Buffer => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Background or Border
  doc.setDrawColor(45, 106, 79); // #2D6A4F
  doc.setLineWidth(5);
  doc.rect(10, 10, 277, 190);

  // Logo / Name
  doc.setTextColor(45, 106, 79);
  doc.setFontSize(30);
  doc.setFont('times', 'bold');
  doc.text('FUNDACIÓN BIOSFERAS', 148, 40, { align: 'center' });

  // Title
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(22);
  const tipoLabel = datos.tipo === 'donacion' ? 'Donación' : 'Participación';
  doc.text(`Certificado de ${tipoLabel}`, 148, 65, { align: 'center' });

  // Content
  doc.setFontSize(16);
  doc.setFont('times', 'normal');
  const actionTexto = datos.tipo === 'donacion' 
    ? 'por su valiosa contribución y donación a nuestra causa.'
    : 'por su valiosa participación y voluntariado en nuestras actividades.';

  doc.text('Otorgado a:', 148, 90, { align: 'center' });
  
  doc.setFontSize(24);
  doc.setFont('times', 'bold');
  doc.text(datos.nombre, 148, 105, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('times', 'normal');
  doc.text(`Identificado(a) con documento: ${datos.documento}`, 148, 120, { align: 'center' });
  doc.text(actionTexto, 148, 135, { align: 'center' });

  // Date and Signature
  const fechaStr = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
  doc.setFontSize(14);
  doc.text(`Dado en Bogotá D.C. a los ${fechaStr}`, 148, 160, { align: 'center' });

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(100, 180, 197, 180);
  doc.text('Dirección General', 148, 186, { align: 'center' });

  // Output
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
};
