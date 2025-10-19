import { useEffect, useState } from "react";

// Breakpoints de Tailwind CSS
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  breakpoint: Breakpoint | "xs";
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLarge: false,
        breakpoint: "lg" as const,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      isLarge: width >= breakpoints.xl,
      breakpoint: getBreakpoint(width),
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        width,
        height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
        isLarge: width >= breakpoints.xl,
        breakpoint: getBreakpoint(width),
      });
    };

    // Usar requestAnimationFrame para optimizar el rendimiento
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedHandleResize);

    // Llamar inmediatamente para establecer el estado inicial
    handleResize();

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

function getBreakpoint(width: number): Breakpoint | "xs" {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

// Hook para verificar si estamos en un breakpoint específico o superior
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { width } = useResponsive();
  return width >= breakpoints[breakpoint];
}

// Hook para obtener clases CSS responsivas dinámicamente
export function useResponsiveClasses() {
  const responsive = useResponsive();

  const getResponsiveClass = (classes: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  }) => {
    const { breakpoint } = responsive;

    // Buscar la clase más específica disponible para el breakpoint actual
    if (breakpoint === "2xl" && classes["2xl"]) return classes["2xl"];
    if ((breakpoint === "2xl" || breakpoint === "xl") && classes.xl) return classes.xl;
    if ((breakpoint === "2xl" || breakpoint === "xl" || breakpoint === "lg") && classes.lg)
      return classes.lg;
    if (
      (breakpoint === "2xl" || breakpoint === "xl" || breakpoint === "lg" || breakpoint === "md") &&
      classes.md
    )
      return classes.md;
    if (breakpoint !== "xs" && classes.sm) return classes.sm;

    return classes.xs || "";
  };

  return { getResponsiveClass, ...responsive };
}

// Hook para manejar orientación del dispositivo
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(() => {
    if (typeof window === "undefined") return "landscape";
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? "portrait" : "landscape");
    };

    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return orientation;
}

// Hook para detectar si el usuario está en un dispositivo táctil
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-ignore
          navigator.msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
}

// Utilidad para generar clases responsivas
export const responsive = {
  // Padding responsivo
  padding: {
    sm: "px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4",
    md: "px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-6",
    lg: "px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8",
  },

  // Texto responsivo
  text: {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl lg:text-2xl",
    xl: "text-xl sm:text-2xl lg:text-3xl",
    "2xl": "text-2xl sm:text-3xl lg:text-4xl",
    "3xl": "text-3xl sm:text-4xl lg:text-5xl",
  },

  // Grid responsivo
  grid: {
    auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  },

  // Espaciado responsivo
  gap: {
    sm: "gap-2 sm:gap-3 lg:gap-4",
    md: "gap-4 sm:gap-6 lg:gap-8",
    lg: "gap-6 sm:gap-8 lg:gap-12",
  },
};
