import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useStickyCTASwipe } from '@/hooks/useSwipeGestures';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

interface OptimizedStickyCTAProps {
  product: Product;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
  className?: string;
  showQuickActions?: boolean;
  enableSwipeGestures?: boolean;
}

export const OptimizedStickyCTA: React.FC<OptimizedStickyCTAProps> = ({
  product,
  onBuyNow,
  onAddToCart,
  onToggleFavorite,
  onShare,
  isFavorite = false,
  className,
  showQuickActions = true,
  enableSwipeGestures = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Calcular descuento
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Estado de stock
  const isLowStock = product.stock && product.stock <= 5;

  // Manejo de scroll para ocultar/mostrar CTA
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 100;

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        setIsVisible(!isScrollingDown || currentScrollY < 200);
        setLastScrollY(currentScrollY);
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY]);

  // Gestos de swipe
  const handleSwipeUp = useCallback(() => {
    if (enableSwipeGestures) {
      setIsExpanded(true);
    }
  }, [enableSwipeGestures]);

  const handleSwipeDown = useCallback(() => {
    if (enableSwipeGestures) {
      setIsExpanded(false);
    }
  }, [enableSwipeGestures]);

  const { swipeRef } = useStickyCTASwipe(handleSwipeUp, handleSwipeDown, {
    threshold: 30,
    preventDefaultTouchmove: false
  });

  // Manejo de pan gesture con Framer Motion
  const handlePan = (event: any, info: PanInfo) => {
    if (!enableSwipeGestures) return;

    const threshold = 50;
    if (info.offset.y < -threshold) {
      setIsExpanded(true);
    } else if (info.offset.y > threshold) {
      setIsExpanded(false);
    }
  };

  // Configurar ref para swipe
  useEffect(() => {
    if (ctaRef.current && enableSwipeGestures) {
      return swipeRef(ctaRef.current);
    }
  }, [swipeRef, enableSwipeGestures]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ctaRef}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 md:hidden",
            "bg-background/95 backdrop-blur-md border-t border-border",
            "safe-area-inset-bottom",
            className
          )}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onPan={handlePan}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
        >
          {/* Indicador de swipe */}
          {enableSwipeGestures && (
            <div className="flex justify-center py-1">
              <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
          )}

          {/* Contenido principal */}
          <div className="px-4 py-3">
            {/* Información básica del producto */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice!.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <Badge variant="destructive" className="text-xs">
                      -{discountPercent}%
                    </Badge>
                  )}
                  {isLowStock && (
                    <Badge variant="secondary" className="text-xs">
                      Solo {product.stock} disponibles
                    </Badge>
                  )}
                </div>
              </div>

              {/* Botón de expandir */}
              {showQuickActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="p-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {/* CTAs principales */}
            <div className="flex gap-3 mb-3">
              <Button
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
                onClick={onBuyNow}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {!product.inStock ? 'Sin Stock' : 'Comprar Ahora'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-4"
                onClick={onToggleFavorite}
              >
                <Heart className={cn(
                  'w-5 h-5',
                  isFavorite && 'fill-current text-red-500'
                )} />
              </Button>
            </div>

            {/* Acciones expandidas */}
            <AnimatePresence>
              {isExpanded && showQuickActions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border pt-3 space-y-3">
                    {/* Botón de agregar al carrito */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12"
                      onClick={onAddToCart}
                      disabled={!product.inStock}
                    >
                      Agregar al Carrito
                    </Button>

                    {/* Acciones secundarias */}
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={onShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir
                      </Button>
                      
                      {product.rating && (
                        <div className="flex items-center gap-1 px-3 py-2 bg-muted rounded-lg">
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Información adicional */}
                    <div className="text-xs text-muted-foreground text-center">
                      {enableSwipeGestures && "Desliza hacia arriba/abajo para expandir/contraer"}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Utility function para throttle
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default OptimizedStickyCTA;