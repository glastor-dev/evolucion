import { Loader2, Package, Search, ShoppingCart, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin text-primary', sizeClasses[size], className)} />
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-4 w-full'
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 bg-[length:200%_100%]',
        'animate-[shimmer_2s_infinite]',
        variantClasses[variant],
        className
      )}
    />
  );
};

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn('p-4 border rounded-lg space-y-4', className)}>
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};

interface LoadingStateProps {
  type: 'products' | 'search' | 'cart' | 'page';
  message?: string;
  className?: string;
}

export const LoadingState = ({ type, message, className }: LoadingStateProps) => {
  const configs = {
    products: {
      icon: Package,
      defaultMessage: 'Cargando productos...',
      color: 'text-blue-500'
    },
    search: {
      icon: Search,
      defaultMessage: 'Buscando...',
      color: 'text-green-500'
    },
    cart: {
      icon: ShoppingCart,
      defaultMessage: 'Actualizando carrito...',
      color: 'text-orange-500'
    },
    page: {
      icon: Loader2,
      defaultMessage: 'Cargando...',
      color: 'text-primary'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="relative">
        <Icon className={cn('h-12 w-12 animate-spin', config.color)} />
        <div className="absolute inset-0 rounded-full border-2 border-current opacity-20 animate-ping" />
      </div>
      <p className="mt-4 text-lg font-medium text-muted-foreground">
        {message || config.defaultMessage}
      </p>
      <div className="mt-2 flex space-x-1">
        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
      </div>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ 
  title = 'Error de conexión',
  message = 'No se pudo cargar el contenido. Verifica tu conexión a internet.',
  onRetry,
  className 
}: ErrorStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="relative mb-4">
        <WifiOff className="h-16 w-16 text-red-500" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Wifi className="h-4 w-4" />
          Reintentar
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  title = 'No hay resultados',
  message = 'No se encontraron elementos para mostrar.',
  action,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="relative mb-4">
        <Package className="h-16 w-16 text-muted-foreground/50" />
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};