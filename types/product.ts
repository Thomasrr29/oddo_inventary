// Tipos principales para productos de Oddo
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: ProductImage[];
  category: string;
  stock: number;
  sku: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  attributes?: ProductAttribute[];
  sizes?: string[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Tipos para respuestas de API
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductsFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'price' | 'name' | 'newest' | 'featured';
  sortOrder?: 'asc' | 'desc';
}
