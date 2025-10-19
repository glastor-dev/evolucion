import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  Camera,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { useDebounce } from '@/hooks/useDebounce';
import {
  normalizeForSearch,
  fuzzyMatch,
  calculateRelevanceScore,
  getSpellingSuggestions,
} from '@/utils/searchUtils';
import { getAllProducts } from '@/services/localProducts';

interface AdvancedSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'history' | 'suggestion';
  text: string;
  subtext?: string;
  count?: number;
  image?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = 'Buscar herramientas, marcas, categorías...',
  autoFocus = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [spellingSuggestion, setSpellingSuggestion] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const {
    isSupported: voiceSupported,
    isListening,
    transcript,
    toggleListening,
    resetTranscript,
  } = useVoiceSearch({ lang: 'es-ES' });

  // Sincronizar búsqueda por voz con el input
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  // Generar sugerencias cuando cambia la query
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        // Mostrar historial reciente cuando no hay query
        if (history.length > 0) {
          setSuggestions(
            history.slice(0, 5).map((item) => ({
              type: 'history',
              text: item.query,
              subtext: item.resultsCount
                ? `${item.resultsCount} resultado${item.resultsCount !== 1 ? 's' : ''}`
                : undefined,
            }))
          );
        } else {
          setSuggestions([]);
        }
        setSpellingSuggestion(null);
        return;
      }

      setLoading(true);

      try {
        const { products } = await getAllProducts();
        const normalizedQuery = normalizeForSearch(debouncedQuery);

        // Productos relevantes
        const relevantProducts = products
          .map((p) => ({
            product: p,
            score: calculateRelevanceScore(debouncedQuery, p),
          }))
          .filter((item) => item.score > 3)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(
            (item): SearchSuggestion => ({
              type: 'product',
              text: item.product.name || '',
              subtext: `${item.product.brand || ''} • $${item.product.price?.toLocaleString()}`,
              image: item.product.image,
            })
          );

        // Categorías relevantes
        const categories = new Set(products.map((p) => p.category).filter(Boolean));
        const relevantCategories = Array.from(categories)
          .filter((cat) => fuzzyMatch(debouncedQuery, cat!, 0.5))
          .slice(0, 3)
          .map(
            (cat): SearchSuggestion => ({
              type: 'category',
              text: cat!,
              count: products.filter((p) => p.category === cat).length,
            })
          );

        // Marcas relevantes
        const brands = new Set(products.map((p) => p.brand).filter(Boolean));
        const relevantBrands = Array.from(brands)
          .filter((brand) => fuzzyMatch(debouncedQuery, brand!, 0.5))
          .slice(0, 3)
          .map(
            (brand): SearchSuggestion => ({
              type: 'brand',
              text: brand!,
              count: products.filter((p) => p.brand === brand).length,
            })
          );

        // Sugerencias de corrección ortográfica
        const allTerms = [
          ...Array.from(categories),
          ...Array.from(brands),
          ...products.map((p) => p.name),
        ].filter(Boolean) as string[];

        const spellingCheck = getSpellingSuggestions(debouncedQuery, allTerms, 1, 0.7);
        if (spellingCheck.length > 0 && spellingCheck[0] !== debouncedQuery) {
          setSpellingSuggestion(spellingCheck[0]);
        } else {
          setSpellingSuggestion(null);
        }

        // Combinar sugerencias
        const combined = [
          ...relevantProducts,
          ...relevantCategories,
          ...relevantBrands,
        ].slice(0, 8);

        setSuggestions(combined);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    generateSuggestions();
  }, [debouncedQuery, history]);

  // Manejar búsqueda
  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      // Agregar al historial
      addSearch(trimmed);

      // Cerrar sugerencias
      setIsFocused(false);
      inputRef.current?.blur();

      // Callback externo
      if (onSearch) {
        onSearch(trimmed);
      } else {
        // Navegar a página de tienda con query
        navigate(`/tienda?q=${encodeURIComponent(trimmed)}`);
      }

      // Limpiar voice transcript si existe
      if (transcript) {
        resetTranscript();
      }
    },
    [addSearch, navigate, onSearch, transcript, resetTranscript]
  );

  // Manejar selección de sugerencia
  const handleSelectSuggestion = useCallback(
    (suggestion: SearchSuggestion) => {
      if (suggestion.type === 'history' || suggestion.type === 'product') {
        handleSearch(suggestion.text);
      } else if (suggestion.type === 'category') {
        navigate(`/tienda?cat=${encodeURIComponent(suggestion.text)}`);
        setIsFocused(false);
      } else if (suggestion.type === 'brand') {
        navigate(`/tienda?q=${encodeURIComponent(suggestion.text)}`);
        setIsFocused(false);
      }
    },
    [handleSearch, navigate]
  );

  // Navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
    setSpellingSuggestion(null);
    resetTranscript();
    inputRef.current?.focus();
  };

  // Auto-focus si se especifica
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const showSuggestions = isFocused && (suggestions.length > 0 || history.length > 0);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input Container */}
      <div
        className={`relative flex items-center gap-2 bg-background border-2 rounded-xl transition-all duration-300 ${
          isFocused
            ? 'border-primary shadow-lg shadow-primary/20'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 pl-12 pr-32 py-3 bg-transparent outline-none text-base"
        />

        {/* Action Buttons */}
        <div className="absolute right-2 flex items-center gap-1">
          {loading && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}

          {query && !loading && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleClear}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          {voiceSupported && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'hover:bg-accent'
              }`}
              aria-label={isListening ? 'Detener búsqueda por voz' : 'Buscar por voz'}
            >
              <Mic className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Búsqueda visual próximamente')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Buscar con cámara"
          >
            <Camera className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Spelling Suggestion */}
      <AnimatePresence>
        {spellingSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            ¿Quisiste decir{' '}
            <button
              onClick={() => setQuery(spellingSuggestion)}
              className="text-primary hover:underline font-medium"
            >
              {spellingSuggestion}
            </button>
            ?
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          >
            {/* Historial */}
            {!query && history.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    BÚSQUEDAS RECIENTES
                  </span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-primary hover:underline"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}

            {/* Suggestions List */}
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors ${
                    selectedIndex === index ? 'bg-accent' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {suggestion.type === 'history' && (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    {suggestion.type === 'product' && suggestion.image && (
                      <img
                        src={suggestion.image}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    )}
                    {suggestion.type === 'category' && (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    )}
                    {suggestion.type === 'brand' && (
                      <Sparkles className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium truncate">{suggestion.text}</div>
                    {suggestion.subtext && (
                      <div className="text-sm text-muted-foreground truncate">
                        {suggestion.subtext}
                      </div>
                    )}
                    {suggestion.count !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        {suggestion.count} producto{suggestion.count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                  {/* Delete button for history */}
                  {suggestion.type === 'history' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(suggestion.text);
                      }}
                      className="p-1 rounded hover:bg-background transition-colors"
                      aria-label="Eliminar del historial"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
