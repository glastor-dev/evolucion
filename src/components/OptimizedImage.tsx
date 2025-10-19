import React, { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, sizes, className = "", priority = false }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} w-full h-full object-contain rounded`}
      />
    </div>
  );
};
