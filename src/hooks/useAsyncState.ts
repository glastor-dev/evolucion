import { useCallback, useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncStateOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAsyncState<T>(
  asyncFunction?: () => Promise<T>,
  options: UseAsyncStateOptions = {}
) {
  const { initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (customAsyncFunction?: () => Promise<T>) => {
      const functionToExecute = customAsyncFunction || asyncFunction;

      if (!functionToExecute) {
        console.warn("No async function provided to execute");
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await functionToExecute();
        setState({ data: result, loading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        onError?.(errorMessage);
        throw error;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  // Auto-execute on mount if asyncFunction is provided
  useEffect(() => {
    if (asyncFunction) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    isIdle: !state.loading && !state.error && !state.data,
    isSuccess: !state.loading && !state.error && state.data !== null,
    isError: !state.loading && state.error !== null,
  };
}

// Hook específico para operaciones de búsqueda
export function useSearch<T>(searchFunction: (query: string) => Promise<T[]>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setQuery(searchQuery);
      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(searchQuery);
        setResults(searchResults);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error en la búsqueda";
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchFunction]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    search,
    clearSearch,
    hasResults: results.length > 0,
    isEmpty: !loading && results.length === 0 && query.trim() !== "",
  };
}

// Hook para manejar operaciones CRUD
export function useCrud<T>(
  fetchFunction: () => Promise<T[]>,
  createFunction?: (item: Omit<T, "id">) => Promise<T>,
  updateFunction?: (id: string, item: Partial<T>) => Promise<T>,
  deleteFunction?: (id: string) => Promise<void>
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedItems = await fetchFunction();
      setItems(fetchedItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  const createItem = useCallback(
    async (item: Omit<T, "id">) => {
      if (!createFunction) throw new Error("Create function not provided");

      setLoading(true);
      try {
        const newItem = await createFunction(item);
        setItems((prev) => [...prev, newItem]);
        return newItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al crear elemento";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createFunction]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<T>) => {
      if (!updateFunction) throw new Error("Update function not provided");

      setLoading(true);
      try {
        const updatedItem = await updateFunction(id, updates);
        setItems((prev) => prev.map((item) => ((item as any).id === id ? updatedItem : item)));
        return updatedItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al actualizar elemento";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateFunction]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      if (!deleteFunction) throw new Error("Delete function not provided");

      setLoading(true);
      try {
        await deleteFunction(id);
        setItems((prev) => prev.filter((item) => (item as any).id !== id));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al eliminar elemento";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [deleteFunction]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    isEmpty: !loading && items.length === 0,
  };
}
