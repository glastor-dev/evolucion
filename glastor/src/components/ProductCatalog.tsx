import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { 
  Wrench, 
  Drill, 
  Hammer, 
  Zap, 
  Star, 
  ShoppingCart, 
  Eye,
  Filter,
  Search,
  MessageCircle,
  Truck,
  Shield,
  Heart,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  CreditCard
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { OptimizedImage } from "./OptimizedImage";
import { useProducts, useCategories } from "../hooks/useProducts";

interface Product {
  id: number;
  name: string;
  brand: "Makita" | "Bosch";
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: number;
  freeShipping?: boolean;
  installments?: string;
  seller?: string;
  location?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Taladro Percutor 18V Makita DHP484Z",
    brand: "Makita",
    category: "Taladros",
    price: "€189.99",
    originalPrice: "€219.99",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 124,
    features: ["18V Li-ion", "2 velocidades", "LED integrado"],
    inStock: true,
    isNew: true,
    discount: 14,
    freeShipping: true,
    installments: "12x €15.83",
    seller: "Glastor Tools",
    location: "Barcelona"
  },
  {
    id: 2,
    name: "Sierra Circular Professional Bosch GKS 190",
    brand: "Bosch",
    category: "Sierras",
    price: "€245.50",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
    rating: 4.9,
    reviews: 89,
    features: ["1400W", "Guía láser", "Freno electrónico"],
    inStock: true,
    freeShipping: true,
    installments: "12x €20.46",
    seller: "Glastor Tools",
    location: "Madrid"
  },
  {
    id: 3,
    name: "Martillo Demoledor SDS-Plus Makita HR2630",
    brand: "Makita",
    category: "Martillos",
    price: "€156.75",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 67,
    features: ["800W", "SDS-Plus", "Control de vibración"],
    inStock: true,
    freeShipping: true,
    installments: "6x €26.13",
    seller: "Glastor Tools",
    location: "Valencia"
  },
  {
    id: 4,
    name: "Amoladora Angular 125mm Bosch GWS 1000",
    brand: "Bosch",
    category: "Amoladoras",
    price: "€89.99",
    originalPrice: "€109.99",
    image: "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 156,
    features: ["1000W", "125mm", "Arranque suave"],
    inStock: true,
    discount: 18,
    freeShipping: true,
    installments: "6x €15.00",
    seller: "Glastor Tools",
    location: "Sevilla"
  },
  {
    id: 5,
    name: "Lijadora Orbital Profesional Makita BO5041",
    brand: "Makita",
    category: "Lijadoras",
    price: "€134.99",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 43,
    features: ["200W", "Orbital", "Aspiración de polvo"],
    inStock: false,
    installments: "6x €22.50",
    seller: "Glastor Tools",
    location: "Bilbao"
  },
  {
    id: 6,
    name: "Atornillador de Impacto 18V Bosch GDX 18V-200",
    brand: "Bosch",
    category: "Atornilladores",
    price: "€167.50",
    image: "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 92,
    features: ["18V", "180 Nm", "Brushless"],
    inStock: true,
    isNew: true,
    freeShipping: true,
    installments: "12x €13.96",
    seller: "Glastor Tools",
    location: "Zaragoza"
  },
  {
    id: 7,
    name: "Fresadora de Cantos Makita RT0700CX2",
    brand: "Makita",
    category: "Fresadoras",
    price: "€198.75",
    originalPrice: "€229.99",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 78,
    features: ["710W", "Variable", "Base intercambiable"],
    inStock: true,
    discount: 14,
    freeShipping: true,
    installments: "12x €16.56",
    seller: "Glastor Tools",
    location: "Málaga"
  },
  {
    id: 8,
    name: "Ingletadora Bosch GCM 8 SJL",
    brand: "Bosch",
    category: "Ingletadoras",
    price: "€389.99",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
    rating: 4.9,
    reviews: 134,
    features: ["1600W", "216mm", "Láser integrado"],
    inStock: true,
    freeShipping: true,
    installments: "18x €21.67",
    seller: "Glastor Tools",
    location: "Barcelona"
  },
  {
    id: 9,
    name: "Cepillo Eléctrico Makita KP0800",
    brand: "Makita",
    category: "Cepillos",
    price: "€145.50",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 56,
    features: ["620W", "82mm", "Profundidad ajustable"],
    inStock: true,
    freeShipping: true,
    installments: "6x €24.25",
    seller: "Glastor Tools",
    location: "Valencia"
  },
  {
    id: 10,
    name: "Pistola de Calor Bosch GHG 23-66",
    brand: "Bosch",
    category: "Pistolas",
    price: "€78.99",
    originalPrice: "€94.99",
    image: "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 89,
    features: ["2300W", "Variable", "Pantalla LCD"],
    inStock: true,
    discount: 17,
    freeShipping: true,
    installments: "3x €26.33",
    seller: "Glastor Tools",
    location: "Madrid"
  },
  {
    id: 11,
    name: "Multiherramienta Makita TM3010CX5J",
    brand: "Makita",
    category: "Multiherramientas",
    price: "€234.99",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 67,
    features: ["320W", "Oscilante", "Kit completo"],
    inStock: true,
    freeShipping: true,
    installments: "12x €19.58",
    seller: "Glastor Tools",
    location: "Sevilla"
  },
  {
    id: 12,
    name: "Soldador Inverter Bosch PSI 160",
    brand: "Bosch",
    category: "Soldadores",
    price: "€299.99",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 45,
    features: ["160A", "Inverter", "Portátil"],
    inStock: true,
    freeShipping: true,
    installments: "15x €20.00",
    seller: "Glastor Tools",
    location: "Bilbao"
  }
  ,
  {
    id: 13,
    name: "Clavadora Makita XNB07Z 18V LXT",
    brand: "Makita",
    category: "Clavadoras",
    price: "€329.99",
    image: "https://cdn.makitatools.com/apps/cms/img/xnb/aa90d25a-421b-4cb2-9d3a-c29e9bdb95b5_xnb07z_p_1500px.png",
    rating: 4.7,
    reviews: 93,
    features: ["18V LXT", "Clavadora Brad", "LED"],
    inStock: true,
    freeShipping: true,
    installments: "12x €27.50",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 14,
    name: "Martillo Rotativo Makita GRH08Z 40V XGT",
    brand: "Makita",
    category: "Martillos",
    price: "€459.99",
    originalPrice: "€499.99",
    image: "https://cdn.makitatools.com/apps/cms/img/grh/bb23eead-08e3-4bb3-98fd-5f754343bb7a_grh08z_p_1500px.png",
    rating: 4.9,
    reviews: 152,
    features: ["40V XGT", "SDS-Plus", "Brushless"],
    inStock: true,
    discount: 8,
    freeShipping: true,
    installments: "12x €38.33",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 15,
    name: "Martillo Rotativo Makita GRH06Z 40V XGT",
    brand: "Makita",
    category: "Martillos",
    price: "€429.99",
    image: "https://cdn.makitatools.com/apps/cms/img/grh/f06cc027-8067-4372-a796-0f46720960cb_grh06z_p_1500px.png",
    rating: 4.8,
    reviews: 131,
    features: ["40V XGT", "SDS-Plus", "Antivibración"],
    inStock: true,
    freeShipping: true,
    installments: "12x €35.83",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 16,
    name: "Cortadora Makita XEC01Z 18V X2 (36V)",
    brand: "Makita",
    category: "Sierras",
    price: "€599.99",
    image: "https://cdn.makitatools.com/apps/cms/img/xec/cb9fb5a8-e2ea-4caf-be2d-bd0719500a86_xec01z_p_1500px.png",
    rating: 4.7,
    reviews: 88,
    features: ["18V X2 LXT (36V)", "9\" Cut-Off", "Freno"],
    inStock: true,
    freeShipping: true,
    installments: "18x €33.33",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 17,
    name: "Martillo SDS-Plus Makita XRH01Z 18V",
    brand: "Makita",
    category: "Martillos",
    price: "€239.99",
    image: "https://cdn.makitatools.com/apps/cms/img/xrh/6f85ab58-abee-47c4-bf71-52feefd27502_xrh01z_p_1500px.png",
    rating: 4.6,
    reviews: 120,
    features: ["18V LXT", "SDS-Plus", "Compacto"],
    inStock: true,
    freeShipping: true,
    installments: "12x €20.00",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 18,
    name: "Amoladora Makita GAG07Z 125mm 18V",
    brand: "Makita",
    category: "Amoladoras",
    price: "€199.99",
    image: "https://cdn.makitatools.com/apps/cms/img/gag/bb5f824b-ad68-4851-b006-df2e7ebc292b_gag07z_p_1500px.png",
    rating: 4.7,
    reviews: 110,
    features: ["18V LXT", "Brushless", "Freno"],
    inStock: true,
    freeShipping: true,
    installments: "12x €16.67",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 19,
    name: "Amoladora Makita GAG10Z 125mm 40V",
    brand: "Makita",
    category: "Amoladoras",
    price: "€249.99",
    image: "https://cdn.makitatools.com/apps/cms/img/gag/ab48aad1-249c-4eb4-96d8-3aafdb56a666_gag10z_p_1500px.png",
    rating: 4.8,
    reviews: 95,
    features: ["40V XGT", "Anti-Kickback", "Freno"],
    inStock: true,
    freeShipping: true,
    installments: "12x €20.83",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 20,
    name: "Soplador Makita GOB01Z 40V XGT",
    brand: "Makita",
    category: "Sopladores",
    price: "€299.99",
    image: "https://cdn.makitatools.com/apps/cms/img/gob/93fece89-fbe9-4cd5-9b69-d1d58e36f6c0_gob01z_p_1500px.png",
    rating: 4.5,
    reviews: 73,
    features: ["40V XGT", "Ligero"],
    inStock: true,
    freeShipping: true,
    installments: "12x €25.00",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 21,
    name: "Lijadora de Banda Makita GSB01Z 18V",
    brand: "Makita",
    category: "Lijadoras",
    price: "€279.99",
    image: "https://cdn.makitatools.com/apps/cms/img/gsb/2cbd824f-4806-43c8-94e2-e6f5d8108f06_gsb01z_p_1500px.png",
    rating: 4.6,
    reviews: 68,
    features: ["18V LXT", "Banda"],
    inStock: true,
    freeShipping: true,
    installments: "12x €23.33",
    seller: "Glastor Tools",
    location: "Girona"
  },
  {
    id: 22,
    name: "Kit Aspiradora Makita GCV06T1 40V XGT",
    brand: "Makita",
    category: "Aspiradoras",
    price: "€499.99",
    image: "https://cdn.makitatools.com/apps/cms/img/gcv/3ea34cc4-92f2-44b0-81ca-ceabaceb6251_gcv06t1_k_1500px.png",
    rating: 4.7,
    reviews: 85,
    features: ["40V XGT", "Kit"],
    inStock: true,
    freeShipping: true,
    installments: "18x €27.78",
    seller: "Glastor Tools",
    location: "Girona"
  }
];

const categories = ["Todos", "Taladros", "Sierras", "Martillos", "Amoladoras", "Lijadoras", "Atornilladores", "Fresadoras", "Ingletadoras", "Cepillos", "Pistolas", "Multiherramientas", "Soldadores", "Clavadoras", "Sopladores", "Aspiradoras"];
const brands = ["Todas", "Makita", "Bosch"];

export const ProductCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  // Paginación
  const [page, setPage] = useState(1);
  const pageSize = 12;
  // Ordenamiento
  const [sortOption, setSortOption] = useState<
    "relevance" | "price_asc" | "price_desc" | "rating_desc" | "newest"
  >("relevance");
  const { addItem, openCart } = useCart();
  const { state: favoritesState, addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Categorías desde Strapi y opciones de filtro
  const { categories: apiCategories } = useCategories();
  const categoryOptions = [
    "Todos",
    ...apiCategories.map((c: any) => c?.attributes?.name).filter(Boolean),
  ];

  // Reset de página cuando cambian filtros/búsqueda/ordenamiento
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedBrand, searchTerm, sortOption]);

  const handleAddToCart = async (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image
    });
    openCart();
    // Accesibilidad: anunciar acción para lectores de pantalla
    try {
      const { screenReader } = await import("../utils/accessibility");
      screenReader.announce(`Agregado "${product.name}" al carrito`, "polite");
    } catch (e) {
      // Sin bloqueo si falla la importación dinámica
    }
  };



// Datos desde API con fallback a datos locales
const [searchParams, setSearchParams] = useSearchParams();
const formatCurrency = (value?: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value ?? 0);

// Derivar slug de categoría, marca y sort para el backend Strapi
const selectedCategorySlug = selectedCategory !== "Todos"
  ? apiCategories.find((c: any) => c?.attributes?.name === selectedCategory)?.attributes?.slug
  : undefined;
const brandParam = selectedBrand !== "Todas" ? selectedBrand : undefined;
const sortParam =
  sortOption === "price_asc" ? "price:asc" :
  sortOption === "price_desc" ? "price:desc" :
  sortOption === "newest" ? "createdAt:desc" :
  undefined;

const { products: apiProducts, pagination } = useProducts({
  page,
  pageSize,
  search: searchTerm || undefined,
  category: selectedCategorySlug,
  brand: brandParam,
  sort: sortParam,
});

// Adaptar datos de Strapi al modelo de UI
const mappedProducts: Product[] = (apiProducts ?? []).map((p: any) => {
  const attrs = p?.attributes || {};
  return {
    id: Number(p?.id ?? 0),
    name: attrs?.name ?? "",
    brand: (attrs?.specifications?.brand as "Makita" | "Bosch") ?? "Makita",
    category: attrs?.category?.data?.attributes?.name ?? "Otros",
    price: typeof attrs?.price === "number" ? formatCurrency(attrs.price) : formatCurrency(0),
    originalPrice: typeof attrs?.discountPrice === "number" ? formatCurrency(attrs.discountPrice) : undefined,
    image: attrs?.images?.data?.[0]?.attributes?.url ?? "https://via.placeholder.com/300",
    rating: 4.7,
    reviews: 0,
    features: Array.isArray(attrs?.tags) ? attrs.tags : [],
    inStock: (attrs?.stock ?? 0) > 0,
    isNew: false,
    discount: undefined,
    freeShipping: true,
    installments: undefined,
    seller: "Glastor Tools",
    location: "Colombia",
  };
});
const baseProducts = mappedProducts.length > 0 ? mappedProducts : products;

const filteredProducts = baseProducts.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "Todas" || product.brand === selectedBrand;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });
  // Helpers para ordenamiento
  const parsePrice = (priceStr: string) => {
    const cleaned = priceStr.replace(/[^\d.,]/g, "");
    // Si tiene coma y no punto, tratamos la coma como decimal
    if (cleaned.includes(",") && !cleaned.includes(".")) {
      return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
    }
    return parseFloat(cleaned.replace(/,/g, ""));
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return parsePrice(a.price) - parsePrice(b.price);
      case "price_desc":
        return parsePrice(b.price) - parsePrice(a.price);
      case "rating_desc":
        return b.rating - a.rating;
      case "newest":
        // Priorizar novedades (isNew), luego por reseñas como fallback de relevancia
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.reviews - a.reviews;
      default:
        return 0; // relevancia original
    }
  });

const totalPages = (pagination?.pageCount ?? Math.ceil(sortedProducts.length / pageSize)) || 1;

// Sincroniza página y búsqueda con la URL (?page=&q=)
useEffect(() => {
  const params = new URLSearchParams(searchParams);
  params.set("page", String(page));
  if (searchTerm) {
    params.set("q", searchTerm);
  } else {
    params.delete("q");
  }
  if (selectedCategorySlug) {
    params.set("category", selectedCategorySlug);
  } else {
    params.delete("category");
  }
  if (brandParam) {
    params.set("brand", brandParam);
  } else {
    params.delete("brand");
  }
  setSearchParams(params, { replace: true });
}, [page, searchTerm, selectedCategory, selectedBrand, apiCategories]);

// Inicializar estado desde la URL (page, q, category, brand)
useEffect(() => {
  const pageParam = searchParams.get("page");
  const qParam = searchParams.get("q");
  const catParam = searchParams.get("category");
  const brandFromUrl = searchParams.get("brand");
  if (pageParam) setPage(Number(pageParam));
  if (qParam) setSearchTerm(qParam);
  if (brandFromUrl) setSelectedBrand(brandFromUrl);
  if (catParam && apiCategories?.length) {
    const catName = apiCategories.find((c: any) => c?.attributes?.slug === catParam)?.attributes?.name;
    if (catName) setSelectedCategory(catName);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [apiCategories]);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  // (Eliminado) Scroll infinito

  const getBrandColor = (brand: "Makita" | "Bosch") => {
    return brand === "Makita" 
      ? "bg-teal-500 text-white" 
      : "bg-blue-600 text-white";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Taladros": return <Drill className="w-4 h-4" />;
      case "Sierras": return <Wrench className="w-4 h-4" />;
      case "Martillos": return <Hammer className="w-4 h-4" />;
      case "Amoladoras": return <Zap className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  return (
      <section id="productos" className="container py-24 sm:py-32 bg-black min-h-screen">
      <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Catálogo de Productos
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Distribuidores oficiales de <strong className="text-white">Makita</strong> y <strong className="text-white">Bosch</strong>. 
            Herramientas profesionales de la más alta calidad para todos tus proyectos.
          </p>
        </div>

      {/* Filtros */}
        <div className="mb-8 space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* Filtros de categoría y marca */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Categoría:</span>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Marca:</span>
              <div className="flex gap-2">
                {brands.map((brand) => (
                  <Button
                    key={brand}
                    variant={selectedBrand === brand ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedBrand(brand)}
                    className="text-xs"
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Ordenar:</span>
              <select
                aria-label="Ordenar productos"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="text-xs bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevancia</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="rating_desc">Rating</option>
                <option value="newest">Novedades</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="text-center text-sm text-gray-400 mb-4">
          {pagination?.total ? (
            <span>{pagination.total} resultados</span>
          ) : (
            <span>{sortedProducts.length} resultados</span>
          )}
        </div>

        {/* Grid de productos estilo MercadoLibre */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
        {displayedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-gray-200 hover:border-gray-300 relative">
            {/* Botón de favoritos */}
            <button
              onClick={() => {
                if (isFavorite(product.id)) {
                  removeFavorite(product.id);
                } else {
                  addFavorite({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                  });
                }
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all duration-200"
            >
              <Heart 
                className={`w-4 h-4 ${
                  favoritesState.items.some(item => item.id === product.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            </button>

            <div className="relative">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
              />
              
              {/* Badges superiores */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.discount && (
                  <Badge className="bg-orange-500 text-white font-bold text-xs px-2 py-1">
                    {product.discount}% OFF
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-blue-500 text-white font-bold text-xs px-2 py-1">
                    NUEVO
                  </Badge>
                )}
                {product.freeShipping && (
                  <Badge className="bg-green-500 text-white font-bold text-xs px-2 py-1 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    ENVÍO GRATIS
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              {/* Precio principal */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                {product.installments && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CreditCard className="w-3 h-3" />
                    <span>en {product.installments} sin interés</span>
                  </div>
                )}
              </div>

              {/* Envío gratis */}
              {product.freeShipping && (
                <div className="flex items-center gap-1 text-green-600 text-sm mb-2">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Envío gratis</span>
                </div>
              )}

              {/* Título del producto */}
              <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                {product.name}
              </h3>

              {/* Rating y reseñas */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviews})
                </span>
              </div>

              {/* Información del vendedor */}
              <div className="text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>por {product.seller}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{product.location}</span>
                </div>
              </div>

              {/* Estado de stock */}
              <div className="mb-3">
                {product.inStock ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Stock disponible</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Sin stock</span>
                  </div>
                )}
              </div>

              {/* Características principales */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Confianza y beneficios */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span>Garantía oficial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-blue-600" />
                    <span>Pago seguro</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  disabled={!product.inStock}
                  onClick={() => product.inStock && handleAddToCart(product)}
                >
                  {product.inStock ? "Comprar ahora" : "Sin stock"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!product.inStock}
                  onClick={() => product.inStock && handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Agregar al carrito
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
        {totalPages > 1 && (
          <nav aria-label="Paginación" className="flex justify-center items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                aria-label={`Ir a la página ${p}`}
                aria-current={p === page ? "page" : undefined}
                className="text-xs"
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Página siguiente"
            >
              Siguiente
            </Button>
          </nav>
        )}
        
    </section>
  );
};