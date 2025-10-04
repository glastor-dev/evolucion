import React, { useState } from 'react';
import { useProducts, useCategories } from '../hooks/useProducts';
import { Product } from '../services/api';
import { Loader2, Search, Filter, Grid, List } from 'lucide-react';

interface DynamicProductGridProps {
  category?: string;
  featured?: boolean;
  pageSize?: number;
}

const DynamicProductGrid: React.FC<DynamicProductGridProps> = ({
  category,
  featured = false,
  pageSize = 12
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Hooks para datos
  const { products, isLoading, error, pagination } = useProducts({
    page: currentPage,
    pageSize,
    category: selectedCategory,
    featured,
    search: searchQuery
  });

  const { categories, isLoading: categoriesLoading } = useCategories();

  // Componente de producto individual
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { attributes } = product;
    const mainImage = attributes.images?.data?.[0]?.attributes?.url || '/placeholder-product.jpg';
    const hasDiscount = attributes.discountPrice && attributes.discountPrice < attributes.price;

    return (
      <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
        viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
      }`}>
        <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0 mr-4' : 'aspect-square'} relative`}>
          <img
            src={mainImage}
            alt={attributes.name}
            className="w-full h-full object-cover"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{Math.round(((attributes.price - attributes.discountPrice!) / attributes.price) * 100)}%
            </div>
          )}
          {attributes.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              Destacado
            </div>
          )}
        </div>
        
        <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{attributes.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{attributes.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-green-600">
                    ${attributes.discountPrice?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${attributes.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${attributes.price.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded ${
                attributes.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {attributes.stock > 0 ? `Stock: ${attributes.stock}` : 'Agotado'}
              </span>
            </div>
          </div>
          
          {attributes.category?.data && (
            <div className="mt-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {attributes.category.data.attributes.name}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente de paginación
  const Pagination: React.FC = () => {
    if (!pagination || pagination.pageCount <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        <span className="px-4 py-2">
          Página {currentPage} de {pagination.pageCount}
        </span>
        
        <button
          onClick={() => setCurrentPage(Math.min(pagination.pageCount, currentPage + 1))}
          disabled={currentPage === pagination.pageCount}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error al cargar productos</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtros y búsqueda */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de categoría */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.attributes.slug}>
                  {cat.attributes.name}
                </option>
              ))}
            </select>

            {/* Modo de vista */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando productos...</span>
        </div>
      )}

      {/* Productos */}
      {!isLoading && products.length > 0 && (
        <>
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination />
        </>
      )}

      {/* Estado vacío */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No se encontraron productos</div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicProductGrid;