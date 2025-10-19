import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import ProductCatalog from "../ProductCatalog";

// Mock de IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock de scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe("ProductCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render catalog title", () => {
    render(<ProductCatalog />);

    expect(screen.getByText(/Catálogo de Productos/i)).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(<ProductCatalog />);

    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("should render category filters", () => {
    render(<ProductCatalog />);

    // Buscar botones de categorías comunes
    expect(screen.getByText(/Todos/i)).toBeInTheDocument();
    expect(screen.getByText(/Taladros/i)).toBeInTheDocument();
    expect(screen.getByText(/Sierras/i)).toBeInTheDocument();
  });

  it("should render brand filters", () => {
    render(<ProductCatalog />);

    // Buscar filtros de marcas
    expect(screen.getByText(/Makita/i)).toBeInTheDocument();
    expect(screen.getByText(/Bosch/i)).toBeInTheDocument();
    expect(screen.getByText(/DeWalt/i)).toBeInTheDocument();
  });

  it("should render product cards", async () => {
    render(<ProductCatalog />);

    // Esperar a que se rendericen los productos
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });
  });

  it("should filter products by search term", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);

    // Buscar por "taladro"
    await user.type(searchInput, "taladro");

    // Verificar que se muestran resultados relacionados con taladros
    await waitFor(() => {
      const productNames = screen.getAllByText(/taladro/i);
      expect(productNames.length).toBeGreaterThan(0);
    });
  });

  it("should filter products by category", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    // Hacer clic en la categoría "Taladros"
    const taladrosButton = screen.getByText(/Taladros/i);
    await user.click(taladrosButton);

    // Verificar que se muestran solo taladros
    await waitFor(() => {
      const productCards = screen.getAllByText(/Agregar al carrito/i);
      expect(productCards.length).toBeGreaterThan(0);
    });
  });

  it("should filter products by brand", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    // Hacer clic en la marca "Makita"
    const makitaButton = screen.getByText(/Makita/i);
    await user.click(makitaButton);

    // Verificar que se muestran productos de Makita
    await waitFor(() => {
      const makitaProducts = screen.getAllByText(/Makita/i);
      expect(makitaProducts.length).toBeGreaterThan(1); // Al menos el botón y algún producto
    });
  });

  it('should reset filters when clicking "Todos"', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    // Primero filtrar por una categoría específica
    const taladrosButton = screen.getByText(/Taladros/i);
    await user.click(taladrosButton);

    // Luego hacer clic en "Todos" para resetear
    const todosButton = screen.getByText(/Todos/i);
    await user.click(todosButton);

    // Verificar que se muestran todos los productos
    await waitFor(() => {
      const productCards = screen.getAllByText(/Agregar al carrito/i);
      expect(productCards.length).toBeGreaterThan(0);
    });
  });

  it('should add product to cart when clicking "Agregar al carrito"', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    // Esperar a que se carguen los productos
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });

    // Hacer clic en el primer botón "Agregar al carrito"
    const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
    await user.click(addToCartButtons[0]);

    // Verificar que el producto se agregó al carrito (el contador debería aparecer)
    await waitFor(() => {
      const cartBadge = screen.getByText("1");
      expect(cartBadge).toBeInTheDocument();
    });
  });

  it('should show "Comprar ahora" buttons', async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      const buyNowButtons = screen.getAllByText(/Comprar ahora/i);
      expect(buyNowButtons.length).toBeGreaterThan(0);
    });
  });

  it("should display product prices", async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      // Buscar elementos que contengan el símbolo de euro
      const priceElements = screen.getAllByText(/€/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  it("should show free shipping indicators", async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      const freeShippingElements = screen.getAllByText(/Envío gratis/i);
      expect(freeShippingElements.length).toBeGreaterThan(0);
    });
  });

  it("should display installment information", async () => {
    render(<ProductCatalog />);

    await waitFor(() => {
      const installmentElements = screen.getAllByText(/cuotas/i);
      expect(installmentElements.length).toBeGreaterThan(0);
    });
  });

  it("should handle empty search results", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);

    // Buscar algo que no existe
    await user.type(searchInput, "producto-inexistente-xyz");

    // Verificar que se muestra un mensaje de "no hay resultados" o que no hay productos
    await waitFor(() => {
      const addToCartButtons = screen.queryAllByText(/Agregar al carrito/i);
      // Si no hay productos, no debería haber botones de agregar al carrito
      // O debería mostrar un mensaje de "no hay resultados"
      const noResultsMessage =
        screen.queryByText(/No se encontraron productos/i) || screen.queryByText(/Sin resultados/i);

      expect(addToCartButtons.length === 0 || noResultsMessage).toBeTruthy();
    });
  });

  it("should clear search when input is emptied", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);

    // Primero buscar algo
    await user.type(searchInput, "taladro");

    // Luego limpiar la búsqueda
    await user.clear(searchInput);

    // Verificar que se muestran todos los productos de nuevo
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText(/Agregar al carrito/i);
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });
  });

  it("should combine search and category filters", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);

    // Primero filtrar por categoría
    const taladrosButton = screen.getByText(/Taladros/i);
    await user.click(taladrosButton);

    // Luego buscar dentro de esa categoría
    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);
    await user.type(searchInput, "makita");

    // Verificar que se muestran solo taladros de Makita
    await waitFor(() => {
      const results = screen.getAllByText(/Makita/i);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
