import React, { useState } from 'react';
import { useCart } from "../contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { formatCurrency } from '@/lib/format';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const { addItem } = useCart();
  const [loadingProducts, setLoadingProducts] = useState<{ [key: string]: boolean }>({});

  const handleAddToCart = async (product: Product) => {
    console.log('ProductCatalog - handleAddToCart:', product);
    
    if (!product.id || !product.name) {
      console.error('Producto inválido:', product);
      toast.error('Error: Producto inválido');
      return;
    }

    try {
      setLoadingProducts(prev => ({ ...prev, [product.id]: true }));

      const result = await addItem(product);

      if (result.success) {
        toast.success(result.message || 'Producto agregado al carrito');
      } else if (result.message) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al agregar al carrito';
      toast.error(errorMessage);
    } finally {
      setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-2xl font-bold mb-2">{formatCurrency(product.price)}</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleAddToCart(product)}
              disabled={loadingProducts[product.id]}
            >
              {loadingProducts[product.id] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                'Agregar al carrito'
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductCatalog;
