import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

interface MobileFiltersDrawerProps {
  priceMin?: number | null;
  priceMax?: number | null;
  inStock?: boolean;
  categories?: string[];
  brands?: string[];
  selectedCategories?: string[];
  selectedBrands?: string[];
  categoryCounts?: Record<string, number>;
  brandCounts?: Record<string, number>;
  onChange: (next: { 
    priceMin?: number | null; 
    priceMax?: number | null; 
    inStock?: boolean;
    categories?: string[];
    brands?: string[];
  }) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MobileFiltersDrawer: React.FC<MobileFiltersDrawerProps> = ({ 
  priceMin, 
  priceMax, 
  inStock = false, 
  categories = [], 
  brands = [], 
  selectedCategories = [], 
  selectedBrands = [],
  categoryCounts = {},
  brandCounts = {},
  onChange,
  isOpen,
  onOpenChange 
}) => {
  const [min, setMin] = React.useState<string>(priceMin != null ? String(priceMin) : "");
  const [max, setMax] = React.useState<string>(priceMax != null ? String(priceMax) : "");
  const [stock, setStock] = React.useState<boolean>(!!inStock);
  const [selectedCats, setSelectedCats] = React.useState<string[]>(selectedCategories);
  const [selectedBrds, setSelectedBrands] = React.useState<string[]>(selectedBrands);

  React.useEffect(() => {
    setMin(priceMin != null ? String(priceMin) : "");
  }, [priceMin]);
  
  React.useEffect(() => {
    setMax(priceMax != null ? String(priceMax) : "");
  }, [priceMax]);
  
  React.useEffect(() => {
    setStock(!!inStock);
  }, [inStock]);
  
  React.useEffect(() => {
    setSelectedCats(selectedCategories);
  }, [selectedCategories]);
  
  React.useEffect(() => {
    setSelectedBrands(selectedBrands);
  }, [selectedBrands]);

  const apply = () => {
    const nextMin = min.trim() === "" ? null : Math.max(0, Number(min));
    const nextMax = max.trim() === "" ? null : Math.max(0, Number(max));
    onChange({ 
      priceMin: isNaN(nextMin as number) ? null : nextMin, 
      priceMax: isNaN(nextMax as number) ? null : nextMax, 
      inStock: stock,
      categories: selectedCats,
      brands: selectedBrds
    });
    if (onOpenChange) onOpenChange(false);
  };

  const clear = () => {
    setMin("");
    setMax("");
    setStock(false);
    setSelectedCats([]);
    setSelectedBrands([]);
    onChange({ 
      priceMin: null, 
      priceMax: null, 
      inStock: false,
      categories: [],
      brands: []
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCats(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const activeFiltersCount = 
    selectedCats.length + 
    selectedBrds.length + 
    (stock ? 1 : 0) + 
    (min ? 1 : 0) + 
    (max ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow relative"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </motion.button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">Filtros</SheetTitle>
              {activeFiltersCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </SheetHeader>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* Precio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-base font-semibold mb-3">Precio</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Mínimo</label>
                      <input
                        inputMode="numeric"
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                        className="w-full rounded-lg bg-secondary border border-input px-3 py-2 text-sm"
                        placeholder="$0"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Máximo</label>
                      <input
                        inputMode="numeric"
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                        className="w-full rounded-lg bg-secondary border border-input px-3 py-2 text-sm"
                        placeholder="Sin límite"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rangos rápidos:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setMin("0");
                          setMax("50000");
                        }}
                        className="px-3 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-colors"
                      >
                        $0-50k
                      </button>
                      <button
                        onClick={() => {
                          setMin("50000");
                          setMax("150000");
                        }}
                        className="px-3 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-colors"
                      >
                        $50k-150k
                      </button>
                      <button
                        onClick={() => {
                          setMin("150000");
                          setMax("300000");
                        }}
                        className="px-3 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-colors"
                      >
                        $150k-300k
                      </button>
                      <button
                        onClick={() => {
                          setMin("300000");
                          setMax("");
                        }}
                        className="px-3 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-colors"
                      >
                        +$300k
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Categorías */}
              {categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-base font-semibold mb-3">
                    Categorías {selectedCats.length > 0 && (
                      <span className="text-sm text-muted-foreground font-normal">
                        ({selectedCats.length})
                      </span>
                    )}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <label 
                        key={category} 
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedCats.includes(category)} 
                          onChange={() => toggleCategory(category)}
                          className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="flex-1 text-sm font-medium">{category}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          {categoryCounts[category] || 0}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Marcas */}
              {brands.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-base font-semibold mb-3">
                    Marcas {selectedBrds.length > 0 && (
                      <span className="text-sm text-muted-foreground font-normal">
                        ({selectedBrds.length})
                      </span>
                    )}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <label 
                        key={brand} 
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedBrds.includes(brand)} 
                          onChange={() => toggleBrand(brand)}
                          className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="flex-1 text-sm font-medium">{brand}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          {brandCounts[brand] || 0}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Disponibilidad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-base font-semibold mb-3">Disponibilidad</h4>
                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={stock} 
                    onChange={(e) => setStock(e.target.checked)}
                    className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Solo en stock</span>
                </label>
              </motion.div>
            </div>
          </div>

          {/* Footer - Sticky Actions */}
          <div className="border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4 safe-area-inset-bottom">
            <div className="flex gap-3">
              <button 
                onClick={clear} 
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-secondary text-sm font-semibold hover:bg-accent transition-all active:scale-95"
              >
                Limpiar todo
              </button>
              <button 
                onClick={apply} 
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
