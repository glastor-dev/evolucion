import { useEffect, useCallback, useRef, useState } from 'react';
import { screenReader } from '@/utils/accessibility';

interface Section {
  id: string;
  label: string;
  ref: React.RefObject<HTMLElement>;
}

interface UseSectionNavigationOptions {
  sections: Section[];
  enableKeyboardShortcuts?: boolean;
  announceNavigation?: boolean;
  scrollOffset?: number;
}

export const useSectionNavigation = ({
  sections,
  enableKeyboardShortcuts = true,
  announceNavigation = true,
  scrollOffset = 80
}: UseSectionNavigationOptions) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Función para hacer scroll suave a una sección
  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= sections.length) return;

    const section = sections[index];
    const element = section.ref.current;
    
    if (element) {
      setIsNavigating(true);
      
      // Calcular posición con offset
      const elementTop = element.offsetTop - scrollOffset;
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });

      // Enfocar el elemento para accesibilidad
      setTimeout(() => {
        element.focus({ preventScroll: true });
        setCurrentSectionIndex(index);
        setIsNavigating(false);

        // Anunciar navegación para lectores de pantalla
        if (announceNavigation) {
          screenReader.announce(`Navegando a ${section.label}`, 'polite');
        }
      }, 300);
    }
  }, [sections, scrollOffset, announceNavigation]);

  // Navegar a la siguiente sección
  const goToNextSection = useCallback(() => {
    const nextIndex = (currentSectionIndex + 1) % sections.length;
    scrollToSection(nextIndex);
  }, [currentSectionIndex, sections.length, scrollToSection]);

  // Navegar a la sección anterior
  const goToPreviousSection = useCallback(() => {
    const prevIndex = currentSectionIndex === 0 ? sections.length - 1 : currentSectionIndex - 1;
    scrollToSection(prevIndex);
  }, [currentSectionIndex, sections.length, scrollToSection]);

  // Navegar a una sección específica
  const goToSection = useCallback((index: number) => {
    scrollToSection(index);
  }, [scrollToSection]);

  // Detectar sección activa durante el scroll
  const detectActiveSection = useCallback(() => {
    if (isNavigating) return;

    const scrollPosition = window.scrollY + scrollOffset + 50;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = sections[i].ref.current;
      if (element && element.offsetTop <= scrollPosition) {
        setCurrentSectionIndex(i);
        break;
      }
    }
  }, [sections, scrollOffset, isNavigating]);

  // Manejador de eventos de teclado
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enableKeyboardShortcuts) return;

    // Solo activar si no hay elementos de formulario enfocados
    const activeElement = document.activeElement;
    const isFormElement = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.tagName === 'SELECT' ||
      activeElement.getAttribute('contenteditable') === 'true'
    );

    if (isFormElement) return;

    switch (event.key) {
      case 'j':
      case 'ArrowDown':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          goToNextSection();
        }
        break;
      case 'k':
      case 'ArrowUp':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          goToPreviousSection();
        }
        break;
      case 'Home':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          goToSection(0);
        }
        break;
      case 'End':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          goToSection(sections.length - 1);
        }
        break;
      // Atajos numéricos (1-9)
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (event.altKey) {
          event.preventDefault();
          const sectionIndex = parseInt(event.key) - 1;
          if (sectionIndex < sections.length) {
            goToSection(sectionIndex);
          }
        }
        break;
    }
  }, [enableKeyboardShortcuts, goToNextSection, goToPreviousSection, goToSection, sections.length]);

  // Configurar event listeners
  useEffect(() => {
    if (enableKeyboardShortcuts) {
      document.addEventListener('keydown', handleKeyDown);
    }

    window.addEventListener('scroll', detectActiveSection, { passive: true });

    // Detectar sección inicial
    detectActiveSection();

    return () => {
      if (enableKeyboardShortcuts) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      window.removeEventListener('scroll', detectActiveSection);
    };
  }, [enableKeyboardShortcuts, handleKeyDown, detectActiveSection]);

  // Configurar atributos de accesibilidad para las secciones
  useEffect(() => {
    sections.forEach((section, index) => {
      const element = section.ref.current;
      if (element) {
        // Hacer la sección focusable
        element.setAttribute('tabindex', '-1');
        
        // Agregar role y aria-label si no existen
        if (!element.getAttribute('role')) {
          element.setAttribute('role', 'region');
        }
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          element.setAttribute('aria-label', section.label);
        }

        // Agregar indicador visual de focus
        element.style.outline = 'none';
        element.addEventListener('focus', () => {
          element.style.boxShadow = '0 0 0 2px hsl(var(--primary))';
        });
        element.addEventListener('blur', () => {
          element.style.boxShadow = 'none';
        });
      }
    });
  }, [sections]);

  return {
    currentSectionIndex,
    goToNextSection,
    goToPreviousSection,
    goToSection,
    scrollToSection,
    isNavigating,
    sections
  };
};