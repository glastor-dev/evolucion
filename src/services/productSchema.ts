import { z } from "zod";

// Schema para especificaciones de producto
export const ProductSpecificationsSchema = z.record(z.string()).optional();

// Schema para características del producto
export const ProductFeaturesSchema = z.array(z.string()).default([]);

// Schema para imágenes del producto
export const ProductImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional()
});

export const ProductImagesSchema = z.array(z.string()).default([]);

// Schema para galería de imágenes del producto
export const ProductGallerySchema = z.array(
  z.union([
    z.string(),
    ProductImageSchema
  ])
).default([]);

// Schema principal para productos
export const ProductSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  sku: z.string().optional(),
  name: z.string().min(1, "Nombre es requerido"),
  description: z.string().min(1, "Descripción es requerida"),
  price: z.union([z.number(), z.string()]).transform((val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(num) ? 0 : num;
  }),
  originalPrice: z.union([z.number(), z.string()]).optional().transform((val?: string | number) => {
    if (val === undefined) return undefined;
    const num = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  imageGallery: ProductGallerySchema,
  category: z.string().optional(),
  brand: z.string().optional(),
  inStock: z.boolean().default(true),
  features: ProductFeaturesSchema,
  specifications: ProductSpecificationsSchema,
  detailsUrl: z.string().optional(),
  rating: z.number().min(0).max(5).default(4.5),
  reviews: z.number().min(0).default(0),
  discount: z.number().optional(),
  freeShipping: z.boolean().default(false),
  installments: z.string().optional(),
  seller: z.string().default("Glastor Tools"),
  location: z.string().optional(),
  officialStore: z.boolean().optional(),
  warrantyMonths: z.number().optional(),
  shippingTimeDays: z.number().optional(),
  shippingNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  badge: z.string().optional(),
  highlight: z.boolean().optional(),
  video: z.string().optional(),
  color: z.string().optional(),
  gradient: z.string().optional(),
  shadow: z.string().optional(),
  ctaText: z.string().optional(),
  ctaAnimation: z.boolean().optional(),
  ctaIcon: z.string().optional(),
  reviewStars: z.number().optional(),
  reviewHighlight: z.string().optional(),
  stockQuantity: z.number().optional(),
  benefits: z.array(z.string()).optional(),
  modernCard: z.boolean().optional(),
});

// Schema para array de productos
export const ProductsArraySchema = z.array(ProductSchema);

// Tipos inferidos
export type Product = z.infer<typeof ProductSchema>;
export type ProductSpecifications = z.infer<typeof ProductSpecificationsSchema>;
export type ProductFeatures = z.infer<typeof ProductFeaturesSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;

// Función de validación
export const validateProduct = (data: unknown): Product => {
  return ProductSchema.parse(data);
};

export const validateProducts = (data: unknown): Product[] => {
  return ProductsArraySchema.parse(data);
};

// Función de validación segura (no lanza errores)
export const safeValidateProduct = (data: unknown): { success: true; data: Product } | { success: false; error: z.ZodError } => {
  const result = ProductSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
};

export const safeValidateProducts = (data: unknown): { success: true; data: Product[] } | { success: false; error: z.ZodError } => {
  const result = ProductsArraySchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
};