import React, { useState } from 'react';
import { HeartIcon, ShoppingCartIcon, TrendingUpIcon } from './SvgIcons';

// Interfaces
interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  shipping: {
    free: boolean;
    fast: boolean;
  };
  badge?: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: ProductData;
  onAddToCart?: (product: ProductData) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  variant?: 'minimal' | 'modern';
}

// Componente Card Minimalista
export const ProductCardMinimal: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badge de descuento */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* Botón de favorito */}
        <button
          onClick={() => onToggleFavorite?.(product.id)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <HeartIcon className="h-4 w-4" />
        </button>

        {/* Botón de agregar al carrito (aparece en hover) */}
        <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={() => onAddToCart?.(product)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        {product.shipping.free && (
          <div className="mt-2">
            <span className="text-xs text-green-600 font-medium">Envío gratis</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Card Moderna (estilo MercadoLibre)
export const ProductCardModern: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges superiores */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          {product.badge && (
            <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {product.badge}
            </div>
          )}
          {product.shipping.fast && (
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <TrendingUpIcon className="h-3 w-3" />
              FULL
            </div>
          )}
        </div>

        {/* Botón de favorito */}
        <button
          onClick={() => onToggleFavorite?.(product.id)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
          }`}
        >
          <HeartIcon className="h-4 w-4" />
        </button>

        {/* Overlay con botones de acción */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={() => onAddToCart?.(product)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Agregar al carrito
            </button>
            <button className="bg-white hover:bg-gray-50 text-blue-600 text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200">
              Ver más
            </button>
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Envío gratis */}
        {product.shipping.free && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-green-600 font-semibold">Envío gratis</span>
            {product.shipping.fast && (
              <span className="text-xs text-blue-600 font-semibold">• Llega mañana</span>
            )}
          </div>
        )}

        {/* Nombre del producto */}
        <h3 className="text-sm font-normal text-gray-800 line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Precios */}
        <div className="mb-2">
          {product.originalPrice && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs text-orange-600 font-semibold">
                {discountPercentage}% OFF
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-light text-gray-900">
              {formatPrice(product.price).split(',')[0]}
            </span>
            <span className="text-lg font-light text-gray-900">
              {formatPrice(product.price).includes(',') ? ',' + formatPrice(product.price).split(',')[1] : ''}
            </span>
          </div>
        </div>

        {/* Rating y reviews */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? 'text-orange-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Vendedor */}
        <div className="text-xs text-gray-500 mb-2">
          por <span className="text-blue-600 hover:underline cursor-pointer">{product.seller}</span>
        </div>

        {/* Stock */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="text-xs text-orange-600 font-medium">
            ¡Últimas {product.stock} disponibles!
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="text-xs text-red-600 font-medium">
            Sin stock
          </div>
        )}
      </div>
    </div>
  );
};

// Datos de ejemplo para mostrar las cards
const sampleProducts: ProductData[] = [
  {
    id: '1',
    name: 'Taladro Inalámbrico Bosch Professional 18V con 2 Baterías y Maletín',
    price: 159.99,
    originalPrice: 199.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 1247,
    seller: 'Bosch Store Oficial',
    shipping: { free: true, fast: true },
    badge: 'MÁS VENDIDO',
    category: 'Herramientas',
    stock: 5
  },
  {
    id: '2',
    name: 'Sierra Circular Makita 1400W con Disco de Corte Incluido',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop',
    rating: 4.3,
    reviews: 856,
    seller: 'Makita Oficial',
    shipping: { free: true, fast: false },
    category: 'Herramientas',
    stock: 12
  },
  {
    id: '3',
    name: 'Martillo Demoledor Profesional 1500W con Accesorios',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 432,
    seller: 'Herramientas Pro',
    shipping: { free: false, fast: false },
    badge: 'NUEVO',
    category: 'Herramientas',
    stock: 0
  },
  {
    id: '4',
    name: 'Kit de Destornilladores Precision 32 Piezas con Estuche Magnético',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 2156,
    seller: 'ToolMaster',
    shipping: { free: true, fast: true },
    category: 'Herramientas',
    stock: 25
  }
];

// Componente Showcase para mostrar ambas variantes
export const ProductCardsShowcase: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: ProductData) => {
    console.log('Producto agregado al carrito:', product);
    // Aquí integrarías con tu contexto de carrito
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Componentes de Cards de Productos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cards reutilizables con diseño minimalista y moderno, inspiradas en las mejores prácticas de e-commerce
          </p>
        </div>

        {/* Card Minimalista */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Diseño Minimalista
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product) => (
              <ProductCardMinimal
                key={`minimal-${product.id}`}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        </div>

        {/* Card Moderna */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Diseño Moderno (Estilo MercadoLibre)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product) => (
              <ProductCardModern
                key={`modern-${product.id}`}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        </div>

        {/* Información de uso */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Cómo usar estos componentes
          </h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">ProductCardMinimal</h5>
              <ul className="space-y-1">
                <li>• Diseño limpio y minimalista</li>
                <li>• Ideal para catálogos simples</li>
                <li>• Botones aparecen en hover</li>
                <li>• Enfoque en la imagen del producto</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">ProductCardModern</h5>
              <ul className="space-y-1">
                <li>• Diseño completo estilo marketplace</li>
                <li>• Información detallada del vendedor</li>
                <li>• Badges de promoción y envío</li>
                <li>• Indicadores de stock y urgencia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};