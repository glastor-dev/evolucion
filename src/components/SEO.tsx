import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  siteName?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  product?: {
    price?: string;
    currency?: string;
    availability?: string;
    brand?: string;
    category?: string;
    sku?: string;
    rating?: number;
    reviewCount?: number;
    condition?: string;
    warranty?: string;
    features?: string[];
    model?: string;
    gtin?: string;
    mpn?: string;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  lang?: string;
  noIndex?: boolean;
}

export const SEO = ({
  title = "Glastor - Herramientas Profesionales Makita | Equipos de Construcción y Jardinería",
  description = "Descubre la mejor selección de herramientas profesionales Makita en Glastor. Taladros, sierras, lijadoras y equipos de jardinería con la máxima calidad y potencia. Envío gratis en pedidos superiores a $50.",
  keywords = "Makita, herramientas profesionales, taladros, sierras, lijadoras, jardinería, construcción, equipos eléctricos, batería, inalámbricos, Colombia, Glastor, herramientas de calidad, equipos profesionales",
  image = "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
  url = "https://glastor.com",
  type = "website",
  author = "Glastor",
  siteName = "Glastor",
  article,
  product,
  breadcrumbs,
  lang = "es",
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes("Glastor") ? title : `${title} | Glastor`;
  const fullUrl = url.startsWith("http") ? url : `https://glastor.com${url}`;
  const fullImage = image.startsWith("http") ? image : `https://glastor.com${image}`;

  // Generar datos estructurados dinámicamente
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Glastor",
      description:
        "Distribuidor oficial de herramientas profesionales Makita en Colombia. Especialistas en equipos de construcción y jardinería.",
      url: "https://glastor.com",
      logo: "https://cdn-icons-png.flaticon.com/512/3069/3069118.png",
      foundingDate: "2014",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle Principal 123",
        addressLocality: "Bogotá",
        addressRegion: "Cundinamarca",
        postalCode: "110111",
        addressCountry: "CO",
      },
      sameAs: [
        "https://www.facebook.com/glastor",
        "https://www.instagram.com/glastor",
        "https://twitter.com/glastor",
        "https://www.linkedin.com/company/glastor",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@glastor.com",
        telephone: "+57-1-234-5678",
        availableLanguage: "Spanish",
      },
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Herramientas Profesionales Makita",
          category: "Herramientas y Equipos",
        },
      },
      areaServed: {
        "@type": "Country",
        name: "Colombia",
      },
    };

    // Agregar datos de producto si están disponibles
    if (product) {
      const productData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description: description,
        image: [fullImage],
        brand: {
          "@type": "Brand",
          name: product.brand || "Glastor",
        },
        category: product.category,
        sku: product.sku,
        model: product.model,
        gtin: product.gtin,
        mpn: product.mpn,
        condition: product.condition || "NewCondition",
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency || "COP",
          availability: `https://schema.org/${product.availability || "InStock"}`,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
          seller: {
            "@type": "Organization",
            name: "Glastor",
            url: "https://glastor.com"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "COP"
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "CO"
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 2,
                unitCode: "DAY"
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 5,
                unitCode: "DAY"
              }
            }
          }
        },
        manufacturer: {
          "@type": "Organization",
          name: product.brand || "Makita",
          url: "https://www.makita.com"
        },
        warranty: product.warranty || "12 meses de garantía oficial",
        ...(product.rating && product.reviewCount && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }),
        ...(product.features && product.features.length > 0 && {
          additionalProperty: product.features.map(feature => ({
            "@type": "PropertyValue",
            name: "Característica",
            value: feature
          }))
        })
      };

      // Si hay breadcrumbs, incluir también la lista de breadcrumbs
      if (breadcrumbs && breadcrumbs.length > 0) {
        const breadcrumbList = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url.startsWith("http") ? crumb.url : `https://glastor.com${crumb.url}`,
          })),
        };

        return [productData, breadcrumbList];
      }

      return productData;
    }

    // Agregar datos de artículo si están disponibles
    if (article) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        image: fullImage,
        author: {
          "@type": "Person",
          name: article.author || author,
        },
        publisher: baseData,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime,
        articleSection: article.section,
        keywords: article.tags?.join(", ") || keywords,
      };
    }

    // Agregar breadcrumbs si están disponibles
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url.startsWith("http") ? crumb.url : `https://glastor.com${crumb.url}`,
        })),
      };

      return [baseData, breadcrumbList];
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* HTML lang attribute */}
      <html lang={lang} />

      {/* Título básico */}
      <title>{fullTitle}</title>

      {/* Meta tags básicos */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="color-scheme" content="light dark" />

      {/* Metadatos adicionales para SEO */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${siteName} - ${title}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={lang === "es" ? "es_ES" : "en_US"} />
      <meta property="og:email" content="glastor.info@gmail.com" />

      {/* Metadatos específicos de artículo */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Metadatos específicos de producto */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content={product.currency || "COP"} />
          <meta property="product:availability" content={product.availability || "in stock"} />
          <meta property="product:brand" content={product.brand} />
          <meta property="product:category" content={product.category} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={`${siteName} - ${title}`} />
      <meta name="twitter:creator" content="@glastor" />
      <meta name="twitter:site" content="@glastor" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Preconnect para mejorar rendimiento */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch para recursos externos */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />

      {/* Favicon y iconos */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Datos estructurados JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData(), null, 2)}
      </script>
    </Helmet>
  );
};
