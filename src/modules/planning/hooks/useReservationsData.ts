import { useState, useEffect } from 'react';
import { Reservation } from '../types';

interface UseReservationsDataReturn {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useReservationsData = (): UseReservationsDataReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await window.electronAPI?.planning?.getReservations?.() || 
                      await fetch('/api/reservations').then(res => res.json());
      
      setReservations(response.data || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations
  };
};

// API functions
export const createReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> => {
  try {
    const response = await window.electronAPI?.planning?.createReservation?.(reservation) ||
                    await fetch('/api/reservations', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(reservation)
                    }).then(res => res.json());
    
    return response.data || response;
  } catch (error) {
    throw new Error('Erreur lors de la création de la réservation');
  }
};

export const updateReservation = async (reservation: Reservation): Promise<void> => {
  try {
    await window.electronAPI?.planning?.updateReservation?.(reservation) ||
    await fetch(`/api/reservations/${reservation.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la réservation');
  }
};

export const deleteReservation = async (id: string): Promise<void> => {
  try {
    await window.electronAPI?.planning?.deleteReservation?.(id) ||
    await fetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la réservation');
  }
};
