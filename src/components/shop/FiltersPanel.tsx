import React from "react";

interface FiltersPanelProps {
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
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ 
  priceMin, 
  priceMax, 
  inStock = false, 
  categories = [], 
  brands = [], 
  selectedCategories = [], 
  selectedBrands = [],
  categoryCounts = {},
  brandCounts = {},
  onChange 
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

  return (
    <aside className="w-full md:w-64 shrink-0 bg-slate-900/60 border border-slate-800/70 rounded-xl p-4 animate-in fade-in-0 slide-in-from-left-2 duration-300">
      <h3 className="font-semibold text-white mb-3">Filtros</h3>

      <div className="space-y-4">
        {/* Precio */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Precio</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <div>
                <label className="text-xs text-slate-400">Mínimo</label>
                <input
                  inputMode="numeric"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-950/60 border border-slate-700/60 px-3 py-2 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Máximo</label>
                <input
                  inputMode="numeric"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-950/60 border border-slate-700/60 px-3 py-2 text-sm"
                  placeholder="—"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Rangos rápidos:</p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    setMin("0");
                    setMax("50000");
                  }}
                  className="px-2 py-1 text-xs rounded bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors"
                >
                  $0-50k
                </button>
                <button
                  onClick={() => {
                    setMin("50000");
                    setMax("150000");
                  }}
                  className="px-2 py-1 text-xs rounded bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors"
                >
                  $50k-150k
                </button>
                <button
                  onClick={() => {
                    setMin("150000");
                    setMax("300000");
                  }}
                  className="px-2 py-1 text-xs rounded bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors"
                >
                  $150k-300k
                </button>
                <button
                  onClick={() => {
                    setMin("300000");
                    setMax("");
                  }}
                  className="px-2 py-1 text-xs rounded bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors"
                >
                  +$300k
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categorías */}
        {categories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Categorías</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 text-sm text-slate-300 select-none cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={selectedCats.includes(category)} 
                    onChange={() => toggleCategory(category)}
                    className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="flex-1">{category}</span>
                  <span className="text-xs text-slate-500">({categoryCounts[category] || 0})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Marcas */}
        {brands.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Marcas</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 text-sm text-slate-300 select-none cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={selectedBrds.includes(brand)} 
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="flex-1">{brand}</span>
                  <span className="text-xs text-slate-500">({brandCounts[brand] || 0})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Stock */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Disponibilidad</h4>
          <label className="flex items-center gap-2 text-sm text-slate-300 select-none cursor-pointer">
            <input 
              type="checkbox" 
              checked={stock} 
              onChange={(e) => setStock(e.target.checked)}
              className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
            />
            Solo en stock
          </label>
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-700/50">
          <button onClick={apply} className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition-all duration-200 hover:scale-105 active:scale-95">Aplicar</button>
          <button onClick={clear} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95">Limpiar</button>
        </div>
      </div>
    </aside>
  );
};
