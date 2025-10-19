import { useState, useCallback, useMemo } from 'react';
import { Product } from '@/services/productSchema';

interface UseProductComparisonReturn {
  comparisonProducts: Product[];
  isComparisonOpen: boolean;
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  openComparison: () => void;
  closeComparison: () => void;
  toggleComparison: () => void;
  isInComparison: (productId: string) => boolean;
  canAddMore: boolean;
  comparisonCount: number;
}

export const useProductComparison = (maxProducts: number = 4): UseProductComparisonReturn => {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const addToComparison = useCallback((product: Product): boolean => {
    if (comparisonProducts.length >= maxProducts) {
      return false; // Cannot add more products
    }

    if (comparisonProducts.some(p => p.id === product.id)) {
      return false; // Product already in comparison
    }

    setComparisonProducts(prev => [...prev, product]);
    return true;
  }, [comparisonProducts, maxProducts]);

  const removeFromComparison = useCallback((productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonProducts([]);
    setIsComparisonOpen(false);
  }, []);

  const openComparison = useCallback(() => {
    setIsComparisonOpen(true);
  }, []);

  const closeComparison = useCallback(() => {
    setIsComparisonOpen(false);
  }, []);

  const toggleComparison = useCallback(() => {
    setIsComparisonOpen(prev => !prev);
  }, []);

  const isInComparison = useCallback((productId: string): boolean => {
    return comparisonProducts.some(p => p.id === productId);
  }, [comparisonProducts]);

  const canAddMore = useMemo(() => {
    return comparisonProducts.length < maxProducts;
  }, [comparisonProducts.length, maxProducts]);

  const comparisonCount = useMemo(() => {
    return comparisonProducts.length;
  }, [comparisonProducts.length]);

  return {
    comparisonProducts,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    openComparison,
    closeComparison,
    toggleComparison,
    isInComparison,
    canAddMore,
    comparisonCount
  };
};