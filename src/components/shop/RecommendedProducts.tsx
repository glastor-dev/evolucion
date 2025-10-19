import { useEffect, useState } from "react";
import { getAllProducts } from "@/services/localProducts";
import { getRecommendedProducts } from "@/utils/productUtils";
import { Product } from "@/services/productSchema";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface Props {
  currentProduct: Product;
}

export default function RecommendedProducts({ currentProduct }: Props) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.error || !response.products) {
          console.error('Error al cargar productos recomendados:', response.error);
          return;
        }
        // Siempre solicitamos exactamente 5 productos
        const recommended = getRecommendedProducts(response.products, currentProduct, 5);
        setRecommendedProducts(recommended);
      } catch (error) {
        console.error('Error al cargar productos recomendados:', error);
      }
    };

    loadRecommendedProducts();
  }, [currentProduct]);

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-slate-100 md:text-4xl">
          Productos Recomendados
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {recommendedProducts.map((product) => (
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}