import { useEffect } from "react";
import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

interface WebVitalsConfig {
  debug?: boolean;
  reportToAnalytics?: boolean;
  onMetric?: (metric: Metric) => void;
}

export const useWebVitals = ({
  debug = false,
  reportToAnalytics = false,
  onMetric,
}: WebVitalsConfig = {}) => {
  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      // Log en desarrollo
      if (debug) {
        console.group(`🔍 Web Vital: ${metric.name}`);
        console.log(`Valor: ${metric.value}`);
        console.log(`Rating: ${metric.rating}`);
        console.log(`Delta: ${metric.delta}`);
        console.log(`ID: ${metric.id}`);
        console.groupEnd();
      }

      // Callback personalizado
      onMetric?.(metric);

      // Enviar a analytics (Google Analytics, etc.)
      if (reportToAnalytics && typeof gtag !== "undefined") {
        gtag("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Enviar a consola con colores según rating
      const getColor = (rating: string) => {
        switch (rating) {
          case "good":
            return "#10B981"; // green
          case "needs-improvement":
            return "#F59E0B"; // yellow
          case "poor":
            return "#EF4444"; // red
          default:
            return "#6B7280"; // gray
        }
      };

      if (debug) {
        console.log(
          `%c${metric.name}: ${metric.value} (${metric.rating})`,
          `color: ${getColor(metric.rating)}; font-weight: bold;`
        );
      }
    };

    // Medir Core Web Vitals
    onCLS(handleMetric);
    onINP(handleMetric); // INP reemplaza a FID en versiones recientes
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  }, [debug, reportToAnalytics, onMetric]);
};

// Hook para obtener métricas específicas
export const usePerformanceMetrics = () => {
  useEffect(() => {
    // Medir tiempo de carga de la página
    const measurePageLoad = () => {
      if (typeof window !== "undefined" && window.performance) {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        const metrics = {
          // Tiempo hasta el primer byte
          ttfb: navigation.responseStart - navigation.requestStart,
          // Tiempo de carga del DOM (usar startTime en PerformanceNavigationTiming)
          domLoad: navigation.domContentLoadedEventEnd - navigation.startTime,
          // Tiempo de carga completa (usar startTime en PerformanceNavigationTiming)
          pageLoad: navigation.loadEventEnd - navigation.startTime,
          // Tiempo de renderizado
          renderTime: navigation.domContentLoadedEventEnd - navigation.responseStart,
        };

        console.group("📊 Performance Metrics");
        console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
        console.log(`DOM Load: ${metrics.domLoad.toFixed(2)}ms`);
        console.log(`Page Load: ${metrics.pageLoad.toFixed(2)}ms`);
        console.log(`Render Time: ${metrics.renderTime.toFixed(2)}ms`);
        console.groupEnd();

        return metrics;
      }
    };

    // Esperar a que la página esté completamente cargada
    if (document.readyState === "complete") {
      measurePageLoad();
    } else {
      window.addEventListener("load", measurePageLoad);
      return () => window.removeEventListener("load", measurePageLoad);
    }
  }, []);
};

// Declaración global para gtag (Google Analytics)
declare global {
  function gtag(...args: any[]): void;
}
