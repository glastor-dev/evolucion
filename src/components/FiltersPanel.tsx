import React from 'react';

interface FiltersPanelProps {
  priceMin?: number;
  priceMax?: number;
  inStock: boolean;
  onChange: (filters: { priceMin?: number | null; priceMax?: number | null; inStock?: boolean }) => void;
  categories: string[];
  selectedCategories: string[];
  onChangeCategories: (categories: string[]) => void;
  brands: string[];
  selectedBrands: string[];
  onChangeBrands: (brands: string[]) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  priceMin,
  priceMax,
  inStock,
  onChange,
  categories,
  selectedCategories,
  onChangeCategories,
  brands,
  selectedBrands,
  onChangeBrands,
}) => {
  const [localPriceMin, setLocalPriceMin] = React.useState(priceMin?.toString() || '');
  const [localPriceMax, setLocalPriceMax] = React.useState(priceMax?.toString() || '');

  const applyFilters = () => {
    onChange({
      priceMin: localPriceMin ? parseInt(localPriceMin, 10) : null,
      priceMax: localPriceMax ? parseInt(localPriceMax, 10) : null,
      inStock,
    });
  };

  const clearFilters = () => {
    setLocalPriceMin('');
    setLocalPriceMax('');
    onChange({ priceMin: null, priceMax: null, inStock: false });
    onChangeCategories([]);
    onChangeBrands([]);
  };

  const toggleCategory = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onChangeCategories(newSelected);
  };

  const toggleBrand = (brand: string) => {
    const newSelected = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onChangeBrands(newSelected);
  };

  return (
    <aside className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/70 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          Limpiar todo
        </button>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Precio */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Precio</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Mínimo</label>
              <input
                type="number"
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700/60 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Máximo</label>
              <input
                type="number"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                placeholder="Sin límite"
                className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700/60 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Categorías</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 bg-slate-800/70 border border-slate-700/60 rounded text-blue-500 focus:ring-blue-500/50 focus:ring-2"
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Marcas */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Marcas</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 bg-slate-800/70 border border-slate-700/60 rounded text-blue-500 focus:ring-blue-500/50 focus:ring-2"
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Disponibilidad</h4>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => onChange({ inStock: e.target.checked })}
              className="w-4 h-4 bg-slate-800/70 border border-slate-700/60 rounded text-blue-500 focus:ring-blue-500/50 focus:ring-2"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Solo productos en stock
            </span>
          </label>
        </div>
      </div>

      {/* Botón aplicar */}
      <div className="mt-6 pt-4 border-t border-slate-800/70">
        <button
          onClick={applyFilters}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Aplicar filtros
        </button>
      </div>
    </aside>
  );
};

export default FiltersPanel;