// ==================== models/product.model.ts ====================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  imageUrl?: string; // Optional: for product images
}

export interface ProductResponse {
  products: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}