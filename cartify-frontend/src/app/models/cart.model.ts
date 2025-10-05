import { Product } from './product.model';

// Cart item returned by backend
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

// Cart response from backend
export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}

// DTO to add product to cart
export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface CartItemDto {
  productId: number;      // ID of the product
  name: string;           // Product name
  price: number;          // Price per unit
  quantity: number;       // Quantity in cart
  // Optional fields if backend provides more details
  imageUrl?: string;
  stockQuantity?: number;
}
