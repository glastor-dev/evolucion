import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites, FavoriteItem } from "../FavoritesContext";

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Wrapper para el provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

const createMockFavoriteItem = (overrides = {}): FavoriteItem => ({
  id: 1,
  name: "Taladro Makita",
  brand: "Makita",
  price: "150,00€",
  image: "/taladro.jpg",
  category: "herramientas",
  ...overrides,
});

describe("FavoritesContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("useFavorites hook", () => {
    it("should throw error when used outside FavoritesProvider", () => {
      expect(() => {
        renderHook(() => useFavorites());
      }).toThrow("useFavorites must be used within a FavoritesProvider");
    });

    it("should return favorites context when used within FavoritesProvider", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.state).toBeDefined();
      expect(result.current.addFavorite).toBeDefined();
      expect(result.current.removeFavorite).toBeDefined();
      expect(result.current.toggleFavorite).toBeDefined();
      expect(result.current.isFavorite).toBeDefined();
      expect(result.current.clearFavorites).toBeDefined();
      expect(result.current.togglePanel).toBeDefined();
      expect(result.current.openPanel).toBeDefined();
      expect(result.current.closePanel).toBeDefined();
    });
  });

  describe("Initial state", () => {
    it("should have empty favorites initially", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      expect(result.current.state.items).toEqual([]);
      expect(result.current.state.isOpen).toBe(false);
    });

    it("should load favorites from localStorage on initialization", () => {
      const savedFavorites = [
        createMockFavoriteItem({ id: 1, name: "Taladro" }),
        createMockFavoriteItem({ id: 2, name: "Sierra" }),
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFavorites));

      const { result } = renderHook(() => useFavorites(), { wrapper });

      expect(result.current.state.items).toEqual(savedFavorites);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("glastor-favorites");
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue("invalid-json");

      const { result } = renderHook(() => useFavorites(), { wrapper });

      expect(result.current.state.items).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error loading favorites from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("addFavorite", () => {
    it("should add new item to favorites", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0]).toEqual(mockItem);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "glastor-favorites",
        JSON.stringify([mockItem])
      );
    });

    it("should not add duplicate items", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
        result.current.addFavorite(mockItem); // Intentar agregar el mismo item
      });

      expect(result.current.state.items).toHaveLength(1);
    });

    it("should add multiple different items", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const item1 = createMockFavoriteItem({ id: 1, name: "Taladro" });
      const item2 = createMockFavoriteItem({ id: 2, name: "Sierra" });

      act(() => {
        result.current.addFavorite(item1);
        result.current.addFavorite(item2);
      });

      expect(result.current.state.items).toHaveLength(2);
      expect(result.current.state.items).toContain(item1);
      expect(result.current.state.items).toContain(item2);
    });
  });

  describe("removeFavorite", () => {
    it("should remove item from favorites", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
        result.current.removeFavorite(mockItem.id);
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
        "glastor-favorites",
        JSON.stringify([])
      );
    });

    it("should not affect favorites when removing non-existent item", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
        result.current.removeFavorite(999); // ID que no existe
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0]).toEqual(mockItem);
    });
  });

  describe("toggleFavorite", () => {
    it("should add item when not in favorites", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.toggleFavorite(mockItem);
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0]).toEqual(mockItem);
    });

    it("should remove item when already in favorites", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
        result.current.toggleFavorite(mockItem);
      });

      expect(result.current.state.items).toHaveLength(0);
    });

    it("should toggle item multiple times correctly", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.toggleFavorite(mockItem); // Agregar
      });
      expect(result.current.state.items).toHaveLength(1);

      act(() => {
        result.current.toggleFavorite(mockItem); // Remover
      });
      expect(result.current.state.items).toHaveLength(0);

      act(() => {
        result.current.toggleFavorite(mockItem); // Agregar de nuevo
      });
      expect(result.current.state.items).toHaveLength(1);
    });
  });

  describe("isFavorite", () => {
    it("should return true for favorite items", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
      });

      expect(result.current.isFavorite(mockItem.id)).toBe(true);
    });

    it("should return false for non-favorite items", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      expect(result.current.isFavorite(999)).toBe(false);
    });

    it("should update correctly when items are added/removed", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      expect(result.current.isFavorite(mockItem.id)).toBe(false);

      act(() => {
        result.current.addFavorite(mockItem);
      });
      expect(result.current.isFavorite(mockItem.id)).toBe(true);

      act(() => {
        result.current.removeFavorite(mockItem.id);
      });
      expect(result.current.isFavorite(mockItem.id)).toBe(false);
    });
  });

  describe("clearFavorites", () => {
    it("should clear all favorites", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const item1 = createMockFavoriteItem({ id: 1 });
      const item2 = createMockFavoriteItem({ id: 2 });

      act(() => {
        result.current.addFavorite(item1);
        result.current.addFavorite(item2);
        result.current.clearFavorites();
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
        "glastor-favorites",
        JSON.stringify([])
      );
    });
  });

  describe("Panel visibility", () => {
    it("should toggle panel visibility", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      expect(result.current.state.isOpen).toBe(false);

      act(() => {
        result.current.togglePanel();
      });
      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.togglePanel();
      });
      expect(result.current.state.isOpen).toBe(false);
    });

    it("should open panel", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.openPanel();
      });

      expect(result.current.state.isOpen).toBe(true);
    });

    it("should close panel", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.openPanel();
        result.current.closePanel();
      });

      expect(result.current.state.isOpen).toBe(false);
    });
  });

  describe("localStorage integration", () => {
    it("should save to localStorage when favorites change", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "glastor-favorites",
        JSON.stringify([mockItem])
      );
    });

    it("should save empty array when all favorites are cleared", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      const mockItem = createMockFavoriteItem();

      act(() => {
        result.current.addFavorite(mockItem);
        result.current.clearFavorites();
      });

      expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
        "glastor-favorites",
        JSON.stringify([])
      );
    });
  });
});
