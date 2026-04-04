import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatearFecha = (fecha: string | Date) => {
  try {
    return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
  } catch {
    return String(fecha);
  }
};

export const formatearMonto = (monto: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(monto);
};

export const formatearNombre = (nombre: string) => {
  return nombre.replace(/\b\w/g, l => l.toUpperCase());
};
