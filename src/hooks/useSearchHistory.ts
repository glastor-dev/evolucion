import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'glastor_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount?: number;
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Cargar historial desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Agregar búsqueda al historial
  const addSearch = useCallback((query: string, resultsCount?: number) => {
    if (!query.trim()) return;

    setHistory((prev) => {
      // Eliminar duplicados (misma query)
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );

      // Agregar nueva búsqueda al inicio
      const newHistory = [
        { query: query.trim(), timestamp: Date.now(), resultsCount },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS);

      // Guardar en localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error saving search history:', error);
      }

      return newHistory;
    });
  }, []);

  // Eliminar una búsqueda del historial
  const removeSearch = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.query !== query);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.error('Error removing search:', error);
      }
      return filtered;
    });
  }, []);

  // Limpiar todo el historial
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  // Obtener sugerencias basadas en el historial
  const getSuggestions = useCallback(
    (query: string, limit: number = 5) => {
      if (!query.trim()) return [];

      const lowerQuery = query.toLowerCase();
      return history
        .filter((item) => item.query.toLowerCase().includes(lowerQuery))
        .slice(0, limit);
    },
    [history]
  );

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory,
    getSuggestions,
  };
};
