import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/format';

/**
 * Banner flotante que aparece cuando el usuario tiene items en el carrito
 * pero no lo ha abierto en un tiempo
 */
export const AbandonedCartBanner: React.FC = () => {
  const { state, openCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const items = state?.items || [];
  const total = state?.total || 0;

  useEffect(() => {
    // No mostrar si el carrito está vacío o ya fue descartado
    if (items.length === 0 || isDismissed) {
      setIsVisible(false);
      return;
    }

    // Verificar si ya se mostró en esta sesión
    const shownInSession = sessionStorage.getItem('abandoned_cart_shown');
    if (shownInSession) {
      return;
    }

    // Mostrar banner después de 30 segundos de inactividad
    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('abandoned_cart_shown', 'true');
    }, 30000); // 30 segundos

    return () => clearTimeout(timer);
  }, [items.length, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleOpenCart = () => {
    setIsVisible(false);
    openCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg shadow-2xl p-4 pr-12">
            {/* Botón de cerrar */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Contenido */}
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  ¡Tienes productos en tu carrito!
                </h3>
                <p className="text-sm text-primary-foreground/90 mb-3">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'} • {formatCurrency(total)}
                </p>
                
                <Button
                  onClick={handleOpenCart}
                  variant="secondary"
                  size="sm"
                  className="w-full group"
                >
                  Ver mi carrito
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Indicador de items */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-xs text-primary-foreground/80">
                <div className="flex -space-x-2">
                  {items.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="w-8 h-8 rounded-full border-2 border-primary bg-white overflow-hidden"
                      style={{ zIndex: 3 - idx }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-white/20 flex items-center justify-center text-xs font-semibold">
                      +{items.length - 3}
                    </div>
                  )}
                </div>
                <span>Guardado por 7 días</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
