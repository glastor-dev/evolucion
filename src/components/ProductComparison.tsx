import React, { useState } from 'react';
import { X, Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AutoOptimizedImage } from '@/components/ui/AutoOptimizedImage';
import { useProductComparison } from '@/hooks/useProductComparison';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/format';

export const ProductComparison: React.FC = () => {
  const { 
    comparisonProducts, 
    removeFromComparison, 
    clearComparison, 
    isComparisonOpen, 
    toggleComparison 
  } = useProductComparison();
  
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  if (!isComparisonOpen || comparisonProducts.length === 0) {
    return null;
  }

  // Obtener todas las características únicas
  const allFeatures = Array.from(
    new Set(
      comparisonProducts.flatMap(product => 
        Object.keys(product.features || {})
      )
    )
  );

  // Filtrar características seleccionadas
  const displayFeatures = selectedFeatures.length > 0 
    ? selectedFeatures 
    : allFeatures.slice(0, 5); // Mostrar solo las primeras 5 por defecto

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const getBestValue = (feature: string) => {
    const values = comparisonProducts.map(product => {
      const value = product.features?.[feature];
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && !isNaN(Number(value))) return Number(value);
      return 0;
    });
    
    const maxValue = Math.max(...values);
    return maxValue;
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1
    });
    
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
      variant: "success"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Comparar Productos ({comparisonProducts.length})
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparison}
            >
              Limpiar todo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComparison}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-auto max-h-[calc(90vh-120px)]">
            {/* Selector de características */}
            <div className="p-4 border-b bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Características a comparar:</h3>
              <div className="flex flex-wrap gap-2">
                {allFeatures.map(feature => (
                  <Button
                    key={feature}
                    variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature(feature)}
                    className="text-xs"
                  >
                    {selectedFeatures.includes(feature) ? (
                      <Minus className="w-3 h-3 mr-1" />
                    ) : (
                      <Plus className="w-3 h-3 mr-1" />
                    )}
                    {feature}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tabla de comparación */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 w-48">Producto</th>
                    {comparisonProducts.map(product => (
                      <th key={product.id} className="text-center p-4 min-w-[200px]">
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <AutoOptimizedImage
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded mx-auto"
                          />
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {product.rating || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Precio */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Precio</td>
                    {comparisonProducts.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="space-y-1">
                          <div className="text-lg font-semibold">
                            {formatCurrency(product.price)}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Disponibilidad */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Disponibilidad</td>
                    {comparisonProducts.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <Badge 
                          variant={product.inStock !== false ? "success" : "destructive"}
                        >
                          {product.inStock !== false ? "En stock" : "Agotado"}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Características seleccionadas */}
                  {displayFeatures.map(feature => {
                    const bestValue = getBestValue(feature);
                    return (
                      <tr key={feature} className="border-b">
                        <td className="p-4 font-medium capitalize">{feature}</td>
                        {comparisonProducts.map(product => {
                          const value = product.features?.[feature];
                          const isBest = typeof value === 'number' && value === bestValue && bestValue > 0;
                          
                          return (
                            <td key={product.id} className="p-4 text-center">
                              <span className={isBest ? "font-semibold text-green-600" : ""}>
                                {value || 'N/A'}
                              </span>
                              {isBest && (
                                <Badge variant="success" className="ml-1 text-xs">
                                  Mejor
                                </Badge>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Acciones */}
                  <tr>
                    <td className="p-4 font-medium">Acciones</td>
                    {comparisonProducts.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.inStock === false}
                          className="w-full"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Agregar
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};