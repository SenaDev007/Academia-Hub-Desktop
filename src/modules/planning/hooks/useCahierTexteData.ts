import { useState, useEffect } from 'react';
import { CahierTexteEntry } from '../types';

interface UseCahierTexteDataReturn {
  entries: CahierTexteEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCahierTexteData = (): UseCahierTexteDataReturn => {
  const [entries, setEntries] = useState<CahierTexteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await window.electronAPI?.planning?.getCahierTexteEntries?.() || 
                      await fetch('/api/cahier-texte').then(res => res.json());
      
      setEntries(response.data || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries
  };
};

// API functions
export const createCahierTexteEntry = async (entry: Omit<CahierTexteEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<CahierTexteEntry> => {
  try {
    const response = await window.electronAPI?.planning?.createCahierTexteEntry?.(entry) ||
                    await fetch('/api/cahier-texte', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(entry)
                    }).then(res => res.json());
    
    return response.data || response;
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'entrée');
  }
};

export const updateCahierTexteEntry = async (entry: CahierTexteEntry): Promise<void> => {
  try {
    await window.electronAPI?.planning?.updateCahierTexteEntry?.(entry) ||
    await fetch(`/api/cahier-texte/${entry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'entrée');
  }
};
