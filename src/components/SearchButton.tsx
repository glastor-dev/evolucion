import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { AdvancedSearch } from './AdvancedSearch';

interface SearchButtonProps {
  className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setIsOpen(false);
    navigate(`/tienda?q=${encodeURIComponent(query)}`);
  };

  // Atajo de teclado Ctrl/Cmd + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-lg transition-all ${className}`}
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Buscar...</span>
        <div className="ml-4 flex items-center gap-1 px-2 py-0.5 bg-background/50 border border-border rounded text-xs text-muted-foreground">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </motion.button>

      {/* Mobile Search Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </motion.button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold">Búsqueda Avanzada</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <AdvancedSearch
              onSearch={handleSearch}
              autoFocus
              placeholder="Buscar herramientas, marcas, categorías..."
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
