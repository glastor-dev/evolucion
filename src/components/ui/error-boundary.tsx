import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Bug, Home, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// Componente de fallback por defecto
interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onRetry,
  title = "Algo salió mal",
  description = "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
  showDetails = process.env.NODE_ENV === "development",
}) => {
  const goHome = () => {
    window.location.href = "/";
  };

  const reportError = () => {
    // Aquí podrías enviar el error a un servicio de logging
    console.log("Reporting error:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                aria-label="Intentar nuevamente"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Intentar nuevamente
              </button>
            )}

            <button
              onClick={goHome}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              aria-label="Ir al inicio"
            >
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Ir al inicio
            </button>
          </div>

          {showDetails && error && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Bug className="inline w-4 h-4 mr-1" aria-hidden="true" />
                Detalles técnicos
              </summary>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                  {error.toString()}
                  {errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          )}

          <button
            onClick={reportError}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
          >
            Reportar este error
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para errores de página específicos
interface PageErrorProps {
  status?: number;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  className?: string;
}

export const PageError: React.FC<PageErrorProps> = ({
  status = 500,
  title,
  description,
  showHomeButton = true,
  className,
}) => {
  const getDefaultContent = (status: number) => {
    switch (status) {
      case 404:
        return {
          title: "Página no encontrada",
          description: "La página que buscas no existe o ha sido movida.",
        };
      case 403:
        return {
          title: "Acceso denegado",
          description: "No tienes permisos para acceder a esta página.",
        };
      case 500:
        return {
          title: "Error del servidor",
          description: "Ha ocurrido un error interno. Por favor, intenta más tarde.",
        };
      default:
        return {
          title: "Error",
          description: "Ha ocurrido un error inesperado.",
        };
    }
  };

  const defaultContent = getDefaultContent(status);
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;

  const goHome = () => {
    window.location.href = "/";
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className={cn("min-h-[60vh] flex items-center justify-center px-4", className)}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">{status}</div>
          <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{finalTitle}</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">{finalDescription}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={goBack}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Volver atrás
          </button>

          {showHomeButton && (
            <button
              onClick={goHome}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Ir al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook para manejar errores de forma programática
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ""}:`, error);

    // Aquí podrías enviar el error a un servicio de logging
    // logErrorToService(error, context);
  };

  const handleAsyncError = (asyncFn: () => Promise<any>, context?: string) => {
    return asyncFn().catch((error) => {
      handleError(error, context);
      throw error; // Re-throw para que el componente pueda manejar el error
    });
  };

  return { handleError, handleAsyncError };
};
