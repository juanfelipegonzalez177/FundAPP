'use client';
import { useState, useEffect, useCallback } from 'react';
import { Actividad } from '@/types/actividad.types';

export const useActividades = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActividades = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/actividades');
      if (res.ok) {
        const data = await res.json();
        setActividades(data);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchActividades(); }, [fetchActividades]);

  return { actividades, loading, refetch: fetchActividades };
};
