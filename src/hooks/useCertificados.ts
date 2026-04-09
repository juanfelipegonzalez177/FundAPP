'use client';
import { useState, useCallback } from 'react';

export const useCertificados = () => {
  const [certificados, setCertificados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCertificados = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificados', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Since backend GET returns { certificados: [], donaciones: [] }
        setCertificados(data.certificados || []);
      }
    } catch {
      setError('Ocurrió un error al cargar');
    }
    finally { setLoading(false); }
  }, []);

  return { certificados, fetchCertificados, loading, error };
};
