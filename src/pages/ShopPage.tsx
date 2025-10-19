import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, SlidersHorizontal, ArrowUpDown, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShopHero } from "@/components/shop/ShopHero";
import { CategoryHighlights } from "@/components/shop/CategoryHighlights";
import { FiltersPanel } from "@/components/shop/FiltersPanel";
import { MobileFiltersDrawer } from "@/components/shop/MobileFiltersDrawer";
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ShopPageSkeleton } from "@/components/ui/skeletons";
import { getAllProducts } from "@/services/localProducts";
import { cn } from "@/lib/utils";

import { Product } from "@/services/productSchema";
import { useDebounce } from "@/hooks/useDebounce";
import { normalizeForSearch } from "@/utils/searchUtils";
import Fuse from "fuse.js";

type SortOption = "relevance" | "price-asc" | "price-desc" | "name" | "rating" | "newest";
type ViewMode = "grid" | "list";

interface Filters {
  priceMin?: number | null;
  priceMax?: number | null;
  inStock?: boolean;
  categories?: string[];
  brands?: string[];
}

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre A-Z" },
  { value: "rating", label: "Mejor valorados" },
  { value: "newest", label: "Más recientes" },
];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados principales
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [filters, setFilters] = useState<Filters>({
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : null,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : null,
    inStock: searchParams.get("inStock") === "true",
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
  });
  
  // Estados de UI
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Inicializar Fuse.js para búsqueda
  const fuse = useMemo(() => {
    if (!allProducts.length) return null;
    return new Fuse(allProducts, {
      keys: ['name', 'description', 'category', 'brand'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [allProducts]);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProducts();
        if (response.error) {
          throw new Error(response.error);
        }
        if (!Array.isArray(response.products)) {
          throw new Error('Los productos no tienen el formato esperado');
        }
        setAllProducts(response.products);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
        setAllProducts([]); // Asegurar que allProducts sea un array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Calcular categorías y marcas disponibles
  const { categories, brands, categoryCounts, brandCounts } = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return {
        categories: [],
        brands: [],
        categoryCounts: {},
        brandCounts: {},
      };
    }

    const cats = [...new Set(allProducts.map(p => p.category))].filter((cat): cat is string => !!cat);
    const brds = [...new Set(allProducts.map(p => p.brand))].filter((brd): brd is string => !!brd);
    
    const catCounts: Record<string, number> = {};
    const brdCounts: Record<string, number> = {};
    
    allProducts.forEach(product => {
      if (product.category) {
        catCounts[product.category] = (catCounts[product.category] || 0) + 1;
      }
      if (product.brand) {
        brdCounts[product.brand] = (brdCounts[product.brand] || 0) + 1;
      }
    });

    return {
      categories: cats,
      brands: brds,
      categoryCounts: catCounts,
      brandCounts: brdCounts,
    };
  }, [allProducts]);

  // Filtrado y ordenamiento de productos
  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return [];
    }

    let filtered = [...allProducts];

    // Aplicar búsqueda si hay término
    if (searchTerm.trim() && fuse) {
      const results = fuse.search(searchTerm.trim());
      filtered = results.map(result => result.item);
    }

    // Aplicar filtros
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => product.brand && filters.brands?.includes(product.brand));
    }
    if (filters.priceMin !== null || filters.priceMax !== null) {
      filtered = filtered.filter(product => {
        const price = product.price;
        if (filters.priceMin !== null && price < filters.priceMin) return false;
        if (filters.priceMax !== null && price > filters.priceMax) return false;
        return true;
      });
    }
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        // Mantener el orden original para 'relevance'
        break;
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, filters, sortBy, fuse]);

  // Paginación de productos
  const paginatedProducts = useMemo(() => {
    if (loading || filteredAndSortedProducts.length === 0) {
      return [];
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, loading]);

  // Actualizar URL cuando cambien los parámetros
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (filters.priceMin) params.set("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.set("priceMax", filters.priceMax.toString());
    if (filters.inStock) params.set("inStock", "true");
    if (filters.categories && filters.categories.length > 0) params.set("categories", filters.categories.join(","));
    if (filters.brands && filters.brands.length > 0) params.set("brands", filters.brands.join(","));
    if (sortBy !== "relevance") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());
    
    setSearchParams(params);
  }, [debouncedSearchTerm, selectedCategory, filters, sortBy, currentPage, setSearchParams]);

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleCategoryClick = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setFilters({
      priceMin: null,
      priceMax: null,
      inStock: false,
      categories: [],
      brands: [],
    });
    setSortBy("relevance");
    setCurrentPage(1);
  }, []);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.inStock) count++;
    if (filters.categories && filters.categories.length > 0) count += filters.categories.length;
    if (filters.brands && filters.brands.length > 0) count += filters.brands.length;
    return count;
  }, [searchTerm, selectedCategory, filters]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error al cargar productos</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  // Diagnóstico visual de productos en ShopPage
  console.log('🛒 Productos recibidos en ShopPage:', allProducts);

  // Normalizar props para filtros y paneles
  const safePriceMin = typeof filters.priceMin === 'number' ? filters.priceMin : null;
  const safePriceMax = typeof filters.priceMax === 'number' ? filters.priceMax : null;
  const safeCategories = Array.isArray(categories) ? categories.filter((cat): cat is string => !!cat) : [];
  const safeBrands = Array.isArray(brands) ? brands.filter((brd): brd is string => !!brd) : [];

  // Normalizar las categorías recibidas en ShopPage antes de pasarlas
  const safeCategoryObjects = Array.isArray(safeCategories) && safeCategories.length > 0
    ? safeCategories.map(cat => ({ slug: cat, title: cat }))
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ShopHero onSearch={handleSearch} />

      {/* Category Highlights */}
      <CategoryHighlights 
        categories={safeCategoryObjects}
        onClickCategory={handleCategoryClick}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FiltersPanel
              priceMin={safePriceMin}
              priceMax={safePriceMax}
              inStock={filters.inStock || false}
              categories={safeCategories}
              brands={safeBrands}
              selectedCategories={filters.categories || []}
              selectedBrands={filters.brands || []}
              categoryCounts={categoryCounts}
              brandCounts={brandCounts}
              onChange={handleFiltersChange}
            />
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filters Button */}
                <div className="lg:hidden">
                  <MobileFiltersDrawer
                    priceMin={safePriceMin}
                    priceMax={safePriceMax}
                    inStock={filters.inStock}
                    categories={safeCategories}
                    brands={safeBrands}
                    selectedCategories={filters.categories}
                    selectedBrands={filters.brands}
                    categoryCounts={categoryCounts}
                    brandCounts={brandCounts}
                    onChange={handleFiltersChange}
                    isOpen={mobileFiltersOpen}
                    onOpenChange={setMobileFiltersOpen}
                  />
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    "Cargando productos..."
                  ) : (
                    <>
                      {filteredAndSortedProducts.length > 0 ? (
                        <>
                          Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-
                          {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)} de{' '}
                          {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length !== 1 ? 's' : ''}
                          {debouncedSearchTerm && ` para "${debouncedSearchTerm}"`}
                        </>
                      ) : (
                        <>
                          No se encontraron productos
                          {debouncedSearchTerm && ` para "${debouncedSearchTerm}"`}
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs h-6 px-2"
                    >
                      Limpiar
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border border-input rounded-md">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-label="Ver en cuadrícula"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-label="Ver en lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="w-48 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShopPageSkeleton count={ITEMS_PER_PAGE} />
                </motion.div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground mb-4">
                    Intenta ajustar los filtros o buscar con otros términos
                  </p>
                  <Button onClick={clearAllFilters}>
                    Limpiar filtros
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductGrid
                    products={paginatedProducts}
                    searchQuery={debouncedSearchTerm}
                    viewMode={viewMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!loading && filteredAndSortedProducts.length > 0 && (
              <nav className="mt-8 flex justify-center gap-2">
                {/* Previous page button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "relative inline-flex items-center rounded-l-md px-2 py-2",
                    currentPage === 1
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-white text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) }).map((_, i) => {
                  const pageNumber = i + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={cn(
                        "relative inline-flex items-center px-4 py-2 text-sm font-semibold",
                        isCurrentPage
                          ? "z-10 bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          : "text-foreground ring-1 ring-inset ring-input hover:bg-accent"
                      )}
                      aria-current={isCurrentPage ? "page" : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next page button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE), prev + 1))}
                  disabled={currentPage === Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)}
                  className={cn(
                    "relative inline-flex items-center rounded-r-md px-2 py-2",
                    currentPage === Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-white text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
