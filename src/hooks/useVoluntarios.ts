'use client';
import { useState, useCallback } from 'react';
import { Postulacion } from '@/types/voluntario.types';

export const useVoluntarios = () => {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPostulaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/voluntarios', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPostulaciones(data);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  return { postulaciones, loading, fetchPostulaciones };
};
