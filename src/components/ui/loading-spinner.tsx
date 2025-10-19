import React from "react";
import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white" | "muted";
  className?: string;
  "aria-label"?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const variantClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  white: "text-white",
  muted: "text-muted-foreground",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "primary",
  className,
  "aria-label": ariaLabel = "Cargando...",
}) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Componente de loading con texto
interface LoadingWithTextProps {
  text?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white" | "muted";
  className?: string;
  textClassName?: string;
}

export const LoadingWithText: React.FC<LoadingWithTextProps> = ({
  text = "Cargando...",
  size = "md",
  variant = "primary",
  className,
  textClassName,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)} role="status" aria-live="polite">
      <LoadingSpinner size={size} variant={variant} aria-label="" />
      <span className={cn("text-sm font-medium", variantClasses[variant], textClassName)}>
        {text}
      </span>
    </div>
  );
};

// Componente de loading para botones
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  loadingText,
  size = "sm",
  className,
}) => {
  return (
    <>
      {isLoading ? (
        <div className={cn("flex items-center gap-2", className)}>
          <LoadingSpinner size={size} variant="white" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </>
  );
};

// Componente de loading para páginas completas
interface LoadingPageProps {
  message?: string;
  className?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Cargando contenido...",
  className,
}) => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="xl" variant="primary" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

// Componente de skeleton loader
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = "animate-pulse bg-muted rounded";

  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};
