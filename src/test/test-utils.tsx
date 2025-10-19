import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { ThemeProvider } from "../contexts/theme-context";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

// Configuración de i18n para testing
const testI18n = i18n.cloneInstance({
  lng: "es",
  fallbackLng: "es",
  debug: false,
});

// Wrapper para los tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={testI18n}>
      <ThemeProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock de funciones comunes
const mockNavigate = vi.fn();
const mockLocation = {
  pathname: "/",
  search: "",
  hash: "",
  state: null,
};

// Mock de hooks de react-router-dom
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock de funciones de localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock de funciones de sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock de funciones de window
const mockWindow = {
  scrollTo: vi.fn(),
  location: {
    href: "",
  },
};

// Mock de funciones de document
const mockDocument = {
  documentElement: {
    style: {},
  },
};

// Configuración global de mocks
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
Object.defineProperty(window, "sessionStorage", { value: mockSessionStorage });
Object.defineProperty(window, "scrollTo", { value: mockWindow.scrollTo });
Object.defineProperty(window, "location", { value: mockWindow.location });
Object.defineProperty(document, "documentElement", { value: mockDocument.documentElement });

// Exportar todo lo necesario para los tests
export * from "@testing-library/react";
export { customRender as render };
export { mockNavigate, mockLocation, mockLocalStorage, mockSessionStorage, mockWindow, mockDocument };

// Función de ayuda para crear un producto de prueba
export const createMockCartItem = ({
  id = "1",
  name = "Test Product",
  brand = "Test Brand",
  price = "100,00€",
  image = "/test.jpg",
  quantity = 1,
  ...rest
} = {}) => ({
  id,
  name,
  brand,
  price,
  image,
  quantity,
  ...rest,
});
