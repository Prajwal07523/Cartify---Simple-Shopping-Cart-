// ==================== features/cart/components/cart-view/cart-view.component.ts ====================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CartItemDto } from 'src/app/models/cart.model'; // your API-based CartItem

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit, OnDestroy {
  cartItems: CartItemDto[] = [];
  loading = false;
  updating = false;
  removingItemId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    public router: Router,
     private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cartItems = cart.items;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading cart:', err);
          this.loading = false;
        }
      });
  }

  // ================== Quantity Controls ==================
  increaseQuantity(item: CartItemDto): void {
    this.updating = true;
    this.cartService.addToCart({ id: item.productId } as any, 1) // cast since backend uses Product ID
      .subscribe({
        next: () => {
          this.loadCart();
          this.updating = false;
        },
        error: (err) => {
          console.error('Failed to increase quantity:', err);
          this.updating = false;
        }
      });
  }

  decreaseQuantity(item: CartItemDto): void {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }
    this.updating = true;
    this.cartService.addToCart({ id: item.productId } as any, -1) // decrease logic depends on backend
      .subscribe({
        next: () => {
          this.loadCart();
          this.updating = false;
        },
        error: (err) => {
          console.error('Failed to decrease quantity:', err);
          this.updating = false;
        }
      });
  }

  updateQuantityInput(item: CartItemDto, event: Event): void {
    const input = event.target as HTMLInputElement;
    let quantity = parseInt(input.value);
    if (isNaN(quantity) || quantity < 1) quantity = 1;

    this.updating = true;
    this.cartService.addToCart({ id: item.productId } as any, quantity - item.quantity)
      .subscribe({
        next: () => {
          this.loadCart();
          this.updating = false;
        },
        error: (err) => {
          console.error('Failed to update quantity:', err);
          this.updating = false;
        }
      });
  }

 removeItem(item: CartItemDto): void {
  if (!item.productId) {
    console.error('Item does not have a valid productId:', item);
    return;
  }

  this.removingItemId = item.productId;
  this.cartService.removeFromCart(item.productId).subscribe({
    next: () => this.loadCart(),
    error: (err) => console.error('Failed to remove product:', err)
  });

  setTimeout(() => this.removingItemId = null, 300);
}



 clearCart(): void {
  this.cartService.clearCart().subscribe({
    next: () => {
      // Immediately clear local array so UI updates
      this.cartItems = [];
      this.removingItemId = null;
    },
    error: (err) => console.error('Failed to clear cart:', err)
  });
}



  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    if (!this.cartItems.length) return;
   this.router.navigate(['place-order'], { relativeTo: this.route });
  }

  getItemTotal(item: CartItemDto): number {
    return item.price * item.quantity;
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() >= 500 ? 0 : 40;
  }

  getTax(): number {
    return this.getSubtotal() * 0.05;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }

  getSavings(): number {
    return this.getSubtotal() * 0.1;
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  isItemRemoving(productId: number): boolean {
    return this.removingItemId === productId;
  }

  get isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  trackByItemId(index: number, item: CartItemDto): number {
    return item.productId;
  }
}
