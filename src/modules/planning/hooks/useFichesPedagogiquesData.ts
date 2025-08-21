import { useState, useEffect } from 'react';
import { FichePedagogique } from '../types';

interface UseFichesPedagogiquesDataReturn {
  fiches: FichePedagogique[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFichesPedagogiquesData = (): UseFichesPedagogiquesDataReturn => {
  const [fiches, setFiches] = useState<FichePedagogique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await window.electronAPI?.planning?.getFichesPedagogiques?.() || 
                      await fetch('/api/fiches-pedagogiques').then(res => res.json());
      
      setFiches(response.data || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setFiches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiches();
  }, []);

  return {
    fiches,
    loading,
    error,
    refetch: fetchFiches
  };
};

// API functions
export const createFichePedagogique = async (fiche: Omit<FichePedagogique, 'id' | 'createdAt' | 'updatedAt'>): Promise<FichePedagogique> => {
  try {
    const response = await window.electronAPI?.planning?.createFichePedagogique?.(fiche) ||
                    await fetch('/api/fiches-pedagogiques', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(fiche)
                    }).then(res => res.json());
    
    return response.data || response;
  } catch (error) {
    throw new Error('Erreur lors de la création de la fiche');
  }
};

export const updateFichePedagogique = async (fiche: FichePedagogique): Promise<void> => {
  try {
    await window.electronAPI?.planning?.updateFichePedagogique?.(fiche) ||
    await fetch(`/api/fiches-pedagogiques/${fiche.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fiche)
    });
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la fiche');
  }
};

export const duplicateFichePedagogique = async (fiche: FichePedagogique): Promise<FichePedagogique> => {
  const duplicatedFiche = {
    ...fiche,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return createFichePedagogique(duplicatedFiche);
};
