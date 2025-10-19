import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Wifi, 
  Search, 
  Server, 
  RefreshCw,
  Home,
  ArrowLeft
} from 'lucide-react';
import { ErrorState } from '@/hooks/useErrorHandler';
import { Link } from 'react-router-dom';

interface ErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
  canRetry?: boolean;
  isRetrying?: boolean;
  retryCount?: number;
  maxRetries?: number;
  showBackButton?: boolean;
  className?: string;
}

const ErrorIcon = ({ type }: { type: ErrorState['type'] }) => {
  const iconProps = { size: 48, className: "text-muted-foreground mb-4" };
  
  switch (type) {
    case 'network':
      return <Wifi {...iconProps} className="text-orange-500 mb-4" />;
    case 'not_found':
      return <Search {...iconProps} className="text-blue-500 mb-4" />;
    case 'server':
      return <Server {...iconProps} className="text-red-500 mb-4" />;
    default:
      return <AlertTriangle {...iconProps} className="text-yellow-500 mb-4" />;
  }
};

const getErrorTitle = (type: ErrorState['type']): string => {
  switch (type) {
    case 'network':
      return 'Sin conexión';
    case 'not_found':
      return 'Producto no encontrado';
    case 'server':
      return 'Error del servidor';
    case 'validation':
      return 'Datos inválidos';
    default:
      return 'Error inesperado';
  }
};

const getErrorSuggestion = (type: ErrorState['type']): string => {
  switch (type) {
    case 'network':
      return 'Verifica tu conexión a internet e inténtalo de nuevo.';
    case 'not_found':
      return 'El producto que buscas no existe o ha sido eliminado.';
    case 'server':
      return 'Nuestros servidores están experimentando problemas temporales.';
    case 'validation':
      return 'Los datos del producto no son válidos.';
    default:
      return 'Algo salió mal. Por favor, inténtalo de nuevo.';
  }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  canRetry = false,
  isRetrying = false,
  retryCount = 0,
  maxRetries = 3,
  showBackButton = true,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <ErrorIcon type={error.type} />
          
          <h2 className="text-xl font-semibold mb-2">
            {getErrorTitle(error.type)}
          </h2>
          
          <p className="text-muted-foreground mb-4">
            {error.message}
          </p>
          
          <p className="text-sm text-muted-foreground mb-6">
            {getErrorSuggestion(error.type)}
          </p>

          {error.code && (
            <p className="text-xs text-muted-foreground mb-4">
              Código de error: {error.code}
            </p>
          )}

          <div className="space-y-3">
            {canRetry && onRetry && (
              <div className="space-y-2">
                <Button 
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="w-full"
                  variant="default"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reintentar
                    </>
                  )}
                </Button>
                
                {retryCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Intento {retryCount} de {maxRetries}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {showBackButton && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="flex-1"
                asChild
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Inicio
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Si el problema persiste, contacta con soporte técnico
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};