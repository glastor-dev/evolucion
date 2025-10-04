import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Configuración de i18n para testing
const testI18n = i18n.cloneInstance({
  lng: 'es',
  fallbackLng: 'es',
  debug: false,
});

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <I18nextProvider i18n={testI18n}>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </I18nextProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Utilidades adicionales para testing
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Producto Test',
  price: 100,
  originalPrice: 120,
  image: '/test-image.jpg',
  category: 'test',
  brand: 'Test Brand',
  description: 'Descripción de prueba',
  features: ['Feature 1', 'Feature 2'],
  inStock: true,
  freeShipping: true,
  installments: 12,
  ...overrides,
});

export const createMockCartItem = (overrides = {}) => ({
  id: '1',
  name: 'Producto Test',
  price: 100,
  image: '/test-image.jpg',
  quantity: 1,
  ...overrides,
});

// Mock de funciones comunes
export const mockScrollIntoView = () => {
  Element.prototype.scrollIntoView = vi.fn();
};

export const mockWindowLocation = (url: string) => {
  Object.defineProperty(window, 'location', {
    value: new URL(url),
    writable: true,
  });
};

// Helper para esperar por animaciones
export const waitForAnimation = () => new Promise(resolve => setTimeout(resolve, 100));