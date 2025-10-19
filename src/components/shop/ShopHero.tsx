import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

interface ShopHeroProps {
  onSearch?: (term: string) => void;
}

export const ShopHero: React.FC<ShopHeroProps> = ({ onSearch }) => {
  const [term, setTerm] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Atajo de teclado Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(term.trim());
  };

  console.log("ShopHero rendering");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

      <motion.div
        className="container mx-auto px-6 py-16 relative z-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-400 via-white to-green-400 bg-clip-text text-transparent">
          Tienda
        </h1>
        <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
          Encuentra herramientas profesionales con envío rápido, garantía y soporte.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto px-4 sm:px-0" role="search">
          <div className="relative flex items-center">
            <label htmlFor="search-input" className="sr-only">Buscar productos</label>
            <Search className="absolute left-3 w-5 h-5 text-emerald-300/80" aria-hidden="true" />
            <input
              ref={inputRef}
              id="search-input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full pl-11 pr-16 sm:pr-24 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 text-base sm:text-sm"
              placeholder="Buscar por nombre, categoría o característica..."
              aria-label="Buscar productos"
              aria-describedby="search-help"
              autoComplete="off"
              spellCheck="false"
              role="searchbox"
              autoCapitalize="off"
              autoCorrect="off"
            />
            <button
              type="submit"
              className="absolute right-2 px-3 sm:px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-colors text-sm sm:text-base"
              aria-label="Realizar búsqueda"
            >
              <span className="hidden sm:inline">Buscar</span>
              <Search className="w-4 h-4 sm:hidden" />
            </button>
          </div>
          <div id="search-help" className="sr-only">
            Busca productos por nombre, descripción, categoría, marca o características técnicas
          </div>
          <div className="text-center mt-2 hidden sm:block">
            <kbd className="inline-flex items-center px-2 py-1 text-xs font-medium text-slate-400 bg-slate-800/70 border border-slate-700/60 rounded">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
            </kbd>
            <span className="ml-2 text-xs text-slate-400">para buscar rápidamente</span>
          </div>
        </form>

        <div className="flex items-center justify-center gap-3 mt-6 text-sm text-emerald-200/80">
          <Sparkles className="w-4 h-4" />
          <span>Envío gratis en pedidos seleccionados • Garantía oficial</span>
        </div>
      </motion.div>
    </section>
  );
};
