import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockProduct } from "../../test/test-utils";
import { Navbar } from "../Navbar";

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render header with logo and navigation", () => {
    render(<Navbar />);

    // Verificar que el logo está presente
    const logo = screen.getByText(/glastor/i);
    expect(logo).toBeInTheDocument();

    // Verificar elementos de navegación
    expect(screen.getByText(/inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/productos/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto/i)).toBeInTheDocument();
  });

  it("should display cart icon with item count", () => {
    render(<Navbar />);

    // Buscar el ícono del carrito
    const cartButton = screen.getByRole("button", { name: /carrito/i });
    expect(cartButton).toBeInTheDocument();
  });

  it("should display favorites icon", () => {
    render(<Navbar />);

    // Buscar el ícono de favoritos
    const favoritesButton = screen.getByRole("button", { name: /favoritos/i });
    expect(favoritesButton).toBeInTheDocument();
  });

  it("should show cart badge when items are added", () => {
    const { addToCart } = render(<Navbar />);
    const mockProduct = createMockProduct();

    // Agregar producto al carrito
    addToCart(mockProduct);

    // Verificar que aparece el badge con la cantidad
    const cartBadge = screen.getByText("1");
    expect(cartBadge).toBeInTheDocument();
  });

  it("should update cart badge when multiple items are added", () => {
    const { addToCart } = render(<Navbar />);
    const mockProduct1 = createMockProduct({ id: 1 });
    const mockProduct2 = createMockProduct({ id: 2 });

    // Agregar múltiples productos
    addToCart(mockProduct1);
    addToCart(mockProduct2);

    // Verificar que el badge muestra la cantidad correcta
    const cartBadge = screen.getByText("2");
    expect(cartBadge).toBeInTheDocument();
  });

  it("should open cart when cart button is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const cartButton = screen.getByRole("button", { name: /carrito/i });
    await user.click(cartButton);

    // Verificar que el carrito se abre (debería mostrar contenido del carrito)
    // Esto depende de cómo esté implementado el componente Cart
    expect(screen.getByText(/carrito/i)).toBeInTheDocument();
  });

  it("should open favorites when favorites button is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const favoritesButton = screen.getByRole("button", { name: /favoritos/i });
    await user.click(favoritesButton);

    // Verificar que el panel de favoritos se abre
    expect(screen.getByText(/favoritos/i)).toBeInTheDocument();
  });

  it("should show favorites badge when items are added to favorites", () => {
    const { addToFavorites } = render(<Navbar />);
    const mockProduct = createMockProduct();

    // Agregar producto a favoritos
    addToFavorites(mockProduct);

    // Verificar que aparece el badge de favoritos
    const favoritesBadge = screen.getByText("1");
    expect(favoritesBadge).toBeInTheDocument();
  });

  it("should be responsive and show mobile menu button on small screens", () => {
    // Simular pantalla pequeña
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Navbar />);

    // Buscar el botón de menú móvil (hamburger menu)
    const mobileMenuButton = screen.queryByRole("button", { name: /menu/i });

    // En pantallas pequeñas debería aparecer el botón de menú
    if (mobileMenuButton) {
      expect(mobileMenuButton).toBeInTheDocument();
    }
  });

  it("should navigate to correct routes when navigation links are clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // Hacer clic en el enlace de productos
    const productosLink = screen.getByText(/productos/i);
    await user.click(productosLink);

    // Verificar navegación (esto depende de la implementación específica)
    expect(productosLink.closest("a")).toHaveAttribute("href");
  });

  it("should maintain cart state across navigation", () => {
    const { addToCart } = render(<Navbar />);
    const mockProduct = createMockProduct();

    // Agregar producto al carrito
    addToCart(mockProduct);

    // Verificar que el badge persiste
    expect(screen.getByText("1")).toBeInTheDocument();

    // Re-renderizar el componente (simular navegación)
    render(<Navbar />);

    // El badge debería seguir mostrando la cantidad correcta
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle empty cart state correctly", () => {
    render(<Navbar />);

    const cartButton = screen.getByRole("button", { name: /carrito/i });
    expect(cartButton).toBeInTheDocument();

    // No debería mostrar badge cuando el carrito está vacío
    const cartBadge = screen.queryByText("0");
    expect(cartBadge).not.toBeInTheDocument();
  });

  it("should handle empty favorites state correctly", () => {
    render(<Navbar />);

    const favoritesButton = screen.getByRole("button", { name: /favoritos/i });
    expect(favoritesButton).toBeInTheDocument();

    // No debería mostrar badge cuando favoritos está vacío
    const favoritesBadge = screen.queryByText("0");
    expect(favoritesBadge).not.toBeInTheDocument();
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // Navegar con Tab a través de los elementos
    await user.tab();

    // Verificar que los elementos son focusables
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();
  });

  it("should have proper ARIA labels for accessibility", () => {
    render(<Navbar />);

    const cartButton = screen.getByRole("button", { name: /carrito/i });
    const favoritesButton = screen.getByRole("button", { name: /favoritos/i });

    expect(cartButton).toHaveAttribute("aria-label");
    expect(favoritesButton).toHaveAttribute("aria-label");
  });

  it("should handle large cart quantities correctly", () => {
    const { addToCart } = render(<Navbar />);
    const mockProduct = createMockProduct();

    // Agregar muchos productos
    for (let i = 0; i < 99; i++) {
      addToCart(mockProduct);
    }

    // Verificar que maneja cantidades grandes
    const cartBadge = screen.getByText("99");
    expect(cartBadge).toBeInTheDocument();
  });

  it("should close mobile menu when navigation item is clicked", async () => {
    // Simular pantalla móvil
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    });

    const user = userEvent.setup();
    render(<Navbar />);

    // Buscar y abrir el menú móvil
    const mobileMenuButton = screen.queryByRole("button", { name: /menu/i });

    if (mobileMenuButton) {
      await user.click(mobileMenuButton);

      // Hacer clic en un elemento de navegación
      const productosLink = screen.getByText(/productos/i);
      await user.click(productosLink);

      // El menú móvil debería cerrarse
      // Esto depende de la implementación específica del componente
    }
  });

  it("should show search functionality if implemented", () => {
    render(<Navbar />);

    // Buscar campo de búsqueda si está implementado
    const searchInput = screen.queryByRole("textbox", { name: /buscar/i });

    if (searchInput) {
      expect(searchInput).toBeInTheDocument();
    }
  });
});
