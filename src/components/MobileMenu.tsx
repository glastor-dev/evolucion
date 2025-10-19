import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, Heart, User, X } from "lucide-react";
import { handleSmoothNavigation } from "../utils/navigation";
import { useAuth } from "../contexts/AuthContext";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/",
    label: "Inicio",
  },
  {
    href: "/tienda",
    label: "Tienda",
  },
  {
    href: "#servicios",
    label: "Servicios",
  },
  {
    href: "#nuestros-numeros",
    label: "Acerca de",
  },
  {
    href: "#testimonials",
    label: "Testimonios",
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const goHomeAndScrollTo = (hash: string) => {
    const targetId = hash.startsWith("#") ? hash.substring(1) : hash;
    const isHome = location.pathname === "/";
    
    if (isHome) {
      handleSmoothNavigation(`#${targetId}`, onClose);
    } else {
      try {
        sessionStorage.setItem("pending-scroll-target", targetId);
      } catch {}
      onClose();
      navigate({ pathname: "/", search: `?target=${encodeURIComponent(targetId)}` });
    }
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      goHomeAndScrollTo(href);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background border-r border-border z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-bold">Menú</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 border-b border-border bg-accent/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || "/vite.svg"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border-2 border-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.displayName || "Usuario"}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {routeList.map((route, index) => {
                    const isActive = location.pathname === route.href;
                    
                    return (
                      <motion.div
                        key={route.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {route.href.startsWith("#") ? (
                          <button
                            onClick={() => handleNavigation(route.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            <span className="text-base font-medium">{route.label}</span>
                          </button>
                        ) : (
                          <Link
                            to={route.href}
                            onClick={() => handleNavigation(route.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            <span className="text-base font-medium">{route.label}</span>
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/perfil"
                      onClick={onClose}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Ver Perfil</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Iniciar Sesión</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hamburger Menu Button Component
interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <motion.span
          animate={
            isOpen
              ? { rotate: 45, y: 8 }
              : { rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3 }}
          className="w-full h-0.5 bg-foreground rounded-full origin-left"
        />
        <motion.span
          animate={
            isOpen
              ? { opacity: 0, x: -10 }
              : { opacity: 1, x: 0 }
          }
          transition={{ duration: 0.3 }}
          className="w-full h-0.5 bg-foreground rounded-full"
        />
        <motion.span
          animate={
            isOpen
              ? { rotate: -45, y: -8 }
              : { rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3 }}
          className="w-full h-0.5 bg-foreground rounded-full origin-left"
        />
      </div>
    </button>
  );
};

// Bottom Navigation Component
interface BottomNavProps {
  onMenuClick: () => void;
  onFavoritesClick: () => void;
  onCartClick: () => void;
  favoritesCount: number;
  cartCount: number;
}

export const BottomNav = ({ 
  onMenuClick, 
  onFavoritesClick, 
  onCartClick,
  favoritesCount,
  cartCount 
}: BottomNavProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      icon: Home,
      label: "Inicio",
      path: "/",
      onClick: () => {},
    },
    {
      icon: ShoppingBag,
      label: "Tienda",
      path: "/tienda",
      onClick: () => {},
    },
    {
      icon: Heart,
      label: "Favoritos",
      path: null,
      onClick: onFavoritesClick,
      badge: favoritesCount,
    },
    {
      icon: User,
      label: user ? "Perfil" : "Cuenta",
      path: user ? "/perfil" : "/login",
      onClick: () => {},
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-border shadow-2xl"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path || "#"}
              onClick={(e) => {
                if (item.onClick && !item.path) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              className="flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
