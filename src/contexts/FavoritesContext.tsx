import React, { createContext, ReactNode, useContext, useEffect, useReducer } from "react";

export interface FavoriteItem {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  category: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  isOpen: boolean;
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "TOGGLE_FAVORITE"; payload: FavoriteItem }
  | { type: "CLEAR_FAVORITES" }
  | { type: "TOGGLE_PANEL" }
  | { type: "OPEN_PANEL" }
  | { type: "CLOSE_PANEL" }
  | { type: "LOAD_FAVORITES"; payload: FavoriteItem[] };

const initialState: FavoritesState = {
  items: [],
  isOpen: false,
};

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case "ADD_FAVORITE": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state; // Ya existe, no hacer nada
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_FAVORITE": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items: newItems };
    }

    case "TOGGLE_FAVORITE": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        // Remover de favoritos
        const newItems = state.items.filter((item) => item.id !== action.payload.id);
        return { ...state, items: newItems };
      } else {
        // Agregar a favoritos
        return { ...state, items: [...state.items, action.payload] };
      }
    }

    case "CLEAR_FAVORITES":
      return { ...state, items: [] };

    case "TOGGLE_PANEL":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_PANEL":
      return { ...state, isOpen: true };

    case "CLOSE_PANEL":
      return { ...state, isOpen: false };

    case "LOAD_FAVORITES":
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

interface FavoritesContextType {
  state: FavoritesState;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    const savedFavorites = localStorage.getItem("glastor-favorites");
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: "LOAD_FAVORITES", payload: favorites });
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("glastor-favorites", JSON.stringify(state.items));
  }, [state.items]);

  const addFavorite = (item: FavoriteItem) => {
    dispatch({ type: "ADD_FAVORITE", payload: item });
  };

  const removeFavorite = (id: number) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: id });
  };

  const toggleFavorite = (item: FavoriteItem) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: item });
  };

  const isFavorite = (id: number) => {
    return state.items.some((item) => item.id === id);
  };

  const clearFavorites = () => {
    dispatch({ type: "CLEAR_FAVORITES" });
  };

  const togglePanel = () => {
    dispatch({ type: "TOGGLE_PANEL" });
  };

  const openPanel = () => {
    dispatch({ type: "OPEN_PANEL" });
  };

  const closePanel = () => {
    dispatch({ type: "CLOSE_PANEL" });
  };

  return (
    <FavoritesContext.Provider
      value={{
        state,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        togglePanel,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
