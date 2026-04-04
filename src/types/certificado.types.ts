export interface Certificado {
  idcertificados: string;
  nombrevoluntario: string;
  actividadasociada: string;
  // Agregamos campos virtuales locales para mantener compatibilidad UI
  estado?: string;
  created_at?: string;
  tipo_certificado?: string;
}

export interface CreateCertificadoDTO {
  nombrevoluntario: string;
  actividadasociada: string;
}
