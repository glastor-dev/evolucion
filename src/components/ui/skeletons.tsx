import React from 'react';
import { cn } from '@/lib/utils';

// Skeleton base reutilizable
export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
};

// Product Card Skeleton específico
export const ProductCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden bg-card">
    <div className="relative">
      <Skeleton className="aspect-square w-full" />
      <div className="absolute top-2 left-2">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  </div>
);

// Shop Page Grid Skeleton
export const ShopPageSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-2 mb-6">
      <Skeleton className="h-4 w-64" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gallery Skeleton */}
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Product Info Skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Hero Section Skeleton
export const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// Navbar Skeleton
export const NavbarSkeleton = () => (
  <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="hidden md:flex items-center gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

// Text Skeleton with different sizes
export const TextSkeleton = ({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )} 
      />
    ))}
  </div>
);

export default Skeleton;