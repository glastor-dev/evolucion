/**
 * Utilidades para mejorar la accesibilidad de la aplicación
 */

// Tipos para elementos accesibles
export interface AccessibleElement {
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-atomic"?: boolean;
  "aria-busy"?: boolean;
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false";
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean | "grammar" | "spelling";
  "aria-required"?: boolean;
  "aria-selected"?: boolean;
  tabIndex?: number;
}

// Generador de IDs únicos para elementos
let idCounter = 0;
export const generateId = (prefix: string = "element"): string => {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
};

// Utilidades para navegación por teclado
export const keyboardNavigation = {
  // Teclas comunes
  keys: {
    ENTER: "Enter",
    SPACE: " ",
    ESCAPE: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    TAB: "Tab",
    HOME: "Home",
    END: "End",
  },

  // Manejador para elementos clickeables con teclado
  handleKeyDown: (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  },

  // Navegación en listas
  handleListNavigation: (
    event: React.KeyboardEvent,
    currentIndex: number,
    itemCount: number,
    onIndexChange: (index: number) => void,
    onSelect?: (index: number) => void
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        newIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : 0;
        break;
      case "ArrowUp":
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : itemCount - 1;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (onSelect) onSelect(currentIndex);
        return;
      default:
        return;
    }

    onIndexChange(newIndex);
  },
};

// Utilidades para anuncios de pantalla lectora
export const screenReader = {
  // Crear elemento para anuncios en vivo
  createLiveRegion: (id: string, level: "polite" | "assertive" = "polite") => {
    const existing = document.getElementById(id);
    if (existing) return existing;

    const liveRegion = document.createElement("div");
    liveRegion.id = id;
    liveRegion.setAttribute("aria-live", level);
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);
    return liveRegion;
  },

  // Anunciar mensaje
  announce: (message: string, level: "polite" | "assertive" = "polite") => {
    const liveRegion = screenReader.createLiveRegion("live-region", level);
    liveRegion.textContent = message;

    // Limpiar después de un tiempo para evitar repeticiones
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1000);
  },
};

// Utilidades para focus management
export const focusManagement = {
  // Elementos focuseables
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  // Trap focus dentro de un contenedor
  trapFocus: (container: HTMLElement, event: KeyboardEvent) => {
    const focusableElements = focusManagement.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === "Tab") {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  },

  // Restaurar focus
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  },
};

// Constantes para ARIA labels comunes
export const ARIA_LABELS = {
  // Navegación
  MAIN_NAVIGATION: "Navegación principal",
  BREADCRUMB: "Ruta de navegación",
  PAGINATION: "Navegación de páginas",

  // Acciones
  CLOSE: "Cerrar",
  OPEN: "Abrir",
  TOGGLE: "Alternar",
  SEARCH: "Buscar",
  FILTER: "Filtrar",
  SORT: "Ordenar",

  // Estados
  LOADING: "Cargando",
  ERROR: "Error",
  SUCCESS: "Éxito",
  WARNING: "Advertencia",

  // Carrito y favoritos
  ADD_TO_CART: "Agregar al carrito",
  REMOVE_FROM_CART: "Quitar del carrito",
  ADD_TO_FAVORITES: "Agregar a favoritos",
  REMOVE_FROM_FAVORITES: "Quitar de favoritos",

  // Formularios
  REQUIRED_FIELD: "Campo obligatorio",
  OPTIONAL_FIELD: "Campo opcional",
  INVALID_INPUT: "Entrada inválida",
} as const;

export default {
  generateId,
  keyboardNavigation,
  screenReader,
  focusManagement,
  ARIA_LABELS,
};
