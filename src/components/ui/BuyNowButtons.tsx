import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BuyNowButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  className?: string;
  disabled?: boolean;
  inStock?: boolean;
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

/**
 * Botones duales: "Agregar al Carrito" vs "Comprar Ahora"
 * 
 * Diferencias:
 * - "Agregar al Carrito": Añade el producto y mantiene al usuario navegando
 * - "Comprar Ahora": Añade el producto y redirige directamente al checkout
 */
export const BuyNowButtons: React.FC<BuyNowButtonsProps> = ({
  onAddToCart,
  onBuyNow,
  className,
  disabled = false,
  inStock = true,
  variant = 'horizontal',
  showLabels = true,
}) => {
  if (!inStock) {
    return (
      <Button disabled className={cn('w-full', className)}>
        Sin stock
      </Button>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {/* Comprar Ahora - Acción principal */}
        <Button
          onClick={onBuyNow}
          disabled={disabled}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all group"
        >
          <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          {showLabels && 'Comprar Ahora'}
        </Button>

        {/* Agregar al Carrito - Acción secundaria */}
        <Button
          onClick={onAddToCart}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {showLabels && 'Agregar al Carrito'}
        </Button>
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={cn('flex gap-2', className)}>
      {/* Agregar al Carrito */}
      <Button
        onClick={onAddToCart}
        disabled={disabled}
        variant="outline"
        size="lg"
        className="flex-1"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {showLabels && <span className="hidden sm:inline">Agregar</span>}
      </Button>

      {/* Comprar Ahora */}
      <Button
        onClick={onBuyNow}
        disabled={disabled}
        size="lg"
        className="flex-[2] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all group"
      >
        <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        {showLabels && 'Comprar Ahora'}
      </Button>
    </div>
  );
};

// Variante compacta para ProductCard
export const BuyNowButtonCompact: React.FC<{
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
}> = ({ onAddToCart, onBuyNow, disabled = false }) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onAddToCart}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <ShoppingCart className="w-4 h-4" />
      </Button>
      <Button
        onClick={onBuyNow}
        disabled={disabled}
        size="sm"
        className="flex-[2] bg-primary hover:bg-primary/90"
      >
        <Zap className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Comprar</span>
      </Button>
    </div>
  );
};
