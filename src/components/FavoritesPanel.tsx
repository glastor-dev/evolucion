import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";

// Datos de productos (en una aplicación real, esto vendría de una API)
const products = [
  {
    id: 1,
    name: "Taladro Percutor 18V",
    brand: "Makita" as const,
    category: "Taladros",
    price: "$89.990",
    originalPrice: "$109.990",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 2,
    name: 'Sierra Circular 7-1/4"',
    brand: "Bosch" as const,
    category: "Sierras",
    price: "$129.990",
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 3,
    name: 'Amoladora Angular 4-1/2"',
    brand: "Makita" as const,
    category: "Amoladoras",
    price: "$69.990",
    originalPrice: "$79.990",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "Martillo Demoledor SDS-Plus",
    brand: "Bosch" as const,
    category: "Martillos",
    price: "$199.990",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 5,
    name: "Lijadora Orbital 1/4 Hoja",
    brand: "Makita" as const,
    category: "Lijadoras",
    price: "$49.990",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=300&fit=crop&crop=center",
  },
];

export const FavoritesPanel: React.FC = () => {
  const { state, removeFavorite, closePanel } = useFavorites();
  const { addItem, openCart } = useCart();

  // Obtener productos favoritos
  const favoriteProducts = products.filter((product) =>
    state.items.some((item) => item.id === product.id)
  );

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
    });
    openCart();
  };

  const handleRemoveFromFavorites = (productId: number) => {
    removeFavorite(productId);
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={closePanel}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold dark:text-gray-100">Mis Favoritos</h2>
              {state.items.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {state.items.length}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={closePanel} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {favoriteProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No tienes favoritos aún</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Agrega productos a tus favoritos para verlos aquí
                </p>
                <Button onClick={closePanel} variant="outline">
                  Explorar productos
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToCart(product)}
                            className="h-8 px-2"
                          >
                            <ShoppingCart className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFromFavorites(product.id)}
                            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {favoriteProducts.length > 0 && (
            <div className="border-t dark:border-gray-800 p-4 space-y-3">
              <Button
                className="w-full"
                onClick={() => {
                  favoriteProducts.forEach((product) => handleAddToCart(product));
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar todos al carrito
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
