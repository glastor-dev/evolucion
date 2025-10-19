import React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import { cn } from "../../lib/utils";

interface ThemeToggleProps {
  variant?: "button" | "dropdown" | "compact";
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "button",
  className,
  showLabel = false,
}) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  if (variant === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Seleccionar tema"
        >
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
          <option value="system">Sistema</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {theme === "light" && <Sun className="h-4 w-4 text-gray-400" />}
          {theme === "dark" && <Moon className="h-4 w-4 text-gray-400" />}
          {theme === "system" && <Monitor className="h-4 w-4 text-gray-400" />}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors",
          className
        )}
        aria-label={`Cambiar tema. Tema actual: ${theme === "system" ? "sistema" : theme === "light" ? "claro" : "oscuro"}`}
        title="Cambiar tema"
      >
        {actualTheme === "light" ? (
          <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        )}
      </button>
    );
  }

  // Variant 'button' (default)
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            theme === "light"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Tema claro"
          aria-pressed={theme === "light"}
        >
          <Sun className="h-4 w-4" />
          {showLabel && <span className="ml-2">Claro</span>}
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            theme === "dark"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Tema oscuro"
          aria-pressed={theme === "dark"}
        >
          <Moon className="h-4 w-4" />
          {showLabel && <span className="ml-2">Oscuro</span>}
        </button>

        <button
          onClick={() => setTheme("system")}
          className={cn(
            "inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            theme === "system"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Tema del sistema"
          aria-pressed={theme === "system"}
        >
          <Monitor className="h-4 w-4" />
          {showLabel && <span className="ml-2">Sistema</span>}
        </button>
      </div>
    </div>
  );
};

// Componente simple para usar en el navbar
export const NavbarThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200",
        className
      )}
      aria-label={`Cambiar a tema ${actualTheme === "light" ? "oscuro" : "claro"}`}
      title="Cambiar tema"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 h-5 w-5 text-yellow-500 transition-all duration-300 transform",
            actualTheme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 h-5 w-5 text-blue-500 transition-all duration-300 transform",
            actualTheme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
    </button>
  );
};
