import React, { memo, useMemo } from "react";
import { ShieldCheck, Truck, Crown, Info } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Badge } from "@/components/ui/badge";
import dhlImg from "@/assets/klipartz.com (2).png";
import fedexImg from "@/assets/klipartz.com (3).png";
import genericCarrierImg from "@/assets/klipartz.com.png";
import { Helmet } from "react-helmet-async";

// Tipos más específicos
type ShippingStatus = 'in-stock' | 'out-of-stock' | 'restock-pending';
type CarrierType = 'dhl' | 'fedex' | 'generic';

export interface WarrantyShippingProps {
  inStock?: boolean;
  freeShipping?: boolean;
  officialStore?: boolean;
  warrantyMonths?: number;
  shippingTimeDays?: number;
  shippingNotes?: string;
  className?: string;
}

// Configuración de carriers tipada
interface CarrierConfig {
  id: CarrierType;
  name: string;
  image: string;
  alt: string;
  title: string;
}

const CARRIERS: CarrierConfig[] = [
  {
    id: 'dhl',
    name: 'DHL',
    image: dhlImg,
    alt: 'Método de envío DHL',
    title: 'DHL Express'
  },
  {
    id: 'fedex',
    name: 'FedEx',
    image: fedexImg,
    alt: 'Método de envío FedEx',
    title: 'FedEx'
  },
  {
    id: 'generic',
    name: 'Otros operadores',
    image: genericCarrierImg,
    alt: 'Operadores logísticos adicionales',
    title: 'Operadores logísticos'
  }
] as const;

// Función utilitaria mejorada con más casos
const formatEta = (days?: number): string => {
  if (!days || days <= 0) return "24–72 horas";
  if (days === 1) return "24 horas";
  if (days <= 3) return "24–72 horas";
  if (days <= 7) return `${days} días`;
  if (days <= 14) return `1-2 semanas`;
  if (days <= 30) return `2-4 semanas`;
  return `${Math.ceil(days / 30)} meses`;
};

// Función para formatear garantía de manera consistente
const formatWarranty = (months?: number): string => {
  if (!months || months <= 0) return "Garantía oficial del fabricante";
  if (months === 1) return "Garantía oficial 1 mes";
  if (months === 12) return "Garantía oficial 1 año";
  if (months > 12 && months % 12 === 0) {
    const years = months / 12;
    return `Garantía oficial ${years} ${years === 1 ? 'año' : 'años'}`;
  }
  return `Garantía oficial ${months} meses`;
};

// Componente para los tooltips informativos
interface InfoTooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  ariaLabel: string;
}

const InfoTooltip = memo<InfoTooltipProps>(({ trigger, content, ariaLabel }) => (
  <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 focus:outline-none focus:ring-2 focus:ring-ring rounded px-1 transition-colors hover:text-foreground"
          aria-label={ariaLabel}
        >
          {trigger}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="max-w-xs rounded bg-popover text-popover-foreground shadow px-3 py-2 text-xs z-50" sideOffset={6}>
          {content}
          <Tooltip.Arrow className="fill-popover" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
));

InfoTooltip.displayName = 'InfoTooltip';

// Componente para los logos de carriers
interface CarrierLogosProps {
  carriers: typeof CARRIERS;
  className?: string;
}

const CarrierLogos = memo<CarrierLogosProps>(({ carriers, className = "" }) => (
  <div className={`mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 items-center opacity-90 ${className}`}>
    {carriers.map((carrier) => (
      <img
        key={carrier.id}
        src={carrier.image}
        alt={carrier.alt}
        title={carrier.title}
        loading="lazy"
        decoding="async"
        className="h-8 sm:h-10 md:h-12 w-auto object-contain justify-self-start transition-opacity hover:opacity-100"
        onError={(e) => {
          // Fallback en caso de error de carga
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    ))}
  </div>
));

CarrierLogos.displayName = 'CarrierLogos';

export const WarrantyShipping: React.FC<WarrantyShippingProps> = memo(({
  inStock = true,
  freeShipping = true, // Default mejorado - más productos tendrán envío gratis
  officialStore = true, // Default mejorado - todos son tienda oficial
  warrantyMonths = 12, // Default - garantía estándar de 12 meses
  shippingTimeDays = 3, // Default - envío estándar 3 días
  shippingNotes = "Envío rápido disponible; tiempo puede variar según ubicación.",
  className = "",
}) => {
  // Valores memoizados para evitar recálculos innecesarios
  const etaText = useMemo(() => formatEta(shippingTimeDays), [shippingTimeDays]);
  const warrantyText = useMemo(() => formatWarranty(warrantyMonths), [warrantyMonths]);
  
  // Status derivado para mejor control
  const shippingStatus: ShippingStatus = useMemo(() => {
    if (!inStock) return 'out-of-stock';
    return 'in-stock';
  }, [inStock]);

  // JSON-LD estructurado memoizado
  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuál es la garantía del producto?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${warrantyText}. Cobertura por defectos de fabricación según políticas del fabricante.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tarda el envío?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Tiempo de entrega estimado: ${etaText}. Puede variar según ciudad y disponibilidad de stock.`,
        },
      },
    ],
  } as const), [warrantyText, etaText]);

  return (
    <div className={`rounded-lg border bg-card p-6 ${className}`} role="region" aria-labelledby="warranty-shipping-title">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      
      <h2 id="warranty-shipping-title" className="text-xl font-semibold mb-4">
        Garantía y Envío
      </h2>

      <div className="space-y-4">
        {/* Sección de Garantía */}
        <section aria-labelledby="warranty-section">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <ShieldCheck 
              className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" 
              aria-hidden="true" 
              role="img"
            />
            <div className="flex-1">
              <div className="text-foreground font-medium mb-1">{warrantyText}</div>
              <div className="mt-0.5">
                <InfoTooltip
                  trigger={
                    <>
                      <Info className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Aplica términos y condiciones</span>
                    </>
                  }
                  content={
                    <>
                      Aplica para defectos de fabricación. No cubre desgaste normal, mal uso ni daños por instalación incorrecta.
                      <div className="mt-2">
                        <a 
                          className="underline hover:no-underline focus:ring-2 focus:ring-ring rounded" 
                          href="/politicas/garantias"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver política de garantías
                        </a>
                      </div>
                    </>
                  }
                  ariaLabel="Ver términos y condiciones de garantía"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Envío */}
        <section aria-labelledby="shipping-section">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Truck 
              className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" 
              aria-hidden="true"
              role="img" 
            />
            <div className="flex-1">
              <div className="text-foreground font-medium mb-1">
                {shippingStatus === 'in-stock' ? (
                  <InfoTooltip
                    trigger={`Envío estimado: ${etaText}`}
                    content={
                      <>
                        El tiempo de entrega puede variar por ciudad y disponibilidad de stock.
                        <div className="mt-2">
                          <a 
                            className="underline hover:no-underline focus:ring-2 focus:ring-ring rounded" 
                            href="/politicas/envios"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver política de envíos
                          </a>
                        </div>
                      </>
                    }
                    ariaLabel="Más información sobre el envío estimado"
                  />
                ) : (
                  <span className="text-amber-600">Tiempo de envío sujeto a reposición</span>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground mb-3">
                {shippingNotes || "Puede variar según ciudad y disponibilidad."}
              </div>
              
              {/* Badges de estado */}
              <div className="flex flex-wrap gap-2 mb-3">
                {freeShipping && (
                  <Badge className="bg-green-600 text-white" aria-label="Envío gratuito disponible">
                    Envío gratis disponible
                  </Badge>
                )}
                {officialStore && (
                  <Badge className="bg-blue-600 text-white inline-flex items-center gap-1" aria-label="Tienda oficial certificada">
                    <Crown className="w-3.5 h-3.5" aria-hidden="true" />
                    Tienda oficial
                  </Badge>
                )}
                {!inStock && (
                  <Badge className="bg-amber-600 text-white" aria-label="Producto temporalmente sin stock">
                    Sin stock temporal
                  </Badge>
                )}
              </div>

              {/* Logos de operadores logísticos */}
              {freeShipping && (
                <div role="group" aria-label="Operadores logísticos disponibles">
                  <CarrierLogos carriers={CARRIERS} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

// Asignar displayName para debugging
WarrantyShipping.displayName = 'WarrantyShipping';

export default WarrantyShipping;
