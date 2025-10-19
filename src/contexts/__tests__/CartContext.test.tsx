import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, CartItem } from "../CartContext";
import { createMockCartItem } from "../../test/test-utils";

// Wrapper para el provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  describe("useCart hook", () => {
    it("should throw error when used outside CartProvider", () => {
      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within a CartProvider");
    });

    it("should return cart context when used within CartProvider", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.state).toBeDefined();
      expect(result.current.addItem).toBeDefined();
      expect(result.current.removeItem).toBeDefined();
      expect(result.current.updateQuantity).toBeDefined();
      expect(result.current.clearCart).toBeDefined();
      expect(result.current.toggleCart).toBeDefined();
      expect(result.current.openCart).toBeDefined();
      expect(result.current.closeCart).toBeDefined();
    });
  });

  describe("Initial state", () => {
    it("should have empty cart initially", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.state.items).toEqual([]);
      expect(result.current.state.isOpen).toBe(false);
      expect(result.current.state.total).toBe(0);
    });
  });

  describe("addItem", () => {
    it("should add new item to cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        brand: "Makita",
        price: "150,00€",
        image: "/taladro.jpg",
      });

      act(() => {
        result.current.addItem(mockItem);
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0]).toEqual({
        ...mockItem,
        quantity: 1,
      });
      expect(result.current.state.total).toBe(150);
    });

    it("should increment quantity when adding existing item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        brand: "Makita",
        price: "150,00€",
        image: "/taladro.jpg",
      });

      act(() => {
        result.current.addItem(mockItem);
        result.current.addItem(mockItem);
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].quantity).toBe(2);
      expect(result.current.state.total).toBe(300);
    });

    it("should handle multiple different items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        price: "150,00€",
      });
      const item2 = createMockCartItem({
        id: 2,
        name: "Sierra Bosch",
        price: "200,50€",
      });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.state.items).toHaveLength(2);
      expect(result.current.state.total).toBe(350.5);
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        price: "150,00€",
      });

      act(() => {
        result.current.addItem(mockItem);
        result.current.removeItem(1);
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.state.total).toBe(0);
    });

    it("should not affect cart when removing non-existent item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        price: "150,00€",
      });

      act(() => {
        result.current.addItem(mockItem);
        result.current.removeItem(999); // ID que no existe
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.total).toBe(150);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        price: "150,00€",
      });

      act(() => {
        result.current.addItem(mockItem);
        result.current.updateQuantity(1, 3);
      });

      expect(result.current.state.items[0].quantity).toBe(3);
      expect(result.current.state.total).toBe(450);
    });

    it("should remove item when quantity is set to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        price: "150,00€",
      });

      act(() => {
        result.current.addItem(mockItem);
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.state.total).toBe(0);
    });

    it("should remove item when quantity is negative", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        name: "Taladro Makita",
        price: "150,00€",
      });

      act(() => {
        result.current.addItem(mockItem);
        result.current.updateQuantity(1, -1);
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.state.total).toBe(0);
    });
  });

  describe("clearCart", () => {
    it("should clear all items from cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({ id: 1, price: "150,00€" });
      const item2 = createMockCartItem({ id: 2, price: "200,50€" });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.clearCart();
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.state.total).toBe(0);
    });
  });

  describe("Cart visibility", () => {
    it("should toggle cart visibility", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.state.isOpen).toBe(false);

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.state.isOpen).toBe(false);
    });

    it("should open cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.openCart();
      });

      expect(result.current.state.isOpen).toBe(true);
    });

    it("should close cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.openCart();
        result.current.closeCart();
      });

      expect(result.current.state.isOpen).toBe(false);
    });
  });

  describe("Total calculation", () => {
    it("should calculate total correctly with different price formats", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({
        id: 1,
        price: "150,50€", // Precio con coma decimal
      });
      const item2 = createMockCartItem({
        id: 2,
        price: "200.75€", // Precio con punto decimal
      });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.state.total).toBe(351.25);
    });

    it("should handle price without euro symbol", () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const mockItem = createMockCartItem({
        id: 1,
        price: "150,50", // Sin símbolo €
      });

      act(() => {
        result.current.addItem(mockItem);
      });

      expect(result.current.state.total).toBe(150.5);
    });
  });
});
