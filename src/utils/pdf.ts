import { jsPDF } from 'jspdf';

// ─── Tipos de entrada ────────────────────────────────────────────────────────

export interface DatosCertificadoVoluntariado {
  tipo: 'voluntariado';
  nombreVoluntario: string;
  actividad: string;
  descripcionActividad?: string;
  fechaInicio: string;
  fechaFin?: string;
  ubicacion: string;
  direccionUbicacion?: string;
  fechaEmision?: string;
}

export interface DatosCertificadoDonacion {
  tipo: 'donacion';
  nombreDonante: string;
  monto: number;
  metodoPago: string;
  proposito: string;
  fechaDonacion: string;
  codigoComprobante: number | string;
  fechaExpedicion?: string;
  anonima?: 'Si' | 'No';
}

export type DatosCertificado = DatosCertificadoVoluntariado | DatosCertificadoDonacion;

// ─── Helpers de diseño ───────────────────────────────────────────────────────

const COLORES = {
  primario: [45, 106, 79] as [number, number, number], // Adaptado a tu verde Fundapp
  secundario: [64, 145, 108] as [number, number, number],
  texto: [30, 30, 30] as [number, number, number],
  suave: [100, 100, 100] as [number, number, number],
  linea: [220, 220, 220] as [number, number, number],
  fondo: [245, 247, 255] as [number, number, number], // Fondo claro general
};

function dibujarCabecera(doc: jsPDF, titulo: string, subtitulo: string) {
  const ancho = doc.internal.pageSize.getWidth();

  doc.setFillColor(...COLORES.primario);
  doc.rect(0, 0, ancho, 38, 'F');

  doc.setFillColor(...COLORES.secundario);
  doc.rect(0, 38, ancho, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FUNDAPP', ancho / 2, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(titulo, ancho / 2, 32, { align: 'center' });

  doc.setFillColor(...COLORES.fondo);
  doc.rect(0, 42, ancho, doc.internal.pageSize.getHeight() - 42, 'F');

  doc.setTextColor(...COLORES.primario);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(subtitulo, ancho / 2, 62, { align: 'center' });

  doc.setTextColor(...COLORES.linea);
  doc.setLineWidth(0.5);
  doc.line(20, 68, ancho - 20, 68);
}

function dibujarCampo(doc: jsPDF, etiqueta: string, valor: string, y: number) {
  const ancho = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, y, ancho - 40, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORES.suave);
  doc.text(etiqueta.toUpperCase(), 28, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...COLORES.texto);
  doc.text(valor, 28, y + 16);

  return y + 26;
}

function dibujarPie(doc: jsPDF) {
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...COLORES.linea);
  doc.setLineWidth(0.3);
  doc.line(20, alto - 24, ancho - 20, alto - 24);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLORES.suave);
  doc.text('Este documento es un comprobante oficial generado por FUNDAPP.', ancho / 2, alto - 16, { align: 'center' });
  doc.text(`Generado orgánicamente el ${new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}`, ancho / 2, alto - 10, { align: 'center' });
}

// ─── Generadores Core ─────────────────────────────────────────────────────

function _generarCertificadoVoluntariado(datos: DatosCertificadoVoluntariado): Buffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  dibujarCabecera(doc, 'Certificado de Participación en Voluntariado', 'CERTIFICADO DE VOLUNTARIADO');

  let y = 80;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...COLORES.texto);
  const texto = [
    `Se certifica orgánicamente que ${datos.nombreVoluntario}`,
    `participó de forma valiosa en la actividad vinculada a continuación.`,
  ];
  texto.forEach(linea => {
    doc.text(linea, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 7;
  });

  y += 8;
  y = dibujarCampo(doc, 'Nombre del voluntario', datos.nombreVoluntario, y);
  y = dibujarCampo(doc, 'Actividad realizada', datos.actividad, y);
  if (datos.descripcionActividad) y = dibujarCampo(doc, 'Descripción', datos.descripcionActividad, y);
  y = dibujarCampo(doc, 'Fecha de inicio', formatearFecha(datos.fechaInicio), y);
  if (datos.fechaFin) y = dibujarCampo(doc, 'Fecha de finalización', formatearFecha(datos.fechaFin), y);
  y = dibujarCampo(doc, 'Sede / Ubicación', datos.ubicacion, y);
  y = dibujarCampo(doc, 'Fecha de emisión', formatearFecha(datos.fechaEmision ?? new Date().toISOString().split('T')[0]), y);

  dibujarPie(doc);
  return Buffer.from(doc.output('arraybuffer'));
}

function _generarCertificadoDonacion(datos: DatosCertificadoDonacion): Buffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  dibujarCabecera(doc, 'Comprobante Oficial de Donación', 'COMPROBANTE DE DONACIÓN');

  let y = 80;
  const nombreMostrar = datos.anonima === 'Si' ? 'Donante Anónimo' : datos.nombreDonante;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...COLORES.texto);
  doc.text(
    `Se confirma la recepción de una donación registrada oficialmente en FUNDAPP.`,
    doc.internal.pageSize.getWidth() / 2,
    y,
    { align: 'center' }
  );
  y += 16;

  y = dibujarCampo(doc, 'Código de comprobante', `#${datos.codigoComprobante}`, y);
  y = dibujarCampo(doc, 'Donante', nombreMostrar, y);
  y = dibujarCampo(doc, 'Monto donado', `$${datos.monto.toLocaleString('es-CO')} COP`, y);
  y = dibujarCampo(doc, 'Método de pago', datos.metodoPago, y);
  y = dibujarCampo(doc, 'Propósito de la donación', datos.proposito || 'Contribución solidaria general', y);
  y = dibujarCampo(doc, 'Fecha de donación', formatearFecha(datos.fechaDonacion), y);
  y = dibujarCampo(doc, 'Fecha de expedición', formatearFecha(datos.fechaExpedicion ?? new Date().toISOString().split('T')[0]), y);

  dibujarPie(doc);
  return Buffer.from(doc.output('arraybuffer'));
}

// ─── Función principal de entrada del Backend ────────────────────────────────────────────

export function generarCertificadoBuffer(datos: DatosCertificado): Buffer {
  if (datos.tipo === 'voluntariado') {
    return _generarCertificadoVoluntariado(datos);
  } else {
    return _generarCertificadoDonacion(datos);
  }
}

// ─── Compatibilidad para no romper implementaciones anteriores ───
export const generarCertificadoPDF = generarCertificadoBuffer;

// ─── Utilidades ──────────────────────────────────────────────────────────────

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return 'N/A';
  try {
    const d = new Date(fechaISO);
    return isNaN(d.getTime()) ? fechaISO : d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return fechaISO;
  }
}
