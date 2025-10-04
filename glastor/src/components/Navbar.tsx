import { useState, useEffect, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
} from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Logo from "./Logo";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { 
  MenuIcon, 
  ShoppingCartIcon, 
  SearchIcon, 
  UserIcon, 
  HeartIcon, 
  XIcon, 
  ClockIcon, 
  TrendingUpIcon 
} from "./SvgIcons";
import { WhatsAppButton } from "./WhatsAppButton";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "./LanguageToggle";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { ARIA_LABELS, keyboardNavigation, screenReader } from "../utils/accessibility";

interface RouteProps {
  href: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand';
  count?: number;
}

const routeList: RouteProps[] = [
  {
    href: "#inicio",
    label: "Inicio",
  },
  {
    href: "#productos",
    label: "Productos",
  },
  {
    href: "#servicios",
    label: "Servicios",
  },
  {
    href: "#equipo",
    label: "Equipo",
  },
  {
    href: "#contacto",
    label: "Contacto",
  },
];

// Datos simulados de productos para la búsqueda
const mockProducts: Product[] = [
  { id: 1, name: "Smartphone Galaxy S24", category: "Electrónicos", price: 899000, image: "/api/placeholder/100/100" },
  { id: 2, name: "Laptop Gaming ROG", category: "Computadores", price: 2500000, image: "/api/placeholder/100/100" },
  { id: 3, name: "Auriculares Sony WH-1000XM5", category: "Audio", price: 450000, image: "/api/placeholder/100/100" },
  { id: 4, name: "Cámara Canon EOS R6", category: "Fotografía", price: 3200000, image: "/api/placeholder/100/100" },
  { id: 5, name: "Tablet iPad Pro", category: "Electrónicos", price: 1800000, image: "/api/placeholder/100/100" },
  { id: 6, name: "Smartwatch Apple Watch", category: "Wearables", price: 650000, image: "/api/placeholder/100/100" },
  { id: 7, name: "Teclado Mecánico Corsair", category: "Accesorios", price: 180000, image: "/api/placeholder/100/100" },
  { id: 8, name: "Monitor 4K LG UltraWide", category: "Monitores", price: 850000, image: "/api/placeholder/100/100" },
];

// Sugerencias populares
const popularSuggestions: SearchSuggestion[] = [
  { id: "1", text: "smartphone", type: "category", count: 15 },
  { id: "2", text: "laptop", type: "category", count: 12 },
  { id: "3", text: "auriculares", type: "category", count: 8 },
  { id: "4", text: "Samsung", type: "brand", count: 20 },
  { id: "5", text: "Apple", type: "brand", count: 18 },
  { id: "6", text: "gaming", type: "category", count: 10 },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("#inicio");
  const { state, toggleCart } = useCart();
  const { state: favoritesState, togglePanel } = useFavorites();
  
  // Estados de búsqueda
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Efecto de scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función de búsqueda
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = mockProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  // Función para obtener sugerencias
  const getSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions(popularSuggestions);
      return;
    }

    const productSuggestions = mockProducts
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(product => ({
        id: `product-${product.id}`,
        text: product.name,
        type: 'product' as const
      }));

    const categorySuggestions = popularSuggestions
      .filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3);

    setSearchSuggestions([...productSuggestions, ...categorySuggestions]);
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    getSuggestions(value);
    performSearch(value);
  };

  // Manejar envío de búsqueda
  const handleSearchSubmit = (query: string = searchQuery) => {
    if (!query.trim()) return;

    // Agregar al historial
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    
    // Realizar búsqueda
    performSearch(query);
    
    // Cerrar sugerencias
    setIsSearchFocused(false);
    
    console.log(`Buscando: ${query}`);
    console.log(`Resultados encontrados: ${searchResults.length}`);
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    handleSearchSubmit(suggestion.text);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setIsSearchFocused(false);
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Función para resaltar texto coincidente
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Efecto para cargar historial desde localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    setSearchSuggestions(popularSuggestions);
  }, []);

  // Efecto para guardar historial en localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'border-b bg-background/98 backdrop-blur-xl shadow-lg supports-[backdrop-filter]:bg-background/95' 
        : 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    }`}>
      {/* Barra superior con información adicional */}
      <div 
        className={`block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white transition-all duration-500 ${
          scrolled ? 'py-1 text-xs' : 'py-2 text-xs sm:text-sm'
        }`}
        role="banner"
        aria-label="Información de promociones y contacto"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div 
            className="font-body animate-pulse hidden sm:block"
            role="status"
            aria-live="polite"
            aria-label="Promoción de envío gratuito"
          >
            🚚 Envío gratis en compras mayores a $50.000
          </div>
          <div 
            className="font-body animate-pulse sm:hidden text-xs"
            role="status"
            aria-live="polite"
            aria-label="Promoción de envío gratuito"
          >
            🚚 Envío gratis +$50k
          </div>
          <div className="flex items-center gap-2 sm:gap-4" role="group" aria-label="Información de contacto">
            <a 
              href="tel:+5491132578591"
              className="font-body hover:text-yellow-300 transition-colors cursor-pointer hidden sm:block"
              aria-label="Llamar al teléfono +54 911 3257 8591"
            >
              📞 +54 911 3257 8591
            </a>
            <a 
              href="tel:+5491132578591"
              className="font-body hover:text-yellow-300 transition-colors cursor-pointer sm:hidden text-xs"
              aria-label="Llamar al teléfono"
            >
              📞
            </a>
            <a 
              href="mailto:glastor.info@gmail.com"
              className="font-body hover:text-yellow-300 transition-colors cursor-pointer hidden md:block"
              aria-label="Enviar correo a glastor.info@gmail.com"
            >
              ✉️ glastor.info@gmail.com
            </a>
            <a 
              href="mailto:glastor.info@gmail.com"
              className="font-body hover:text-yellow-300 transition-colors cursor-pointer md:hidden text-xs"
              aria-label="Enviar correo"
            >
              ✉️
            </a>
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <NavigationMenu className="mx-auto" role="navigation" aria-label={ARIA_LABELS.MAIN_NAVIGATION}>
        <NavigationMenuList className={`container px-4 w-screen flex justify-between items-center transition-all duration-500 ${
          scrolled ? 'h-24' : 'h-28'
        }`}>
          {/* Logo */}
          <NavigationMenuItem className="font-heading flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="flex items-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
              aria-label="Glastor - Ir a la página principal"
            >
              <Logo 
                title="Glastor - Desarrollo Full Stack y Distribución Ecommerce"
                className={`${
                  scrolled ? 'h-[clamp(40px,8vw,64px)]' : 'h-[clamp(48px,9vw,84px)]'
                } w-auto object-contain transition-none`}
              />
            </a>
          </NavigationMenuItem>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" role="menubar" aria-label="Navegación principal del sitio">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                role="menuitem"
                aria-current={activeSection === route.href ? 'page' : undefined}
                className={`relative px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium font-body transition-colors duration-300 group ${
                  activeSection === route.href 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="relative z-10">
                  <span className="hidden lg:inline">{route.label}</span>
                  <span className="lg:hidden">{route.label.substring(0, 6)}{route.label.length > 6 ? '...' : ''}</span>
                </span>
                {/* Animación de subrayado hover */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></div>
                {/* Indicador de sección activa */}
                {activeSection === route.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Submenú páginas dedicadas (Mega-menú mejorado) */}
          <NavigationMenuItem className="hidden md:flex">
            <NavigationMenuTrigger className="px-4 py-2 text-xs lg:text-sm font-medium font-body">
              Páginas
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <motion.div
                className="w-full flex justify-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="grid gap-3 p-4 md:w-[520px] md:grid-cols-2 mx-auto">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Destacados</h4>
                    <a
                      rel="noreferrer noopener"
                      href="/tienda"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label="Ir a la página Tienda"
                    >
                      Tienda
                    </a>
                    <a
                      rel="noreferrer noopener"
                      href="/about"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label="Ir a la página About"
                    >
                      About
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Explorar</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-3 py-2 rounded-md border text-sm hover:bg-accent hover:text-accent-foreground">
                        Más
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={6}>
                        <DropdownMenuItem asChild>
                          <a
                            rel="noreferrer noopener"
                            href="/tienda#ofertas"
                            className="block px-2 py-1.5"
                          >
                            Ofertas
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Categorías
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem asChild>
                              <a
                                rel="noreferrer noopener"
                                href="/tienda?cat=automatizacion"
                                className="block px-2 py-1.5"
                              >
                                Automatización
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                rel="noreferrer noopener"
                                href="/tienda?cat=herramientas"
                                className="block px-2 py-1.5"
                              >
                                Herramientas
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Búsqueda */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-accent"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }
              }}
            >
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Favoritos */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-accent relative"
              onClick={togglePanel}
            >
              <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              {favoritesState.items.length > 0 && (
                <Badge 
                  className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs bg-vue-primary text-white"
                >
                  {favoritesState.items.length}
                </Badge>
              )}
              <span className="sr-only">Favoritos</span>
            </Button>

            {/* Carrito de compras */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent p-1.5 sm:p-2"
              onClick={toggleCart}
              aria-label={`Carrito de compras${state.items.length > 0 ? ` - ${state.items.reduce((total, item) => total + item.quantity, 0)} artículos` : ' - vacío'}`}
              aria-expanded={false}
              aria-haspopup="dialog"
            >
              <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              {state.items.length > 0 && (
                <Badge 
                  className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs p-0 bg-vue-gradient text-white"
                  aria-hidden="true"
                >
                  {state.items.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
              <span className="sr-only">Carrito de compras</span>
            </Button>

            {/* WhatsApp */}
            <WhatsAppButton 
              variant="navbar"
              size="sm"
              className="hidden sm:flex"
            />

            {/* Usuario */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-accent"
              aria-label="Acceder a perfil de usuario"
            >
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Perfil de usuario</span>
            </Button>

            {/* Toggle de tema */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* Cambio de idioma */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Menú móvil */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Abrir menú de navegación"
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>

              <SheetContent 
                side="right" 
                className="w-80"
                id="mobile-menu"
                role="dialog"
                aria-label="Menú de navegación móvil"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-center font-heading">
                    <Logo
                      title="Glastor - Desarrollo Full Stack y Distribución Ecommerce"
                      className="h-[clamp(32px,7vw,40px)] w-auto object-contain transition-none"
                    />
                  </SheetTitle>
                </SheetHeader>

                {/* Barra de búsqueda móvil */}
                <div className="mt-6 mb-4" role="search" aria-label="Búsqueda de productos">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <input
                      ref={mobileSearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit();
                        }
                      }}
                      placeholder="Buscar productos..."
                      aria-label="Campo de búsqueda de productos"
                      aria-describedby="search-help"
                      className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium bg-white dark:bg-gray-800"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Limpiar búsqueda"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div id="search-help" className="sr-only">
                    Presiona Enter para buscar o usa las flechas para navegar por las sugerencias
                  </div>
                </div>

                {/* Navegación móvil */}
                <nav className="flex flex-col space-y-2" role="navigation" aria-label="Navegación principal móvil">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm font-medium font-body rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      role="menuitem"
                      aria-current={activeSection === href ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  ))}
                </nav>

                {/* Submenú móvil: Páginas dedicadas */}
                <div className="mt-4">
                  <h3 className="px-4 text-xs text-muted-foreground">Páginas</h3>
                  <a
                    rel="noreferrer noopener"
                    href="/tienda"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium font-body rounded-lg hover:bg-accent transition-colors"
                    role="menuitem"
                  >
                    Tienda
                  </a>
                  <a
                    rel="noreferrer noopener"
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium font-body rounded-lg hover:bg-accent transition-colors"
                    role="menuitem"
                  >
                    About
                  </a>
                </div>

                {/* Acciones móviles */}
                <div className="mt-6 pt-6 border-t space-y-3" role="group" aria-label="Acciones de usuario">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start font-body"
                    aria-label="Acceder a mi cuenta de usuario"
                  >
                    <UserIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mi Cuenta
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start font-body"
                    aria-label="Ver productos favoritos"
                  >
                    <HeartIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    Favoritos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start font-body" 
                    onClick={toggleCart}
                    aria-label={`Abrir carrito de compras con ${state.items.reduce((total, item) => total + item.quantity, 0)} artículos`}
                  >
                    <ShoppingCartIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    Carrito ({state.items.reduce((total, item) => total + item.quantity, 0)})
                  </Button>
                  <WhatsAppButton 
                    variant="default"
                    size="sm"
                    className="w-full justify-start font-body"
                  />
                </div>

                {/* Enlaces adicionales */}
                <div className="mt-6 pt-6 border-t">
                  <a
                    rel="noreferrer noopener"
                    href="https://github.com/glastor"
                    target="_blank"
                    className="flex items-center justify-center w-full py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <GitHubLogoIcon className="mr-2 w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </NavigationMenuList>
        <NavigationMenuIndicator />
      </NavigationMenu>

      {/* Barra de búsqueda expandible con funcionalidad completa */}
      {isSearchOpen && (
        <div className="border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="relative max-w-2xl mx-auto">
              {/* Input de búsqueda */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    } else if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                      clearSearch();
                    }
                  }}
                  placeholder="Buscar productos, marcas, categorías..."
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sugerencias y resultados */}
              {(isSearchFocused || showResults) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 max-h-96 overflow-y-auto z-50">
                  {/* Historial de búsqueda */}
                  {!searchQuery && searchHistory.length > 0 && (
                    <div className="p-4 border-b">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Búsquedas recientes
                      </h4>
                      <div className="space-y-1">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(item);
                              handleSearchSubmit(item);
                            }}
                            className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sugerencias populares */}
                  {!searchQuery && (
                    <div className="p-4 border-b">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <TrendingUpIcon className="h-4 w-4 mr-2" />
                        Búsquedas populares
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {popularSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-left px-2 py-1 text-sm hover:bg-accent rounded flex items-center justify-between"
                          >
                            <span>{suggestion.text}</span>
                            {suggestion.count && (
                              <span className="text-xs text-muted-foreground">
                                {suggestion.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sugerencias dinámicas */}
                  {searchQuery && searchSuggestions.length > 0 && (
                    <div className="p-4 border-b">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Sugerencias
                      </h4>
                      <div className="space-y-1">
                        {searchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded flex items-center justify-between"
                          >
                            <span>{highlightText(suggestion.text, searchQuery)}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {suggestion.type === 'product' ? 'Producto' : 
                               suggestion.type === 'category' ? 'Categoría' : 'Marca'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resultados de productos */}
                  {showResults && searchResults.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Productos encontrados ({searchResults.length})
                      </h4>
                      <div className="space-y-3">
                        {searchResults.slice(0, 5).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
                            onClick={() => {
                              console.log(`Navegando al producto: ${product.name}`);
                              setIsSearchOpen(false);
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md bg-muted"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium font-body truncate">
                                {highlightText(product.name, searchQuery)}
                              </p>
                              <p className="text-xs font-body text-muted-foreground">
                                {highlightText(product.category, searchQuery)}
                              </p>
                            </div>
                            <div className="text-sm font-medium font-accent text-blue-600">
                              {formatPrice(product.price)}
                            </div>
                          </div>
                        ))}
                        {searchResults.length > 5 && (
                          <button
                            onClick={() => {
                              console.log(`Ver todos los ${searchResults.length} resultados`);
                              setIsSearchOpen(false);
                            }}
                            className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Ver todos los {searchResults.length} resultados
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sin resultados */}
                  {showResults && searchResults.length === 0 && searchQuery && (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        No se encontraron productos para "{searchQuery}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Intenta con otros términos de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
