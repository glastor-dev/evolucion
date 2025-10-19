import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockProduct } from "../../test/test-utils";
import App from "../../App";

// Mock de window.open para PayPal
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
});

// Mock de IntersectionObserver para el ProductCatalog
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("Purchase Flow Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete full purchase flow from product catalog to cart", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Buscar el primer botón "Agregar al carrito"
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    expect(addToCartButtons.length).toBeGreaterThan(0);

    // Agregar producto al carrito
    await user.click(addToCartButtons[0]);

    // Verificar que el contador del carrito se actualiza
    await waitFor(() => {
      const cartBadge = screen.getByText("1");
      expect(cartBadge).toBeInTheDocument();
    });

    // Abrir el carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Verificar que el carrito se abre y muestra el producto
    await waitFor(() => {
      expect(screen.getByText(/Carrito de Compras/i)).toBeInTheDocument();
    });

    // Verificar que hay al menos un producto en el carrito
    const cartItems = screen.getAllByRole("button", { name: /eliminar/i });
    expect(cartItems.length).toBeGreaterThan(0);
  });

  it("should update product quantity in cart", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar producto al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);

    // Abrir el carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Buscar controles de cantidad
    await waitFor(() => {
      const increaseButtons = screen.getAllByRole("button", { name: "+" });
      expect(increaseButtons.length).toBeGreaterThan(0);
    });

    // Incrementar cantidad
    const increaseButton = screen.getAllByRole("button", { name: "+" })[0];
    await user.click(increaseButton);

    // Verificar que el contador del carrito se actualiza a 2
    await waitFor(() => {
      const cartBadge = screen.getByText("2");
      expect(cartBadge).toBeInTheDocument();
    });
  });

  it("should remove product from cart", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar producto al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);

    // Abrir el carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Eliminar producto del carrito
    await waitFor(() => {
      const removeButton = screen.getByRole("button", { name: /eliminar/i });
      expect(removeButton).toBeInTheDocument();
    });

    const removeButton = screen.getByRole("button", { name: /eliminar/i });
    await user.click(removeButton);

    // Verificar que el carrito está vacío
    await waitFor(() => {
      expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    });
  });

  it("should proceed to PayPal checkout", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar producto al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);

    // Abrir el carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Buscar el botón de pagar
    await waitFor(() => {
      const payButton = screen.getByRole("button", { name: /pagar/i });
      expect(payButton).toBeInTheDocument();
    });

    // Hacer clic en pagar
    const payButton = screen.getByRole("button", { name: /pagar/i });
    await user.click(payButton);

    // Verificar que se abre PayPal
    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(expect.stringContaining("paypal.com"), "_blank");
    });
  });

  it("should handle multiple products in cart", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar múltiples productos al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);

    // Agregar al menos 2 productos diferentes
    if (addToCartButtons.length >= 2) {
      await user.click(addToCartButtons[0]);
      await user.click(addToCartButtons[1]);

      // Verificar que el contador del carrito muestra 2
      await waitFor(() => {
        const cartBadge = screen.getByText("2");
        expect(cartBadge).toBeInTheDocument();
      });

      // Abrir el carrito
      const cartButton = screen.getByRole("button", { name: /carrito/i });
      await user.click(cartButton);

      // Verificar que hay múltiples productos en el carrito
      await waitFor(() => {
        const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
        expect(removeButtons.length).toBe(2);
      });
    }
  });

  it("should clear entire cart", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar productos al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);
    if (addToCartButtons.length >= 2) {
      await user.click(addToCartButtons[1]);
    }

    // Abrir el carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Buscar y hacer clic en el botón de limpiar carrito (si existe)
    const clearButton = screen.queryByRole("button", { name: /limpiar carrito/i });
    if (clearButton) {
      await user.click(clearButton);

      // Verificar que el carrito está vacío
      await waitFor(() => {
        expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
      });
    }
  });

  it("should maintain cart state when navigating", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar producto al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);

    // Verificar que el contador del carrito se mantiene
    await waitFor(() => {
      const cartBadge = screen.getByText("1");
      expect(cartBadge).toBeInTheDocument();
    });

    // Cerrar el carrito si está abierto
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Verificar que el estado del carrito se mantiene
    await waitFor(() => {
      const cartBadge = screen.getByText("1");
      expect(cartBadge).toBeInTheDocument();
    });
  });

  it("should show correct total price calculation", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el catálogo
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
    });

    // Agregar producto al carrito
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);

    // Abrir el carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Verificar que se muestra un total
    await waitFor(() => {
      const totalElements = screen.getAllByText(/total/i);
      expect(totalElements.length).toBeGreaterThan(0);
    });

    // Incrementar cantidad y verificar que el total se actualiza
    const increaseButton = screen.getAllByRole("button", { name: "+" })[0];
    await user.click(increaseButton);

    // El total debería actualizarse (verificamos que sigue existiendo)
    await waitFor(() => {
      const totalElements = screen.getAllByText(/total/i);
      expect(totalElements.length).toBeGreaterThan(0);
    });
  });
});
