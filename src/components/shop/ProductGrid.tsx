import React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "../ui/skeletons";
import { Product } from "@/services/productSchema";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  searchQuery?: string;
  viewMode?: "grid" | "list";
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  searchQuery = "",
  viewMode = "grid"
}) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-slate-200 mb-4">
          No se encontraron productos
        </h3>
        <p className="text-slate-400">
          Intenta ajustar los filtros o busca con otros términos
        </p>
      </div>
    );
  }

  const gridClassName = viewMode === "grid" 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    : "grid grid-cols-1 gap-6";

  return (
    <motion.div
      layout
      className={gridClassName}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          image={product.image}
          imageGallery={product.imageGallery}
          rating={product.rating}
          reviews={product.reviews}
          inStock={product.inStock}
          stockQuantity={product.stockQuantity}
          brand={product.brand}
          isFavorite={isFavorite(product.id)}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          searchQuery={searchQuery}
          viewMode={viewMode}
        />
      ))}
    </motion.div>
  );
};

export default ProductGrid;
