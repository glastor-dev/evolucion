import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, ChevronUp, ChevronDown, Home, RotateCcw } from 'lucide-react';
import { Button } from './button';

interface KeyboardNavigationHelperProps {
  sections: Array<{ id: string; label: string }>;
  currentSectionIndex: number;
  className?: string;
}

export const KeyboardNavigationHelper: React.FC<KeyboardNavigationHelperProps> = ({
  sections,
  currentSectionIndex,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Mostrar automáticamente la primera vez
  useEffect(() => {
    const hasSeenHelper = localStorage.getItem('keyboard-navigation-helper-seen');
    if (!hasSeenHelper && !hasBeenShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasBeenShown]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('keyboard-navigation-helper-seen', 'true');
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Botón flotante para mostrar/ocultar */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleVisibility}
        className={`fixed bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm border-border hover:bg-accent ${className}`}
        aria-label="Mostrar ayuda de navegación por teclado"
        title="Navegación por teclado (Ctrl+J/K)"
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      {/* Panel de ayuda */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 right-4 z-50 w-80 bg-background border border-border rounded-lg shadow-lg p-4"
            role="dialog"
            aria-labelledby="keyboard-help-title"
            aria-describedby="keyboard-help-description"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 id="keyboard-help-title" className="font-semibold text-sm flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Navegación por Teclado
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0"
                aria-label="Cerrar ayuda"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Descripción */}
            <p id="keyboard-help-description" className="text-xs text-muted-foreground mb-3">
              Navega entre secciones usando estos atajos:
            </p>

            {/* Atajos de teclado */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ChevronDown className="w-3 h-3" />
                  Siguiente sección
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+J</kbd>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ChevronUp className="w-3 h-3" />
                  Sección anterior
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  Primera sección
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Home</kbd>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  Última sección
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+End</kbd>
              </div>

              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span>Ir a sección específica</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt+1-9</kbd>
                </div>
              </div>
            </div>

            {/* Indicador de sección actual */}
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs text-muted-foreground mb-1">Sección actual:</div>
              <div className="text-sm font-medium">
                {currentSectionIndex + 1}. {sections[currentSectionIndex]?.label || 'Desconocida'}
              </div>
              
              {/* Indicador visual de progreso */}
              <div className="mt-2 flex gap-1">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded ${
                      index === currentSectionIndex 
                        ? 'bg-primary' 
                        : index < currentSectionIndex 
                          ? 'bg-primary/50' 
                          : 'bg-muted'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};