import React, { useState, useEffect } from 'react';
import { getCLS, getFCP, getFID, getLCP, getTTFB, type Metric } from 'web-vitals';

// Tipos para métricas de rendimiento
interface PerformanceMetrics {
  lcp: number | null;
  fcp: number | null;
  cls: number | null;
  fid: number | null;
  ttfb: number | null;
}

interface PerformanceThresholds {
  lcp: { good: number; poor: number };
  fcp: { good: number; poor: number };
  cls: { good: number; poor: number };
  fid: { good: number; poor: number };
  ttfb: { good: number; poor: number };
}

// Umbrales optimizados para Web Vitals
const THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, poor: 4000 },
  fcp: { good: 1800, poor: 3000 },
  cls: { good: 0.1, poor: 0.25 },
  fid: { good: 100, poor: 300 },
  ttfb: { good: 800, poor: 1800 }
};

// Función para determinar el estado de una métrica
const getMetricStatus = (value: number | null, thresholds: { good: number; poor: number }) => {
  if (value === null) return 'loading';
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
};

// Hook personalizado para monitorear Web Vitals
export const useWebVitals = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fcp: null,
    cls: null,
    fid: null,
    ttfb: null
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value
      }));
    };

    // Obtener métricas de Web Vitals
    getCLS(handleMetric);
    getFCP(handleMetric);
    getFID(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);

    // Marcar como cargado después de un tiempo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Calcular estado general del rendimiento
  const overallStatus = React.useMemo(() => {
    const statuses = Object.entries(metrics).map(([key, value]) => {
      const threshold = THRESHOLDS[key as keyof PerformanceThresholds];
      return getMetricStatus(value, threshold);
    });

    if (statuses.includes('poor')) return 'poor';
    if (statuses.includes('needs-improvement')) return 'needs-improvement';
    if (statuses.every(status => status === 'good')) return 'good';
    return 'loading';
  }, [metrics]);

  return {
    metrics,
    isLoading,
    overallStatus,
    getMetricStatus: (metric: keyof PerformanceMetrics) => 
      getMetricStatus(metrics[metric], THRESHOLDS[metric])
  };
};

// Componente visual para mostrar métricas (opcional)
interface WebVitalsDisplayProps {
  showDetails?: boolean;
  className?: string;
}

export const WebVitalsDisplay: React.FC<WebVitalsDisplayProps> = ({ 
  showDetails = false, 
  className = "" 
}) => {
  const { metrics, overallStatus, getMetricStatus } = useWebVitals();

  if (!showDetails && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const statusColors = {
    good: 'text-green-600',
    'needs-improvement': 'text-yellow-600',
    poor: 'text-red-600',
    loading: 'text-gray-400'
  };

  const statusIcons = {
    good: '✓',
    'needs-improvement': '⚠',
    poor: '✗',
    loading: '⏳'
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm border rounded-lg p-3 text-xs font-mono shadow-lg z-50 ${className}`}>
      <div className="mb-2">
        <span className={`font-semibold ${statusColors[overallStatus]}`}>
          {statusIcons[overallStatus]} Web Vitals
        </span>
      </div>
      
      {showDetails && (
        <div className="space-y-1">
          <div className={statusColors[getMetricStatus('lcp')]}>
            LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : '...'} {statusIcons[getMetricStatus('lcp')]}
          </div>
          <div className={statusColors[getMetricStatus('fcp')]}>
            FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : '...'} {statusIcons[getMetricStatus('fcp')]}
          </div>
          <div className={statusColors[getMetricStatus('cls')]}>
            CLS: {metrics.cls ? metrics.cls.toFixed(3) : '...'} {statusIcons[getMetricStatus('cls')]}
          </div>
          <div className={statusColors[getMetricStatus('fid')]}>
            FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : '...'} {statusIcons[getMetricStatus('fid')]}
          </div>
          <div className={statusColors[getMetricStatus('ttfb')]}>
            TTFB: {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : '...'} {statusIcons[getMetricStatus('ttfb')]}
          </div>
        </div>
      )}
    </div>
  );
};

// Función para enviar métricas a analytics (Google Analytics, etc.)
export const sendWebVitalsToAnalytics = (metric: Metric) => {
  // Ejemplo para Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.id,
      custom_parameter_3: metric.delta
    });
  }

  // También enviar a consola en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      rating: getMetricStatus(metric.value, THRESHOLDS[metric.name.toLowerCase() as keyof PerformanceThresholds])
    });
  }
};

// Hook simplificado para inicializar monitoreo automático
export const useWebVitalsTracking = (enableAnalytics: boolean = false) => {
  useEffect(() => {
    if (enableAnalytics) {
      getCLS(sendWebVitalsToAnalytics);
      getFCP(sendWebVitalsToAnalytics);
      getFID(sendWebVitalsToAnalytics);
      getLCP(sendWebVitalsToAnalytics);
      getTTFB(sendWebVitalsToAnalytics);
    }
  }, [enableAnalytics]);
};