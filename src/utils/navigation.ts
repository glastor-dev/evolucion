import { useState, useEffect } from 'react';

// Utilidades para navegación suave y scroll
export const smoothScrollTo = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Función mejorada para navegación desde enlaces
export const handleSmoothNavigation = (href: string, callback?: () => void) => {
  if (href.startsWith('#')) {
    const targetId = href.substring(1);
    
    // Intentar scroll inmediato
    let element = document.getElementById(targetId);
    
    if (element) {
      smoothScrollTo(targetId);
    } else {
      // Si no se encuentra, esperar un poco y reintentar (útil para elementos que se renderizan después)
      setTimeout(() => {
        element = document.getElementById(targetId);
        if (element) {
          smoothScrollTo(targetId);
        }
      }, 100);
    }
    
    // Ejecutar callback si se proporciona (ej: cerrar menú móvil)
    if (callback) {
      setTimeout(callback, 100);
    }
  }
};

// Hook para detectar la sección activa durante el scroll
export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset para navbar

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar inmediatamente

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
};