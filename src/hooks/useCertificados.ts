'use client';
import { useState, useCallback } from 'react';
import { Certificado } from '@/types/certificado.types';

export const useCertificados = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificados = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificados', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCertificados(data);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  return { certificados, loading, fetchCertificados };
};
