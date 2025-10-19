import React, { useState, useCallback, useMemo } from 'react';
import { X, Plus, Minus, Check, AlertCircle, Star, Package, Truck, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutoOptimizedImage } from '@/components/ui/AutoOptimizedImage';
import { formatCurrency } from '@/lib/format';
import { Product } from '@/services/productSchema';
import { calculateDiscount } from '@/utils/productUtils';

interface ProductComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  maxProducts?: number;
}

interface ComparisonFeature {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'price' | 'rating';
  getValue: (product: Product) => any;
  isImportant?: boolean;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onAddToCart,
  maxProducts = 4
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'price',
    'rating',
    'brand',
    'category',
    'freeShipping',
    'officialStore'
  ]);

  // Definir características comparables
  const comparisonFeatures: ComparisonFeature[] = useMemo(() => [
    {
      key: 'price',
      label: 'Precio',
      type: 'price',
      getValue: (product) => product.price,
      isImportant: true
    },
    {
      key: 'originalPrice',
      label: 'Precio Original',
      type: 'price',
      getValue: (product) => product.originalPrice
    },
    {
      key: 'rating',
      label: 'Calificación',
      type: 'rating',
      getValue: (product) => product.rating,
      isImportant: true
    },
    {
      key: 'reviews',
      label: 'Reseñas',
      type: 'number',
      getValue: (product) => product.reviews
    },
    {
      key: 'brand',
      label: 'Marca',
      type: 'text',
      getValue: (product) => product.brand,
      isImportant: true
    },
    {
      key: 'category',
      label: 'Categoría',
      type: 'text',
      getValue: (product) => product.category
    },
    {
      key: 'freeShipping',
      label: 'Envío Gratis',
      type: 'boolean',
      getValue: (product) => product.freeShipping
    },
    {
      key: 'officialStore',
      label: 'Tienda Oficial',
      type: 'boolean',
      getValue: (product) => product.officialStore
    },
    {
      key: 'inStock',
      label: 'En Stock',
      type: 'boolean',
      getValue: (product) => product.inStock !== false
    }
  ], []);

  // Filtrar características seleccionadas
  const visibleFeatures = useMemo(() => 
    comparisonFeatures.filter(feature => selectedFeatures.includes(feature.key)),
    [comparisonFeatures, selectedFeatures]
  );

  // Encontrar el mejor valor para cada característica
  const getBestValue = useCallback((feature: ComparisonFeature) => {
    const values = products.map(product => feature.getValue(product)).filter(v => v != null);
    
    if (values.length === 0) return null;

    switch (feature.type) {
      case 'price':
        return Math.min(...values);
      case 'rating':
      case 'number':
        return Math.max(...values);
      case 'boolean':
        return true;
      default:
        return null;
    }
  }, [products]);

  // Verificar si un valor es el mejor
  const isBestValue = useCallback((product: Product, feature: ComparisonFeature) => {
    const value = feature.getValue(product);
    const bestValue = getBestValue(feature);
    
    if (value == null || bestValue == null) return false;
    
    return value === bestValue;
  }, [getBestValue]);

  // Renderizar valor de característica
  const renderFeatureValue = useCallback((product: Product, feature: ComparisonFeature) => {
    const value = feature.getValue(product);
    const isBest = isBestValue(product, feature);
    
    if (value == null) {
      return <span className="text-muted-foreground">-</span>;
    }

    const baseClasses = isBest && feature.isImportant ? 'font-semibold text-green-600' : '';

    switch (feature.type) {
      case 'price':
        return (
          <span className={baseClasses}>
            {formatCurrency(value)}
            {isBest && feature.isImportant && <Check className="w-4 h-4 inline ml-1" />}
          </span>
        );
      
      case 'rating':
        return (
          <div className={`flex items-center gap-1 ${baseClasses}`}>
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{value.toFixed(1)}</span>
            {isBest && feature.isImportant && <Check className="w-4 h-4 text-green-600 ml-1" />}
          </div>
        );
      
      case 'boolean':
        return value ? (
          <div className={`flex items-center gap-1 ${isBest ? 'text-green-600' : 'text-green-500'}`}>
            <Check className="w-4 h-4" />
            <span>Sí</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <X className="w-4 h-4" />
            <span>No</span>
          </div>
        );
      
      case 'number':
        return (
          <span className={baseClasses}>
            {value.toLocaleString()}
            {isBest && feature.isImportant && <Check className="w-4 h-4 inline ml-1" />}
          </span>
        );
      
      default:
        return <span className={baseClasses}>{String(value)}</span>;
    }
  }, [isBestValue]);

  // Toggle feature selection
  const toggleFeature = useCallback((featureKey: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureKey)
        ? prev.filter(key => key !== featureKey)
        : [...prev, featureKey]
    );
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Comparar Productos ({products.length}/{maxProducts})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Cerrar comparación"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-auto">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay productos para comparar</p>
            </div>
          ) : (
            <>
              {/* Feature Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Características a comparar:</h3>
                <div className="flex flex-wrap gap-2">
                  {comparisonFeatures.map(feature => (
                    <Button
                      key={feature.key}
                      variant={selectedFeatures.includes(feature.key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFeature(feature.key)}
                      className="text-xs"
                    >
                      {selectedFeatures.includes(feature.key) ? (
                        <Minus className="w-3 h-3 mr-1" />
                      ) : (
                        <Plus className="w-3 h-3 mr-1" />
                      )}
                      {feature.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b font-medium w-32">Característica</th>
                      {products.map(product => (
                        <th key={product.id} className="text-center p-2 border-b min-w-48">
                          <div className="space-y-2">
                            {/* Product Image */}
                            <div className="relative">
                              <AutoOptimizedImage
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded mx-auto"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0"
                                onClick={() => onRemoveProduct(product.id)}
                                aria-label={`Remover ${product.name} de la comparación`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Product Name */}
                            <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 justify-center">
                              {(() => {
                                const { hasDiscount, discountPct } = calculateDiscount(product);
                                return (
                                  <>
                                    {hasDiscount && (
                                      <Badge variant="destructive" className="text-xs">
                                        -{discountPct}%
                                      </Badge>
                                    )}
                                    {product.freeShipping && (
                                      <Badge className="bg-green-600 text-xs">
                                        <Truck className="w-3 h-3 mr-1" />
                                        Envío gratis
                                      </Badge>
                                    )}
                                    {product.officialStore && (
                                      <Badge className="bg-blue-600 text-xs">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Oficial
                                      </Badge>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                              size="sm"
                              onClick={() => onAddToCart(product)}
                              disabled={product.inStock === false}
                              className="w-full"
                            >
                              {product.inStock === false ? 'Sin stock' : 'Agregar al carrito'}
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleFeatures.map(feature => (
                      <tr key={feature.key} className="border-b">
                        <td className="p-2 font-medium text-sm">
                          {feature.label}
                          {feature.isImportant && (
                            <span className="text-orange-500 ml-1">*</span>
                          )}
                        </td>
                        {products.map(product => (
                          <td key={product.id} className="p-2 text-center text-sm">
                            {renderFeatureValue(product, feature)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-4 text-xs text-muted-foreground">
                <p>* Características importantes</p>
                <p className="flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3 text-green-600" />
                  Mejor valor en la comparación
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};