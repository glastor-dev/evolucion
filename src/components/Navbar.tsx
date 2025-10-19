import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { motion } from "framer-motion";
import { handleSmoothNavigation } from "../utils/navigation";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import "../styles/cinema-system.css";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "../assets/LOGO-1080-RGB.png";
import { MobileMenu, HamburgerButton, BottomNav } from "./MobileMenu";
import { SearchButton } from "./SearchButton";

// Logo principal (mismo que Footer)

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/about",
    label: "Acerca de",
  },
  {
    href: "/servicios",
    label: "Servicios",
  },
  {
    href: "/tienda",
    label: "Tienda",
  },
];

export const Navbar = () => {
  const MotionLink = motion.create(Link);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { state, openCart } = useCart();
  const { state: favState, togglePanel, openPanel } = useFavorites();
  const { user, loading: authLoading, logout } = useAuth();
  const cartItems = state?.items || [];
  const totalCartUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Efectos de scroll para el navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clearGlobalStepQuery = () => {
    if (window.location.search && window.location.search.length > 0) {
      const { origin, pathname, hash } = window.location;
      // Quitar cualquier query global por completo y mantener el hash actual
      window.history.replaceState(null, "", `${origin}${pathname}${hash}`);
    }
    // Detener experiencia y evitar que siga tocando la URL fuera de Home
    try {
      sessionStorage.removeItem("process-experience");
    } catch {}
  };

  const goHomeAndScrollTo = (hash: string, after?: () => void) => {
    const targetId = hash.startsWith("#") ? hash.substring(1) : hash;
    // En BrowserRouter, determinar Home por pathname
    const isHome = location.pathname === "/";
    if (isHome) {
      // Ya estamos en Home: scroll suave directo
      handleSmoothNavigation(`#${targetId}`, after);
    } else {
      // Guardar destino y navegar a Home; HomePage hará el scroll
      try {
        sessionStorage.setItem("pending-scroll-target", targetId);
      } catch {}
      if (after) after();
      navigate({ pathname: "/", search: `?target=${encodeURIComponent(targetId)}` });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? "cinema-glass-heavy border-b border-white/10" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Partículas de fondo */}
      {/* <div className="cinema-particles cinema-absolute cinema-full cinema-pointer-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="cinema-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div> */}

  {/* Grid cinematográfico (sin capturar clics) */}
  {/* <div className="cinema-grid pointer-events-none" /> */}

      <div className="mx-auto cinema-relative cinema-z-3">
        <div className="container h-16 px-4 w-screen flex justify-between items-center">
          <div className="font-bold flex">
            <MotionLink 
              to="/"
              className="ml-2 font-bold text-xl flex items-center cinema-text-glow cinema-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img
                src={logoImage}
                alt="Glastor"
                className="h-8 w-auto mr-3 object-contain"
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Título removido a pedido: solo logo visible */}
            </MotionLink>
          </div>

          {/* mobile */}
          <span className="flex md:hidden items-center gap-1">
            {/* Search Button Mobile */}
            <SearchButton />
            
            <ModeToggle />

            {/* Hamburger Button - Nuevo menú mejorado */}
            <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </span>

          {/* desktop */}
          <div className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => {
              if (route.href.startsWith("#")) {
                return (
                  <button
                    key={i}
                    onClick={() => goHomeAndScrollTo(route.href)}
                    className={`text-[17px] ${buttonVariants({
                      variant: "ghost",
                    })}`}
                  >
                    {route.label}
                  </button>
                );
              }
              return (
                <Link
                  to={route.href}
                  key={i}
                  className={`text-[17px] ${buttonVariants({
                    variant: "ghost",
                  })}`}
                >
                  {route.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex gap-2 items-center">
            {/* Search Button */}
            <SearchButton />

            {/* Auth (desktop): mostrar solo si hay usuario (perfil + logout) */}
            {!authLoading && user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/perfil"
                  className={`text-[15px] ${buttonVariants({ variant: "ghost" })}`}
                >
                  Perfil
                </Link>
                <span className="text-sm text-slate-400 hidden lg:inline">{user.displayName || user.email}</span>
                <button
                  aria-label="Cerrar sesión"
                  onClick={logout}
                  className={`relative ${buttonVariants({ variant: "ghost" })}`}
                  title="Cerrar sesión"
                >
                  <img src={user.photoURL || "/vite.svg"} alt="avatar" className="w-7 h-7 rounded-full" />
                </button>
              </div>
            )}
            {/* Favoritos (desktop) */}
            <button
              aria-label="Abrir favoritos"
              className={`relative ${buttonVariants({ variant: "ghost" })}`}
              onClick={openPanel}
            >
              <Heart className="w-5 h-5" />
              {favState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {Math.min(favState.items.length, 9)}
                </span>
              )}
            </button>

            {/* Carrito (desktop) */}
            <button
              aria-label="Abrir carrito"
              className={`relative ${buttonVariants({ variant: "ghost" })}`}
              onClick={openCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartUnits > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {totalCartUnits > 9 ? "9+" : totalCartUnits}
                </span>
              )}
            </button>

            <a
              rel="noreferrer noopener"
              href="https://github.com/leoMirandaa/shadcn-landing-page.git"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </a>

            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        onMenuClick={() => setIsOpen(true)}
        onFavoritesClick={openPanel}
        onCartClick={openCart}
        favoritesCount={favState.items.length}
        cartCount={totalCartUnits}
      />
    </header>
  );
};
