export interface OrderResponseDto {
  orderId: number;
  cartId?: number;     // Optional: present only in cart checkout
  userId: number;
  status: string;
  totalAmount?: number;
  createdAt?: string;

  // Optional details for frontend display
  items?: OrderItemDto[];
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}
