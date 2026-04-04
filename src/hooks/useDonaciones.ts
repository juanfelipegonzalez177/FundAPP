'use client';
import { useState, useCallback } from 'react';
import { Donacion } from '@/types/donacion.types';

export const useDonaciones = () => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/donaciones', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDonaciones(data);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  return { donaciones, loading, fetchDonaciones };
};
