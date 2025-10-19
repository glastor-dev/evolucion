import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from '../contexts/FavoritesContext';
import { getProductById } from '../services/localProducts';
import { Helmet } from 'react-helmet-async';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeletons';
import { useToastHelpers } from '../components/ui/toast';
import { cn } from '../lib/utils';
import RecommendedProducts from '../components/shop/RecommendedProducts';
import { ImageGallery } from '../components/ui/ImageGallery';
import { ReviewsSection } from '../components/shop/ReviewsSection';

// Tipos
interface ProductImage {
  url: string;
  alt: string;
}

const ProductBenefits: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {[
      { icon: "🚚", title: "Envío Gratis", desc: "En compras mayores a $50.000" },
      { icon: "🔒", title: "Pago Seguro", desc: "Transacciones encriptadas" },
      { icon: "⚡", title: "Stock Inmediato", desc: "Entrega en 24-48hs" },
      { icon: "✨", title: "Garantía Oficial", desc: "12 meses de garantía" },
    ].map((benefit, idx) => (
      <Card 
        key={idx} 
        className={cn(
          "p-4 text-center transition-transform duration-200 hover:scale-105",
          "sm:hover:shadow-lg"
        )}
      >
        <div className="text-2xl mb-2">{benefit.icon}</div>
        <h4 className="font-semibold text-sm">{benefit.title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">{benefit.desc}</p>
      </Card>
    ))}
  </div>
);

const ProductRating: React.FC<{ rating: number; reviews: number }> = ({ rating, reviews }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, idx) => (
        <svg
          key={idx}
          className={cn(
            "h-4 w-4",
            idx < rating ? "text-yellow-400" : "text-gray-300"
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-400">
      ({reviews} reseñas)
    </span>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailModern: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToFavorites, isFavorite } = useFavorites();
  const { success } = useToastHelpers();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const maxQuantity = product?.stockQuantity || 1;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        console.error('No se proporcionó ID de producto');
        navigate('/tienda');
        return;
      }

      try {
        const productData = await getProductById(id);
        console.log('Datos del producto cargados:', productData);

        if (!productData) {
          console.error('Producto no encontrado');
          navigate('/tienda');
          return;
        }

        // Asegurarse de que imageGallery sea un array de strings
        const formattedGallery = (productData.imageGallery || []).map((img: any) => 
          typeof img === 'string' ? img : img.url || ''
        ).filter(Boolean);

        // Establecer una imagen por defecto si no hay imágenes
        const defaultImage = 'https://via.placeholder.com/400x400?text=Imagen+no+disponible';

        // Formatear los datos del producto
        const formattedProduct = {
          ...productData,
          imageGallery: formattedGallery.length > 0 ? formattedGallery : [defaultImage],
          image: formattedGallery[0] || defaultImage,
          price: Number(productData.price) || 0,
          oldPrice: Number(productData.originalPrice) || 0,
          stockQuantity: productData.stockQuantity ?? 22,
          inStock: productData.inStock ?? true,
          features: productData.features || [],
          specifications: productData.specifications || {},
          description: productData.description || 'No hay descripción disponible'
        };

        setProduct(formattedProduct);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setLoading(false);
        navigate('/tienda');
      }
    };
  
    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) {
      success("Error", "No se pudo agregar el producto al carrito");
      return;
    }

    if (quantity > maxQuantity) {
      success("Error", `Solo hay ${maxQuantity} unidades disponibles`);
      return;
    }

    if (quantity <= 0) {
      success("Error", "La cantidad debe ser mayor a 0");
      return;
    }

    try {
      addItem({
        id: String(product.id),
        name: product.name,
        brand: product.brand || 'Sin marca',
        price: Number(product.price),
        image: product.image,
        quantity: quantity
      });

      success(
        "¡Producto agregado!",
        `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} ${quantity === 1 ? 'se agregó' : 'se agregaron'} a tu carrito`
      );
      setQuantity(1);
    } catch (error) {
      success("Error", "No se pudo agregar el producto al carrito");
    }
  };

  const handleAddToFavorites = () => {
    if (!product) {
      success("Error", "No se pudo procesar la operación");
      return;
    }

    try {
      const isCurrentlyFavorite = isFavorite(product.id);
      addToFavorites({
        id: Number(product.id),
        name: product.name,
        brand: product.brand || 'Sin marca',
        price: product.price.toString(),
        image: product.image,
        category: product.category || 'Sin categoría'
      });

      success(
        isCurrentlyFavorite ? "Eliminado de favoritos" : "¡Agregado a favoritos!",
        `${product.name} se ${isCurrentlyFavorite ? 'eliminó de' : 'agregó a'} tu lista de favoritos`
      );
    } catch (error) {
      success("Error", "No se pudo procesar la operación de favoritos");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!product) return null;

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Glastor`}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} | Glastor`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <nav className="mb-4 hidden text-sm sm:mb-8 sm:block">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-gray-500 hover:text-gray-700">Inicio</a></li>
            <li><span className="text-gray-500">/</span></li>
            <li><a href="/tienda" className="text-gray-500 hover:text-gray-700">Tienda</a></li>
            <li><span className="text-gray-500">/</span></li>
            <li><span className="text-gray-900">{product.name}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          <ImageGallery 
            images={product.imageGallery}
            alt={product.name}
            enableZoom={true}
            enableFullscreen={true}
            showThumbnails={true}
            className="w-full h-full"
            enableDownload={false}
            lazyLoadingStrategy="progressive"
          />

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                {product.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <ProductRating rating={4.5} reviews={12} />
                <Badge 
                  variant={product.stockQuantity > 0 ? "success" : "destructive"}
                  className={cn(
                    product.stockQuantity > 0 && "animate-pulse"
                  )}
                >
                  {product.stockQuantity > 0 ? 'En Stock' : 'Sin Stock'}
                </Badge>
                {product.sku && (
                  <span className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 sm:p-6">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                  ${product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-gray-500 line-through sm:text-lg">
                    ${product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Stock disponible: {product.stockQuantity || 0} unidades
                </span>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxQuantity}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.stockQuantity || quantity > maxQuantity}
                  className="flex-1 bg-emerald-600 text-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400"
                >
                  {product.stockQuantity ? 'Agregar al Carrito' : 'Sin Stock'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToFavorites}
                  className="flex-1 transition-colors"
                >
                  {isFavorite(product.id) ? "Quitar de Favoritos" : "Agregar a Favoritos"}
                </Button>
              </div>

              <WhatsAppButton
                variant="outline"
                className="w-full"
                phoneNumber="+5491132578591"
                message={`¡Hola! Me interesa el producto ${product.name}. ¿Podrían darme más información?`}
              />
            </div>

            <ProductBenefits />

            <div className="space-y-6 sm:space-y-8">
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Características</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  {product.features?.map((feature: string, idx: number) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Especificaciones</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {product.specifications && Object.entries(product.specifications).map(([name, value], idx) => (
                    <div key={idx} className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-500">{name}</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 mb-16">
          <ReviewsSection productId={product.id} productName={product.name} />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Productos que te pueden interesar
          </h2>
          <RecommendedProducts currentProduct={product} limit={4} />
        </section>
      </main>
    </>
  );
};

export default ProductDetailModern;