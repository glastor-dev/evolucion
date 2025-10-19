import React, { memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { ProductImage } from "@/services/productSchema";

// Tipos más específicos
type StockStatus = 'in-stock' | 'out-of-stock' | 'low-stock';
type PriceDisplayMode = 'sale' | 'regular' | 'free';
type ViewMode = 'grid' | 'list';

export interface ProductCardProps {
  id: string;
  name: string;
  image?: string;
  imageGallery?: (string | ProductImage)[];
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  isFavorite?: boolean;
  searchQuery?: string;
  className?: string;
  stockQuantity?: number;
  brand?: string;
  viewMode?: ViewMode;
  onAddToCart?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpen?: (id: string) => void;
}

// Utilidades para determinar el estado del stock
const getStockStatus = (inStock: boolean, quantity?: number): StockStatus => {
  if (!inStock) return 'out-of-stock';
  if (quantity !== undefined && quantity <= 5) return 'low-stock';
  return 'in-stock';
};

// Utilidades para determinar el modo de visualización del precio
const getPriceDisplayMode = (price: number, originalPrice?: number): PriceDisplayMode => {
  if (price === 0) return 'free';
  if (originalPrice && originalPrice > price) return 'sale';
  return 'regular';
};

// Configuración de badges según el estado
interface BadgeConfig {
  text: string;
  className: string;
  ariaLabel: string;
}

const getDiscountBadge = (price: number, originalPrice?: number): BadgeConfig | null => {
  if (!originalPrice || originalPrice <= price) return null;
  
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  
  return {
    text: `${discountPercentage}% OFF`,
    className: 'bg-red-500 text-white',
    ariaLabel: `${discountPercentage}% de descuento`
  };
};

const getStockBadge = (inStock: boolean, quantity?: number): BadgeConfig => {
  const status = getStockStatus(inStock, quantity);
  
  switch (status) {
    case 'out-of-stock':
      return {
        text: 'Agotado',
        className: 'bg-red-500 text-white',
        ariaLabel: 'Producto agotado'
      };
    case 'low-stock':
      return {
        text: '¡Últimas unidades!',
        className: 'bg-yellow-500 text-black',
        ariaLabel: 'Pocas unidades disponibles'
      };
    default:
      return {
        text: 'En Stock',
        className: 'bg-emerald-500 text-black',
        ariaLabel: 'Producto en stock'
      };
  }
};

// Componente para el rating
interface RatingProps {
  rating: number;
  reviews?: number;
}

const Rating = memo<RatingProps>(({ rating, reviews }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
    {reviews !== undefined && reviews > 0 && (
      <span className="text-sm text-slate-400">
        ({reviews.toLocaleString()} reseñas)
      </span>
    )}
  </div>
));

Rating.displayName = 'Rating';

// Componente para badges de estado
interface StatusBadgeProps extends BadgeConfig {
  position: 'top-left' | 'top-right';
}

const StatusBadge = memo<StatusBadgeProps>(({ text, className, ariaLabel, position }) => {
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3'
  };

  return (
    <span 
      className={`absolute ${positionClasses[position]} text-xs font-semibold px-2 py-1 rounded shadow-sm ${className}`}
      aria-label={ariaLabel}
      role="status"
    >
      {text}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const ProductCard = memo<ProductCardProps>(({
  id,
  name,
  image,
  imageGallery,
  price,
  originalPrice,
  rating = 4.7,
  reviews = 0,
  inStock = true,
  isFavorite = false,
  searchQuery,
  className = "",
  stockQuantity,
  brand,
  viewMode = "grid",
  onAddToCart,
  onToggleFavorite,
  onOpen,
}) => {
  const navigate = useNavigate();
  
  // Valores memoizados para optimizar rendimiento
  const discountBadge = useMemo(() => getDiscountBadge(price, originalPrice), [price, originalPrice]);
  const stockBadge = useMemo(() => getStockBadge(inStock, stockQuantity), [inStock, stockQuantity]);
  
  // Función optimizada para resaltar términos de búsqueda
  const highlightSearchTerms = useMemo(() => {
    if (!searchQuery || !name) return name;

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = name.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-900">{part}</span>
      ) : (
        part
      )
    );
  }, [name, searchQuery]);

  // Obtener la imagen principal del producto
  const mainImage = useMemo(() => {
    if (image) return image;
    if (!imageGallery?.length) return '/placeholder-product.svg';
    
    const firstImage = imageGallery[0];
    if (typeof firstImage === 'string') return firstImage;
    return firstImage.url;
  }, [image, imageGallery]);

  // Obtener el texto alternativo de la imagen
  const imageAlt = useMemo(() => {
    if (!imageGallery?.length) return name;
    
    const firstImage = imageGallery[0];
    if (typeof firstImage === 'string') return name;
    return firstImage.alt || name;
  }, [imageGallery, name]);

  // Handlers optimizados
  const handleClick = useCallback(() => {
    navigate(`/tienda/${id}`);
    onOpen?.(id);
  }, [id, navigate, onOpen]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && inStock) {
      onAddToCart(id);
    }
  }, [id, inStock, onAddToCart]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  }, [id, onToggleFavorite]);

  // Clases base según el modo de vista
  const containerClasses = viewMode === "grid"
    ? "group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
    : "group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl flex";

  const imageContainerClasses = viewMode === "grid"
    ? "relative aspect-square overflow-hidden"
    : "relative w-48 overflow-hidden";

  const contentClasses = viewMode === "grid"
    ? "p-4 space-y-4"
    : "flex-1 p-4 flex flex-col justify-between";

  return (
    <motion.div
      layout
      onClick={handleClick}
      className={`${containerClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      role="article"
      aria-label={`${name} - ${formatCurrency(price)}`}
    >
      {/* Imagen del producto */}
      <div className={imageContainerClasses}>
        <img
          src={mainImage}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges de estado */}
        {discountBadge && (
          <StatusBadge {...discountBadge} position="top-left" />
        )}
        <StatusBadge {...stockBadge} position="top-right" />
        
        {/* Botón de favorito */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-black/50 text-white hover:bg-red-500"
          }`}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Contenido del producto */}
      <div className={contentClasses}>
        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">
          {highlightSearchTerms}
        </h3>

        {/* Rating y reseñas */}
        <Rating rating={rating} reviews={reviews} />

        {/* Precio y botón de carrito */}
        <div className="flex items-end justify-between gap-4" id={`product-price-${id}`}>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-emerald-400">
              {formatCurrency(price)}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-sm text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </div>
            )}
          </div>

          {/* Botón de agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`p-2 rounded-full transition-all duration-200 ${
              inStock
                ? "bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-110"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
            aria-label={inStock ? `Agregar ${name} al carrito` : `${name} agotado`}
          >
            {inStock ? (
              <ShoppingCart className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export { ProductCard };
export type { ProductCardProps };
