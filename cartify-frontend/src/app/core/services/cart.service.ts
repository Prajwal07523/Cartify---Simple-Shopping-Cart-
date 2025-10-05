import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Product } from './product.service';

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface CartItemDto {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartResponseDto {
  items: CartItemDto[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:8081/cart'; // Backend cart API

  // Reactive cart state
  private cartSubject = new BehaviorSubject<CartResponseDto>({ items: [], totalPrice: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCart(); // load cart on init
  }

  // ================= Add product to cart =================
  addToCart(product: Product, quantity: number = 1): Observable<string> {
    const dto: AddToCartDto = { productId: product.id, quantity };
    return this.http.post(this.baseUrl + '/add', dto, { responseType: 'text' })
      .pipe(
        tap({
          next: () => {
            this.showNotification(`${product.name} added to cart!`);
            this.refreshCart();
          },
          error: (err) => console.error('Add to cart failed:', err)
        })
      );
  }

  // ================= Get cart from backend =================
  getCart(): Observable<CartResponseDto> {
    return this.http.get<CartResponseDto>(this.baseUrl)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  // ================= Refresh cart (force fetch) =================
  refreshCart(): void {
    this.getCart().subscribe({
      next: cart => this.cartSubject.next(cart),
      error: err => console.error('Failed to refresh cart:', err)
    });
  }

  // ================= Remove product from cart =================
 removeFromCart(productId: number): Observable<any> {
  if (!productId) {
    console.error('Invalid productId:', productId);
    return of(null); // prevent sending undefined
  }
  return this.http.delete(`${this.baseUrl}/${productId}`, { responseType: 'text' });
}


  // ================= Clear cart =================
  clearCart(): Observable<any> {
  return this.http.delete(`${this.baseUrl}/clear`, { responseType: 'text' });
}


  // ================= Cart totals =================
  getCartTotal(): number {
    return this.cartSubject.value.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // ================= Notifications =================
  private showNotification(message: string): void {
    console.log('Cart Notification:', message);

    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00b894 0%, #00a383 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 8px 24px rgba(0, 184, 148, 0.3);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }
  }
}
