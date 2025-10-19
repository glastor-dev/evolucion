import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Clock,
  Eye,
  Flame,
  Globe,
  Heart,
  Package,
  Play,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
// import "./product-cards-cinema.css"; // Comentado para evitar errores

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
  variant?: "cinema" | "premium" | "minimal";
}

// Componente Card Cinematográfico Principal
export const ProductCardCinema: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="product-card-cinema group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Fondo con efectos cinematográficos */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 rounded-2xl" />

      {/* Partículas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#4FC08D] rounded-full opacity-40"
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + i * 8}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-6">
        {/* Header con badges */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            {discountPercentage > 0 && (
              <motion.div
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Flame className="w-3 h-3" />-{discountPercentage}% OFF
              </motion.div>
            )}
            {product.badge && (
              <motion.div
                className="bg-gradient-to-r from-[#42B883] to-[#4FC08D] text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Award className="w-3 h-3" />
                {product.badge}
              </motion.div>
            )}
            {product.shipping.fast && (
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Zap className="w-3 h-3" />
                ENVÍO RÁPIDO
              </motion.div>
            )}
          </div>

          {/* Botón de favorito cinematográfico */}
          <motion.button
            onClick={() => onToggleFavorite?.(product.id)}
            className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
              isFavorite
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
        </div>

        {/* Imagen del producto con efectos */}
        <div className="relative mb-6 rounded-xl overflow-hidden bg-slate-800/50 border border-slate-600/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay con efectos */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <motion.button
                onClick={() => onAddToCart?.(product)}
                className="flex-1 bg-gradient-to-r from-[#42B883] to-[#4FC08D] text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Agregar
              </motion.button>

              <motion.button
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ y: 20, opacity: 0 }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-4">
          {/* Título */}
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 group-hover:text-[#4FC08D] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating y reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-400 text-sm">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Precio */}
          <div className="space-y-2">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 line-through text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-orange-400 font-semibold text-sm">
                  Ahorras {formatPrice(product.originalPrice - product.price)}
                </span>
              </div>
            )}
            <div className="text-2xl font-bold text-white">{formatPrice(product.price)}</div>
          </div>

          {/* Información adicional */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.shipping.free && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Envío gratis</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Package className="w-4 h-4" />
              <span>Stock: {product.stock}</span>
            </div>
          </div>

          {/* Vendedor */}
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Shield className="w-4 h-4 text-[#4FC08D]" />
            <span>
              por <span className="text-[#4FC08D] font-medium">{product.seller}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out`}
      />
    </motion.div>
  );
};

// Componente Card Premium con efectos avanzados
export const ProductCardPremium: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="product-card-premium group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10, rotateY: 5 }}
    >
      {/* Fondo glassmorphismo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/20" />

      {/* Grid pattern de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(79, 192, 141, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(79, 192, 141, 0.3) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-6">
        {/* Header con badges y favorito */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            {discountPercentage > 0 && (
              <motion.div
                className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <Sparkles className="w-3 h-3" />
                MEGA OFERTA -{discountPercentage}%
              </motion.div>
            )}

            {product.badge && (
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Award className="w-3 h-3" />
                {product.badge}
              </motion.div>
            )}
          </div>

          <motion.button
            onClick={() => onToggleFavorite?.(product.id)}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorite
                ? "bg-red-500/30 border-2 border-red-400 text-red-300"
                : "bg-white/20 border-2 border-white/30 text-white hover:bg-red-500/20 hover:border-red-400"
            }`}
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.8 }}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
        </div>

        {/* Imagen con efectos 3D */}
        <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
          <div className="relative transform-gpu perspective-1000">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            />

            {/* Overlay con efectos de luces */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div
              className={`absolute inset-0 bg-gradient-to-br from-[#4FC08D]/20 via-transparent to-[#42B883]/20 transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Partículas flotantes */}
            {isHovered &&
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#4FC08D] rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -30],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
          </div>

          {/* Botones de acción premium */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 flex gap-3"
            initial={{ y: 50, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.button
              onClick={() => onAddToCart?.(product)}
              className="flex-1 bg-gradient-to-r from-[#42B883] via-[#4FC08D] to-[#42B883] text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(79, 192, 141, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5" />
              Comprar Ahora
            </motion.button>

            <motion.button
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Información del producto con efectos */}
        <div className="space-y-4 text-white">
          <motion.h3
            className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-[#4FC08D] transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {product.name}
          </motion.h3>

          {/* Rating con animación */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-500"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-slate-300 font-medium">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Precio con efectos */}
          <div className="space-y-2">
            {product.originalPrice && (
              <div className="flex items-center gap-3">
                <span className="text-slate-400 line-through text-lg">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                  ¡Ahorras {formatPrice(product.originalPrice - product.price)}!
                </span>
              </div>
            )}
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-[#4FC08D] to-[#42B883] bg-clip-text text-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.6 }}
            >
              {formatPrice(product.price)}
            </motion.div>
          </div>

          {/* Features premium */}
          <div className="grid grid-cols-2 gap-3">
            {product.shipping.free && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/20 rounded-lg p-2">
                <Truck className="w-4 h-4" />
                <span>Envío Gratis</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-500/20 rounded-lg p-2">
              <Shield className="w-4 h-4" />
              <span>Garantía</span>
            </div>

            <div className="flex items-center gap-2 text-purple-400 text-sm bg-purple-500/20 rounded-lg p-2">
              <Clock className="w-4 h-4" />
              <span>24h Delivery</span>
            </div>

            <div className="flex items-center gap-2 text-[#4FC08D] text-sm bg-[#4FC08D]/20 rounded-lg p-2">
              <Users className="w-4 h-4" />
              <span>Top Seller</span>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de luz en movimiento */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ transform: "rotate(-45deg) translateX(-100%)" }}
        animate={isHovered ? { translateX: "300%" } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

// Datos cinematográficos de ejemplo
const sampleProducts: ProductData[] = [
  {
    id: "1",
    name: "Taladro Inalámbrico Bosch Professional 18V Quantum Series",
    price: 159.99,
    originalPrice: 199.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 1247,
    seller: "Glastor Tech",
    shipping: { free: true, fast: true },
    badge: "BESTSELLER",
    category: "Herramientas Eléctricas",
    stock: 5,
  },
  {
    id: "2",
    name: "Sierra Circular Makita Pro-X 1400W Edición Limitada",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 856,
    seller: "Glastor Premium",
    shipping: { free: true, fast: true },
    badge: "LIMITED EDITION",
    category: "Herramientas Profesionales",
    stock: 12,
  },
  {
    id: "3",
    name: "Martillo Demoledor Ultra Power 2000W con IA Integrada",
    price: 399.99,
    originalPrice: 499.99,
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 432,
    seller: "Glastor Innovation",
    shipping: { free: true, fast: true },
    badge: "AI POWERED",
    category: "Herramientas Inteligentes",
    stock: 8,
  },
  {
    id: "4",
    name: "Kit Destornilladores Precision 64 Piezas Titanium Edition",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=400&fit=crop",
    rating: 5.0,
    reviews: 2156,
    seller: "Glastor Elite",
    shipping: { free: true, fast: true },
    badge: "PREMIUM",
    category: "Kits Profesionales",
    stock: 25,
  },
  {
    id: "5",
    name: "Amoladora Angular Quantum 2500W con Control Neural",
    price: 299.99,
    originalPrice: 379.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 1834,
    seller: "Glastor Future",
    shipping: { free: true, fast: true },
    badge: "NEURAL TECH",
    category: "Herramientas del Futuro",
    stock: 15,
  },
  {
    id: "6",
    name: "Lijadora Orbital Holográfica con Realidad Aumentada",
    price: 449.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 967,
    seller: "Glastor AR",
    shipping: { free: true, fast: true },
    badge: "AR ENHANCED",
    category: "Herramientas Holográficas",
    stock: 3,
  },
];

// Showcase Cinematográfico para demostrar las cards
