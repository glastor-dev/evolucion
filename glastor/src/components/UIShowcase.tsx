import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Heart, 
  Star, 
  ShoppingCart, 
  User, 
  Settings, 
  Bell, 
  Check, 
  X, 
  Plus, 
  Minus,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Upload,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Sparkles
} from 'lucide-react';

// Tipos para las props de los componentes
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'gradient' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  onClick?: () => void;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'outline' | 'glass' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'colored' | 'outlined' | 'filled' | 'minimal' | 'gradient';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

// Componente Button moderno
export const ModernButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'md',
  onClick,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  };

  const variantClasses = {
    primary: 'bg-vue-primary hover:bg-vue-secondary text-white shadow-lg hover:shadow-xl focus:ring-vue-primary/50 hover:scale-105',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-md hover:shadow-lg focus:ring-gray-500/50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white',
    outline: 'border-2 border-vue-primary text-vue-primary hover:bg-vue-primary hover:text-white focus:ring-vue-primary/50 hover:scale-105',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/50 dark:text-gray-300 dark:hover:bg-gray-800',
    destructive: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl focus:ring-red-500/50 hover:scale-105',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl focus:ring-green-500/50 hover:scale-105',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500/50 hover:scale-105',
    gradient: 'bg-gradient-to-r from-vue-primary to-vue-secondary hover:from-vue-secondary hover:to-vue-primary text-white shadow-lg hover:shadow-xl focus:ring-vue-primary/50 hover:scale-105',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl focus:ring-white/50',
    neon: 'bg-vue-primary text-white shadow-lg shadow-vue-primary/50 hover:shadow-vue-primary/70 hover:shadow-xl focus:ring-vue-primary/50 animate-pulse hover:animate-none hover:scale-105'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${roundedClasses[rounded]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </div>
    </button>
  );
};

// Componente Badge moderno
export const ModernBadge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-300';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 rounded-full dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-vue-primary/10 text-vue-primary border border-vue-primary/20 rounded-full',
    secondary: 'bg-gray-500/10 text-gray-700 border border-gray-500/20 rounded-full dark:text-gray-300',
    success: 'bg-green-500/10 text-green-700 border border-green-500/20 rounded-full dark:text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 rounded-full dark:text-yellow-400',
    error: 'bg-red-500/10 text-red-700 border border-red-500/20 rounded-full dark:text-red-400',
    info: 'bg-blue-500/10 text-blue-700 border border-blue-500/20 rounded-full dark:text-blue-400',
    gradient: 'bg-gradient-to-r from-vue-primary/20 to-vue-secondary/20 text-vue-primary border border-vue-primary/30 rounded-full',
    outline: 'border-2 border-vue-primary text-vue-primary rounded-full hover:bg-vue-primary hover:text-white',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full',
    pulse: 'bg-vue-primary text-white rounded-full animate-pulse shadow-lg shadow-vue-primary/50'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {icon && icon}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// Componente Tag moderno
export const ModernTag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  color = 'blue',
  size = 'md',
  interactive = false,
  selected = false,
  onClick,
  className = ''
}) => {
  const baseClasses = `inline-flex items-center font-medium transition-all duration-300 ${interactive ? 'cursor-pointer hover:scale-105' : ''}`;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorVariants = {
    blue: {
      default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      colored: 'bg-blue-500 text-white',
      outlined: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
      filled: 'bg-blue-500/20 text-blue-700 border border-blue-500/30 dark:text-blue-400',
      minimal: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20',
      gradient: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
    },
    green: {
      default: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      colored: 'bg-green-500 text-white',
      outlined: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
      filled: 'bg-green-500/20 text-green-700 border border-green-500/30 dark:text-green-400',
      minimal: 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20',
      gradient: 'bg-gradient-to-r from-green-400 to-green-600 text-white'
    },
    red: {
      default: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      colored: 'bg-red-500 text-white',
      outlined: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
      filled: 'bg-red-500/20 text-red-700 border border-red-500/30 dark:text-red-400',
      minimal: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
      gradient: 'bg-gradient-to-r from-red-400 to-red-600 text-white'
    },
    yellow: {
      default: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      colored: 'bg-yellow-500 text-white',
      outlined: 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white',
      filled: 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30 dark:text-yellow-400',
      minimal: 'text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
      gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    },
    purple: {
      default: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      colored: 'bg-purple-500 text-white',
      outlined: 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white',
      filled: 'bg-purple-500/20 text-purple-700 border border-purple-500/30 dark:text-purple-400',
      minimal: 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20',
      gradient: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
    },
    pink: {
      default: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      colored: 'bg-pink-500 text-white',
      outlined: 'border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white',
      filled: 'bg-pink-500/20 text-pink-700 border border-pink-500/30 dark:text-pink-400',
      minimal: 'text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-900/20',
      gradient: 'bg-gradient-to-r from-pink-400 to-pink-600 text-white'
    },
    indigo: {
      default: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      colored: 'bg-indigo-500 text-white',
      outlined: 'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white',
      filled: 'bg-indigo-500/20 text-indigo-700 border border-indigo-500/30 dark:text-indigo-400',
      minimal: 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20',
      gradient: 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white'
    },
    gray: {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      colored: 'bg-gray-500 text-white',
      outlined: 'border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white',
      filled: 'bg-gray-500/20 text-gray-700 border border-gray-500/30 dark:text-gray-400',
      minimal: 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/20',
      gradient: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
    }
  };

  const selectedClass = selected ? 'ring-2 ring-offset-2 ring-vue-primary' : '';
  const roundedClass = 'rounded-full';

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${colorVariants[color][variant]} ${roundedClass} ${selectedClass} ${className}`}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </span>
  );
};

// Componente principal UIShowcase
export const UIShowcase: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['React']);
  const [loading, setLoading] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleButtonClick = (buttonName: string) => {
    setLoading(buttonName);
    setTimeout(() => setLoading(null), 2000);
  };

  return (
    <section className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
          Componentes UI Modernos
        </h2>
        <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
          Colección de botones, badges y etiquetas reutilizables con diseños modernos y profesionales
        </p>
      </div>

      <div className="space-y-16">
        {/* Sección de Botones */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-8 text-center">Botones Modernos</h3>
          
          {/* Botones Primarios */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Variantes Principales</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernButton 
                variant="primary" 
                icon={<Play className="w-4 h-4" />}
                loading={loading === 'primary'}
                onClick={() => handleButtonClick('primary')}
              >
                Primario
              </ModernButton>
              <ModernButton 
                variant="secondary"
                icon={<Settings className="w-4 h-4" />}
              >
                Secundario
              </ModernButton>
              <ModernButton 
                variant="outline"
                icon={<Download className="w-4 h-4" />}
              >
                Outline
              </ModernButton>
              <ModernButton 
                variant="ghost"
                icon={<Eye className="w-4 h-4" />}
              >
                Ghost
              </ModernButton>
            </div>
          </div>

          {/* Botones de Estado */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Estados y Acciones</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernButton 
                variant="success"
                icon={<Check className="w-4 h-4" />}
              >
                Éxito
              </ModernButton>
              <ModernButton 
                variant="warning"
                icon={<Bell className="w-4 h-4" />}
              >
                Advertencia
              </ModernButton>
              <ModernButton 
                variant="destructive"
                icon={<Trash2 className="w-4 h-4" />}
              >
                Eliminar
              </ModernButton>
              <ModernButton 
                variant="gradient"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Gradiente
              </ModernButton>
            </div>
          </div>

          {/* Botones Especiales */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Efectos Especiales</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernButton 
                variant="glass"
                icon={<Shield className="w-4 h-4" />}
              >
                Glass
              </ModernButton>
              <ModernButton 
                variant="neon"
                icon={<Zap className="w-4 h-4" />}
              >
                Neon
              </ModernButton>
            </div>
          </div>

          {/* Tamaños */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Diferentes Tamaños</h4>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <ModernButton size="sm" icon={<Plus className="w-3 h-3" />}>
                Pequeño
              </ModernButton>
              <ModernButton size="md" icon={<Heart className="w-4 h-4" />}>
                Mediano
              </ModernButton>
              <ModernButton size="lg" icon={<Star className="w-5 h-5" />}>
                Grande
              </ModernButton>
              <ModernButton size="xl" icon={<Award className="w-6 h-6" />}>
                Extra Grande
              </ModernButton>
            </div>
          </div>

          {/* Botones con Iconos */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Con Iconos</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernButton 
                icon={<ShoppingCart className="w-4 h-4" />}
                iconPosition="left"
              >
                Añadir al Carrito
              </ModernButton>
              <ModernButton 
                variant="outline"
                icon={<Share2 className="w-4 h-4" />}
                iconPosition="right"
              >
                Compartir
              </ModernButton>
              <ModernButton 
                variant="secondary"
                icon={<ExternalLink className="w-4 h-4" />}
                iconPosition="right"
              >
                Abrir Enlace
              </ModernButton>
            </div>
          </div>
        </div>

        {/* Sección de Badges */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-8 text-center">Badges Profesionales</h3>
          
          {/* Badges Básicos */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Variantes Básicas</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernBadge variant="default">Default</ModernBadge>
              <ModernBadge variant="primary" icon={<Star className="w-3 h-3" />}>
                Destacado
              </ModernBadge>
              <ModernBadge variant="secondary">Secundario</ModernBadge>
              <ModernBadge variant="outline">Outline</ModernBadge>
            </div>
          </div>

          {/* Badges de Estado */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Estados</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernBadge variant="success" icon={<Check className="w-3 h-3" />}>
                Completado
              </ModernBadge>
              <ModernBadge variant="warning" icon={<Clock className="w-3 h-3" />}>
                Pendiente
              </ModernBadge>
              <ModernBadge variant="error" icon={<X className="w-3 h-3" />}>
                Error
              </ModernBadge>
              <ModernBadge variant="info" icon={<Bell className="w-3 h-3" />}>
                Información
              </ModernBadge>
            </div>
          </div>

          {/* Badges Especiales */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Efectos Especiales</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernBadge variant="gradient" icon={<TrendingUp className="w-3 h-3" />}>
                Tendencia
              </ModernBadge>
              <ModernBadge variant="glass" icon={<Shield className="w-3 h-3" />}>
                Premium
              </ModernBadge>
              <ModernBadge variant="pulse" icon={<Zap className="w-3 h-3" />}>
                En Vivo
              </ModernBadge>
            </div>
          </div>

          {/* Badges Removibles */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Removibles</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernBadge variant="primary" removable>
                JavaScript
              </ModernBadge>
              <ModernBadge variant="success" removable>
                React
              </ModernBadge>
              <ModernBadge variant="info" removable>
                TypeScript
              </ModernBadge>
            </div>
          </div>
        </div>

        {/* Sección de Tags */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-8 text-center">Etiquetas Interactivas</h3>
          
          {/* Tags por Color */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Colores Disponibles</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernTag color="blue" variant="filled">Azul</ModernTag>
              <ModernTag color="green" variant="filled">Verde</ModernTag>
              <ModernTag color="red" variant="filled">Rojo</ModernTag>
              <ModernTag color="yellow" variant="filled">Amarillo</ModernTag>
              <ModernTag color="purple" variant="filled">Púrpura</ModernTag>
              <ModernTag color="pink" variant="filled">Rosa</ModernTag>
              <ModernTag color="indigo" variant="filled">Índigo</ModernTag>
              <ModernTag color="gray" variant="filled">Gris</ModernTag>
            </div>
          </div>

          {/* Tags por Variante */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Variantes de Estilo</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <ModernTag variant="default" color="blue">Default</ModernTag>
              <ModernTag variant="colored" color="green">Colored</ModernTag>
              <ModernTag variant="outlined" color="red">Outlined</ModernTag>
              <ModernTag variant="filled" color="purple">Filled</ModernTag>
              <ModernTag variant="minimal" color="indigo">Minimal</ModernTag>
              <ModernTag variant="gradient" color="pink">Gradient</ModernTag>
            </div>
          </div>

          {/* Tags Interactivos */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-vue-primary">Selección Múltiple</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              {['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'TypeScript', 'JavaScript'].map((tech) => (
                <ModernTag
                  key={tech}
                  variant="outlined"
                  color="blue"
                  interactive
                  selected={selectedTags.includes(tech)}
                  onClick={() => handleTagClick(tech)}
                >
                  {tech}
                </ModernTag>
              ))}
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Seleccionados: {selectedTags.join(', ') || 'Ninguno'}
            </p>
          </div>
        </div>

        {/* Ejemplos de Uso Combinado */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-8 text-center">Ejemplos de Uso</h3>
          
          {/* Card de Producto */}
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold">Producto Premium</h4>
              <ModernBadge variant="success" size="sm">En Stock</ModernBadge>
            </div>
            <p className="text-muted-foreground mb-4">
              Descripción del producto con características destacadas.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <ModernTag variant="minimal" color="blue" size="sm">Premium</ModernTag>
              <ModernTag variant="minimal" color="green" size="sm">Eco-friendly</ModernTag>
              <ModernTag variant="minimal" color="purple" size="sm">Nuevo</ModernTag>
            </div>
            <div className="flex gap-2">
              <ModernButton 
                variant="primary" 
                size="sm" 
                icon={<ShoppingCart className="w-4 h-4" />}
                fullWidth
              >
                Añadir al Carrito
              </ModernButton>
              <ModernButton 
                variant="outline" 
                size="sm" 
                icon={<Heart className="w-4 h-4" />}
              >
                Guardar
              </ModernButton>
            </div>
          </div>

          {/* Panel de Notificaciones */}
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Notificaciones</h4>
              <ModernBadge variant="pulse" size="sm">3</ModernBadge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <ModernBadge variant="info" size="sm" icon={<Mail className="w-3 h-3" />}>
                    Email
                  </ModernBadge>
                  <span className="text-sm">Nuevo mensaje recibido</span>
                </div>
                <ModernButton variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </ModernButton>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <ModernBadge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>
                    Sistema
                  </ModernBadge>
                  <span className="text-sm">Mantenimiento programado</span>
                </div>
                <ModernButton variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </ModernButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};