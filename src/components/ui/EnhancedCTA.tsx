import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Zap, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface EnhancedCTAProps {
  product: Product;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  className?: string;
  variant?: 'default' | 'urgent' | 'premium';
}

/**
 * CTA mejorado con técnicas de conversión:
 * - Urgencia visual
 * - Social proof
 * - Jerarquía visual clara
 * - Micro-copy persuasivo
 */
export const EnhancedCTA: React.FC<EnhancedCTAProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  isFavorite,
  className,
  variant = 'default'
}) => {
  // Calcular descuento
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Determinar urgencia
  const isLowStock = product.stock !== undefined && product.stock <= 5 && product.stock > 0;
  const isPopular = product.reviews && product.reviews > 50;

  const variantStyles = {
    default: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    urgent: {
      primary: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg',
      secondary: 'bg-orange-600 hover:bg-orange-700 text-white'
    },
    premium: {
      primary: 'bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white shadow-xl',
      secondary: 'bg-slate-800 hover:bg-slate-900 text-white'
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Urgency/Social Proof Badges */}
      <div className="flex flex-wrap gap-2">
        {hasDiscount && (
          <Badge variant="destructive" className="animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            -{discountPercent}% DESCUENTO
          </Badge>
        )}
        
        {isLowStock && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Solo {product.stock} disponibles
          </Badge>
        )}
        
        {isPopular && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-3 h-3 mr-1" />
            Popular ({product.reviews}+ reviews)
          </Badge>
        )}
      </div>

      {/* Precio con mejoras visuales */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-lg text-muted-foreground line-through">
              ${product.originalPrice!.toLocaleString()}
            </span>
          )}
        </div>
        {hasDiscount && (
          <p className="text-sm text-green-600 font-medium">
            Ahorras ${(product.originalPrice! - product.price).toLocaleString()}
          </p>
        )}
      </div>

      {/* CTAs principales */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className={cn(
            'flex-1',
            variantStyles[variant].primary,
            variant === 'urgent' && 'animate-pulse',
            !product.inStock && 'opacity-50 cursor-not-allowed'
          )}
          onClick={onBuyNow}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {!product.inStock 
            ? 'Sin Stock' 
            : variant === 'urgent' 
              ? '⚡ Comprar Ahora' 
              : 'Comprar Ahora'
          }
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className={cn(
            'sm:flex-none',
            variantStyles[variant].secondary
          )}
          onClick={onAddToCart}
          disabled={!product.inStock}
        >
          Agregar al Carrito
        </Button>
        
        <Button
          size="lg"
          variant="ghost"
          onClick={onToggleFavorite}
          className="sm:flex-none"
        >
          <Heart className={cn('w-5 h-5', isFavorite && 'fill-current text-red-500')} />
        </Button>
      </div>

      {/* Urgencia temporal (si aplica) */}
      {variant === 'urgent' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium text-center">
            🔥 Oferta limitada - ¡No te quedes sin el tuyo!
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedCTA;