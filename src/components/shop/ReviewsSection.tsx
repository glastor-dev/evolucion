import React, { memo, useMemo, useCallback } from "react";
import { Star as StarIcon, BadgeCheck } from "lucide-react";

// Tipos más específicos
type ReviewRating = 1 | 2 | 3 | 4 | 5;
type ReviewStatus = 'verified' | 'pending' | 'flagged';

type Review = {
  id: string;
  name: string;
  rating: ReviewRating;
  comment: string;
  createdAt: number;
  status?: ReviewStatus;
};

function useLocalReviews(productId: string) {
  const key = React.useMemo(() => `reviews:${productId}`, [productId]);
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Review[];
        setReviews(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setReviews([]);
    }
  }, [key]);

  const persist = (next: Review[]) => {
    setReviews(next);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(next));
      }
    } catch {
      // no-op
    }
  };

  const add = (r: Omit<Review, "id" | "createdAt">) => {
    const now = Date.now();
    const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
    const next: Review = { id, createdAt: now, ...r };
    persist([next, ...reviews]);
  };

  const remove = (id: string) => {
    persist(reviews.filter(r => r.id !== id));
  };

  const summary = React.useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, byStars: [0,0,0,0,0] as number[] };
    const byStars = [1,2,3,4,5].map(star => reviews.filter(r => r.rating === star).length);
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: sum / reviews.length, count: reviews.length, byStars };
  }, [reviews]);

  return { reviews, add, remove, summary } as const;
}

// Componente optimizado para el sistema de estrellas
interface StarsProps {
  value: number;
  onChange?: (rating: ReviewRating) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

const Stars = memo<StarsProps>(({ value, onChange, size = 18, readOnly = false, className = "" }) => {
  const handleStarClick = useCallback((rating: ReviewRating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  }, [readOnly, onChange]);

  return (
    <div 
      className={`inline-flex items-center gap-1 ${className}`}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `Calificación: ${value.toFixed(1)} de 5 estrellas` : "Seleccionar calificación"}
    >
      {([1, 2, 3, 4, 5] as const).map(n => (
        <button
          key={n}
          type="button"
          className={`group transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded ${
            readOnly ? "pointer-events-none" : "cursor-pointer"
          }`}
          aria-label={`Calificar ${n} ${n === 1 ? "estrella" : "estrellas"}`}
          aria-pressed={!readOnly && value >= n}
          onClick={() => handleStarClick(n as ReviewRating)}
          disabled={readOnly}
        >
          <StarIcon
            width={size}
            height={size}
            className={`transition-all duration-200 ${
              n <= value 
                ? "text-yellow-500 fill-yellow-500" 
                : readOnly 
                  ? "text-muted-foreground/50" 
                  : "text-muted-foreground hover:text-yellow-400"
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
});

Stars.displayName = 'Stars';

// Props interface mejorada
interface ReviewsSectionProps {
  productId: string | number;
  productName?: string;
  className?: string;
  showHeader?: boolean;
}

export const ReviewsSection = memo<ReviewsSectionProps>(({ 
  productId, 
  productName, 
  className = "",
  showHeader = true 
}) => {
  const pid = useMemo(() => String(productId), [productId]);
  
  const sectionTitle = useMemo(() => {
    return productName 
      ? `Experiencia de clientes de ${productName}`
      : "Experiencia de clientes del producto";
  }, [productName]);

  return (
    <section 
      aria-labelledby="testimonials-title" 
      className={`mb-6 ${className}`}
      role="region"
    >
      {showHeader && (
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 
            id="testimonials-title" 
            className="text-xl font-semibold text-foreground"
          >
            {sectionTitle}
          </h2>
        </div>
      )}
      
      {/* Testimonios sugeridos (generados automáticamente) */}
      <SuggestedTestimonials productId={pid} productName={productName} />
    </section>
  );
});

ReviewsSection.displayName = 'ReviewsSection';

export default ReviewsSection;

// ----- Testimonios sugeridos -----

// Tipo mejorado para testimonios
type ProfessionalRole = 
  | "Profesional" | "Instalador" | "Aficionado" | "Técnico" | "Carpintero"
  | "Contratista" | "Constructor" | "Electricista" | "Albañil" | "Ebanista"
  | "Soldador" | "Herrero" | "Plomero" | "Mecánico" | "Tornero";

type Suggested = { 
  name: string; 
  role: ProfessionalRole; 
  rating: ReviewRating; 
  comment: string; 
  createdAt: number;
  verified?: boolean;
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function generateSuggestedTestimonials(productId: string, productName?: string): Suggested[] {
  const seed = hashSeed(productId + ":" + (productName || ""));
  const names = [
    "Carolina G.",
    "Luis R.",
    "María P.",
    "Julián V.",
    "Esteban T.",
    "Lucía M.",
    "Andrés C.",
    "Sofía L.",
    "Valentina R.",
    "Diego S.",
    "Camila A.",
    "Fernando D.",
    "Paula N.",
    "Ricardo H.",
    "Gabriela E.",
    "Martín Q.",
  ];
  const roles: ProfessionalRole[] = [
    "Profesional",
    "Instalador",
    "Aficionado",
    "Técnico",
    "Carpintero",
    "Contratista",
    "Constructor",
    "Electricista",
    "Albañil",
    "Ebanista",
    "Soldador",
    "Herrero",
    "Plomero",
    "Mecánico",
    "Tornero",
  ];

  const pname = productName || "este producto";

  // Offsets deterministas para fechas relativas por producto (variados por semilla)
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const candidates = [
    0,
    2 * minute, 10 * minute, 30 * minute,
    1 * hour, 3 * hour, 12 * hour,
    1 * day, 2 * day, 4 * day,
    1 * week, 2 * week,
    1 * month, 2 * month, 3 * month,
  ];
  // Elegir 4 índices únicos a partir de la semilla
  const pickUnique = (count: number) => {
    const chosen: number[] = [];
    let s = seed;
    while (chosen.length < count) {
      const idxRaw = s % candidates.length;
      const idx = ((idxRaw % candidates.length) + candidates.length) % candidates.length; // normaliza a 0..len-1
      if (!chosen.includes(idx)) chosen.push(idx);
      s = (s * 1664525 + 1013904223) | 0; // LCG simple
    }
    return chosen;
  };
  const offsetIdx = pickUnique(4);
  const offsets = offsetIdx.map(i => candidates[i]);

  // Persistencia segura en localStorage
  const safeStorage = {
    get(key: string): string | null {
      try { return typeof window !== "undefined" ? window.localStorage.getItem(key) : null; } catch { return null; }
    },
    set(key: string, value: string) {
      try { if (typeof window !== "undefined") window.localStorage.setItem(key, value); } catch { /* no-op */ }
    }
  } as const;

  const REGISTRY_KEY = "reviews:persona-registry"; // mapa personaKey -> productId
  const PRODUCT_KEY = (pid: string) => `reviews:selected:${pid}`; // lista de personaKey para el producto

  const readRegistry = (): Record<string, string> => {
    const raw = safeStorage.get(REGISTRY_KEY);
    if (!raw) return {};
    try { const obj = JSON.parse(raw); return obj && typeof obj === "object" ? obj as Record<string, string> : {}; } catch { return {}; }
  };
  const writeRegistry = (reg: Record<string, string>) => safeStorage.set(REGISTRY_KEY, JSON.stringify(reg));

  const readProductSelection = (pid: string): string[] | null => {
    const raw = safeStorage.get(PRODUCT_KEY(pid));
    if (!raw) return null;
    try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr as string[] : null; } catch { return null; }
  };
  const writeProductSelection = (pid: string, keys: string[]) => safeStorage.set(PRODUCT_KEY(pid), JSON.stringify(keys));

  // Muestreo sin reemplazo determinístico
  const sampleUnique = <T,>(arr: T[], count: number, s0: number): T[] => {
    const used: number[] = [];
    let s = s0 | 0;
    const out: T[] = [];
    const limit = Math.min(count, arr.length);
    while (out.length < limit) {
      const idx = Math.abs(s) % arr.length;
      if (!used.includes(idx)) {
        used.push(idx);
        out.push(arr[idx]);
      }
      s = (s * 1664525 + 1013904223) | 0; // LCG
    }
    return out;
  };

  // Intentar recuperar selección previa para mantener estabilidad y no re-asignar
  const prevSelected = readProductSelection(productId);
  let personaKeys: string[] | null = Array.isArray(prevSelected) && prevSelected.length >= 4 ? prevSelected.slice(0,4) : null;

  if (!personaKeys) {
    // Construir un pool de combinaciones nombre+rol
    const pool: Array<{ name: string; role: string; key: string }> = [];
    for (const n of names) {
      for (const r of roles) {
        const key = `${n}__${r}`;
        pool.push({ name: n, role: r, key });
      }
    }
    // Iterar el pool evitando colisiones en el registro global
    const registry = readRegistry();
    const total = pool.length;
    const start = Math.abs(seed) % total;
    let step = (Math.abs(seed * 2654435761) % (total - 1)) + 1; // 1..total-1
    // En caso extremo, asegurar step válido
    if (!Number.isFinite(step) || step <= 0) step = 1;
    const chosen: string[] = [];
    let i = 0, idx = start;
    while (chosen.length < 4 && i < total * 2) {
      const p = pool[idx];
      if (p) {
        const inUseBy = registry[p.key];
        if (!inUseBy || inUseBy === productId) {
          if (!chosen.includes(p.key)) chosen.push(p.key);
        }
      }
      idx = (idx + step) % total;
      i++;
    }
    // Si aún faltan, completar ignorando registro (evitando duplicados locales)
    if (chosen.length < 4) {
      for (const p of pool) {
        if (chosen.length >= 4) break;
        if (!chosen.includes(p.key)) chosen.push(p.key);
      }
    }
    personaKeys = chosen.slice(0,4);
    // Persistir selección por producto y actualizar registro global
    writeProductSelection(productId, personaKeys);
    const nextReg = { ...registry };
    for (const k of personaKeys) nextReg[k] = productId;
    writeRegistry(nextReg);
  }

  // Resolver a nombres y roles a partir de las claves seleccionadas
  const selectedPersonas = personaKeys.map(k => {
    const [n, r] = k.split("__");
    return { name: n || pick(names, seed), role: r || pick(roles, seed) };
  });

  const templates: ((s: number, i: number) => Suggested)[] = [
    (s, i) => ({
      name: selectedPersonas[i]?.name ?? pick(names, s),
      role: (selectedPersonas[i]?.role ?? pick(roles, s + 1)) as ProfessionalRole,
      rating: 5 as ReviewRating,
      comment: `Impresionado con el rendimiento de ${pname}. La potencia y el control superaron mis expectativas. Excelente para jornadas largas.`,
      createdAt: now - offsets[i],
      verified: true,
    }),
    (s, i) => ({
      name: selectedPersonas[i]?.name ?? pick(names, s + 2),
      role: (selectedPersonas[i]?.role ?? pick(roles, s + 3)) as ProfessionalRole,
      rating: 4 as ReviewRating,
      comment: `${pname} ofrece una relación calidad/precio muy buena. Corte/Perforación limpia y rápida. Solo mejoraría el peso.`,
      createdAt: now - offsets[i],
      verified: true,
    }),
    (s, i) => ({
      name: selectedPersonas[i]?.name ?? pick(names, s + 4),
      role: (selectedPersonas[i]?.role ?? pick(roles, s + 5)) as ProfessionalRole,
      rating: 5 as ReviewRating,
      comment: `Se nota la calidad en cada detalle de ${pname}. Robusto, preciso y con acabados de primera. Recomendado para uso intensivo.`,
      createdAt: now - offsets[i],
      verified: true,
    }),
    (s, i) => ({
      name: selectedPersonas[i]?.name ?? pick(names, s + 6),
      role: (selectedPersonas[i]?.role ?? pick(roles, s + 7)) as ProfessionalRole,
      rating: 4 as ReviewRating,
      comment: `Instalación y ajuste sencillos. ${pname} me ahorró tiempo en obra. Buen agarre y poca vibración.`,
      createdAt: now - offsets[i],
      verified: true,
    }),
  ];

  return templates.map((fn, i) => fn(seed + i, i));
}

function formatRelativeEs(from: number, to: number = Date.now()): string {
  if (!Number.isFinite(from)) return "Ahora";
  const diff = Math.max(0, to - from);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const rtf = (n: number, s1: string, p: string) => (n === 1 ? `Hace 1 ${s1}` : `Hace ${n} ${p}`);

  if (diff < 60 * 1000) return "Ahora";
  if (diff < hour) return rtf(Math.round(diff / minute), "minuto", "minutos");
  if (diff < day) return rtf(Math.round(diff / hour), "hora", "horas");
  if (diff < week) return rtf(Math.round(diff / day), "día", "días");
  if (diff < month) return rtf(Math.round(diff / week), "semana", "semanas");
  if (diff < year) return rtf(Math.round(diff / month), "mes", "meses");
  return rtf(Math.round(diff / year), "año", "años");
}

// Props interface para SuggestedTestimonials
interface SuggestedTestimonialsProps {
  productId: string;
  productName?: string;
  className?: string;
}

const SuggestedTestimonials = memo<SuggestedTestimonialsProps>(({
  productId,
  productName,
  className = ""
}) => {
  const [suggestions, setSuggestions] = React.useState<Suggested[]>(() => 
    generateSuggestedTestimonials(productId, productName)
  );

  // Memoizar la generación de testimonios
  const memoizedSuggestions = useMemo(() => 
    generateSuggestedTestimonials(productId, productName), 
    [productId, productName]
  );

  // Recalcular ante cambios de props (fallback localStorage)
  React.useEffect(() => {
    setSuggestions(memoizedSuggestions);
  }, [memoizedSuggestions]);

  // Sincronización opcional con IndexedDB (Dexie). No rompe si Dexie no está instalado o el entorno no soporta IndexedDB.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod: any = await import("../../lib/localPersonaDB").catch(() => null);
        if (!mod || !mod.getAssignmentsByProduct) return;

        const safeStorage = {
          get(key: string): string | null {
            try { return typeof window !== "undefined" ? window.localStorage.getItem(key) : null; } catch { return null; }
          },
          set(key: string, value: string) {
            try { if (typeof window !== "undefined") window.localStorage.setItem(key, value); } catch { /* no-op */ }
          }
        } as const;
        const REGISTRY_KEY = "reviews:persona-registry";
        const PRODUCT_KEY = (pid: string) => `reviews:selected:${pid}`;
        const readRegistry = (): Record<string, string> => {
          const raw = safeStorage.get(REGISTRY_KEY);
          if (!raw) return {};
          try { const obj = JSON.parse(raw); return obj && typeof obj === "object" ? obj as Record<string, string> : {}; } catch { return {}; }
        };
        const writeRegistry = (reg: Record<string, string>) => safeStorage.set(REGISTRY_KEY, JSON.stringify(reg));
        const writeProductSelection = (pid: string, keys: string[]) => safeStorage.set(PRODUCT_KEY(pid), JSON.stringify(keys));

        const current = await mod.getAssignmentsByProduct(productId);
        if (current && current.length >= 4) {
          const keys = current.slice(0,4).map((a: any) => a.key);
          writeProductSelection(productId, keys);
          const reg = readRegistry();
          for (const k of keys) reg[k] = productId;
          writeRegistry(reg);
        } else {
          // si no hay en DB, sincronizar desde localStorage hacia DB
          const raw = safeStorage.get(PRODUCT_KEY(productId));
          try {
            const keys = raw ? JSON.parse(raw) : [];
            if (Array.isArray(keys) && keys.length) {
              await mod.setAssignments(keys.map((k: string) => ({ key: k, productId })));
            }
          } catch { /* no-op */ }
        }
        if (!cancelled) setSuggestions(generateSuggestedTestimonials(productId, productName));
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [productId, productName]);

  // Memoizar el cálculo de clases de badges
  const getRoleBadgeClass = useCallback((role: ProfessionalRole): string => {
    const base = "ml-1 text-[11px] px-2 py-0.5 rounded-full border font-medium transition-colors";
    switch (role) {
      case "Carpintero":
        return `${base} bg-amber-50 text-amber-700 border-amber-200`;
      case "Técnico":
        return `${base} bg-blue-50 text-blue-700 border-blue-200`;
      case "Contratista":
        return `${base} bg-violet-50 text-violet-700 border-violet-200`;
      case "Instalador":
        return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
      case "Profesional":
        return `${base} bg-sky-50 text-sky-700 border-sky-200`;
      case "Aficionado":
        return `${base} bg-slate-50 text-slate-700 border-slate-200`;
      case "Constructor":
        return `${base} bg-orange-50 text-orange-700 border-orange-200`;
      case "Electricista":
        return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
      case "Albañil":
        return `${base} bg-stone-50 text-stone-700 border-stone-200`;
      case "Ebanista":
        return `${base} bg-amber-50 text-amber-700 border-amber-200`;
      case "Soldador":
        return `${base} bg-indigo-50 text-indigo-700 border-indigo-200`;
      case "Herrero":
        return `${base} bg-neutral-50 text-neutral-700 border-neutral-200`;
      case "Plomero":
        return `${base} bg-cyan-50 text-cyan-700 border-cyan-200`;
      case "Mecánico":
        return `${base} bg-lime-50 text-lime-700 border-lime-200`;
      case "Tornero":
        return `${base} bg-rose-50 text-rose-700 border-rose-200`;
      default:
        return `${base} bg-muted text-muted-foreground border-border`;
    }
  }, []);

  if (!suggestions.length) return null;

  return (
    <div className={`mt-8 border-t pt-6 ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Experiencia de clientes</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6" role="group" aria-label="Testimonios de clientes">
        {suggestions.map((testimonial, idx) => (
          <TestimonialCard 
            key={`${productId}-${idx}`}
            testimonial={testimonial}
            getRoleBadgeClass={getRoleBadgeClass}
          />
        ))}
      </div>
    </div>
  );
});

SuggestedTestimonials.displayName = 'SuggestedTestimonials';

// Componente separado para cada tarjeta de testimonio
interface TestimonialCardProps {
  testimonial: Suggested;
  getRoleBadgeClass: (role: ProfessionalRole) => string;
}

const TestimonialCard = memo<TestimonialCardProps>(({ testimonial, getRoleBadgeClass }) => {
  const formattedDate = useMemo(() => {
    const dt = new Date(testimonial.createdAt);
    const valid = Number.isFinite(dt.getTime());
    return {
      valid,
      iso: valid ? dt.toISOString() : undefined,
      locale: valid ? dt.toLocaleString() : undefined,
      relative: formatRelativeEs(testimonial.createdAt)
    };
  }, [testimonial.createdAt]);

  return (
    <article 
      role="article" 
      aria-label={`Testimonio de ${testimonial.name}`} 
      className="rounded-lg border p-4 bg-card/60 hover:bg-card transition-all duration-200 h-full hover:shadow-sm"
    >
      <div className="flex flex-col gap-3">
        {/* Header con rating, nombre y rol */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Stars 
                value={testimonial.rating} 
                readOnly 
                size={16}
                className="flex-shrink-0"
              />
              <span 
                data-testid="testimonial-name" 
                className="text-sm font-medium max-w-[10rem] sm:max-w-[14rem] truncate text-foreground"
              >
                {testimonial.name}
              </span>
              <span className={`${getRoleBadgeClass(testimonial.role)} flex-shrink-0`}>
                {testimonial.role}
              </span>
            </div>
            
            <time
              className="block text-xs text-muted-foreground"
              dateTime={formattedDate.iso}
              title={formattedDate.locale}
            >
              {formattedDate.relative}
            </time>
          </div>
          
          {/* Badge de verificación */}
          <span 
            className="inline-flex items-center self-start sm:self-auto" 
            aria-label="Compra verificada" 
            title="Compra verificada"
          >
            <BadgeCheck 
              aria-hidden="true" 
              className="w-4 h-4 text-emerald-600 flex-shrink-0" 
            />
            <span className="sr-only">Compra verificada</span>
          </span>
        </div>
        
        {/* Comentario */}
        <p className="text-[13px] sm:text-sm leading-5 text-foreground/90 whitespace-pre-line">
          {testimonial.comment}
        </p>
      </div>
    </article>
  );
});

TestimonialCard.displayName = 'TestimonialCard';
