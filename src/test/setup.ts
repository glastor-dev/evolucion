import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

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

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock de Performance API
Object.defineProperty(window, "performance", {
  writable: true,
  value: {
    ...window.performance,
    getEntriesByType: vi.fn().mockImplementation((type) => {
      if (type === "navigation") {
        return [
          {
            responseStart: 100,
            requestStart: 50,
            domContentLoadedEventEnd: 200,
            navigationStart: 0,
            loadEventEnd: 300,
            type: 0,
            name: "document",
            entryType: "navigation",
            startTime: 0,
            duration: 300,
          },
        ];
      }
      return [];
    }),
    getEntriesByName: vi.fn().mockReturnValue([]),
    mark: vi.fn(),
    measure: vi.fn(),
    now: vi.fn().mockReturnValue(Date.now()),
    navigation: {
      responseStart: 100,
      requestStart: 50,
      domContentLoadedEventEnd: 200,
      navigationStart: 0,
      loadEventEnd: 300,
      type: 0,
    },
  },
});

// Mock de Navigation API
Object.defineProperty(window, "navigation", {
  writable: true,
  value: {
    responseStart: 100,
    requestStart: 50,
    domContentLoadedEventEnd: 200,
    navigationStart: 0,
    loadEventEnd: 300,
    type: 0,
  },
});

// Mock de window.open
Object.defineProperty(window, "open", {
  writable: true,
  value: vi.fn(),
});
