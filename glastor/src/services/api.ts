// API Service para conectar con backend de productos
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:1337/api';

// Tipos de datos
export interface Product {
  id: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: {
      data: Array<{
        attributes: {
          url: string;
          alternativeText: string;
        };
      }>;
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    specifications: {
      material: string;
      dimensions: string;
      weight: string;
      colors: string[];
      brand?: string;
    };
    stock: number;
    featured: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Clase para manejar las peticiones API
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos para productos
  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    featured?: boolean;
    search?: string;
    sort?: string | string[]; // e.g., 'price:asc' o ['createdAt:desc']
    brand?: string; // Filtro por marca dentro de specifications.brand
  }): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('pagination[page]', params.page.toString());
    if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
    if (params?.category) searchParams.append('filters[category][slug][$eq]', params.category);
    if (params?.featured) searchParams.append('filters[featured][$eq]', 'true');
    if (params?.search) searchParams.append('filters[name][$containsi]', params.search);
    if (params?.brand) searchParams.append('filters[specifications][brand][$eq]', params.brand);
    if (params?.sort) {
      const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
      sorts.forEach((s, i) => searchParams.append(`sort[${i}]`, s));
    }
    
    // Incluir relaciones
    searchParams.append('populate', 'images,category');

    return this.request<ApiResponse<Product[]>>(`/products?${searchParams.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/products/${id}?populate=images,category`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ featured: true, pageSize: 8, sort: 'createdAt:desc' });
  }

  async getProductsByCategory(categorySlug: string): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ category: categorySlug });
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ search: query });
  }

  // Métodos para categorías
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/categories?populate=image');
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();

// Hooks personalizados para React
export { apiService as default };