// ==================== features/products/components/product-detail/product-detail.component.ts ====================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = false;
  error = '';
  quantity = 1;
  selectedImage = 0;
  isAddingToCart = false;
  showSuccessMessage = false;

  // Sample images (you can extend this based on your backend)
  productImages: string[] = [];

  private destroy$ = new Subject<void>();
  selectedQuantity: number=1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details.';
          this.loading = false;
          console.error('Error fetching product details:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductDetails(id: number): void {
    this.loading = true;
    this.error = '';

    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.product = product;
          this.setupProductImages(product);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details. Please try again.';
          this.loading = false;
          console.error('Error loading product:', err);
        }
      });
  }

  setupProductImages(product: Product): void {
    // Setup product images (use default if not available)
    this.productImages = [
      product.imageUrl || 'assets/images/placeholder-product.png',
      // Add more images if your backend supports multiple images
    ];
  }

  selectImage(index: number): void {
    this.selectedImage = index;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value);

    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (this.product && value > this.product.stockQuantity) {
      value = this.product.stockQuantity;
    }

    this.quantity = value;
  }

  addToCart(): void {
    if (!this.product || !this.isInStock()) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.isAddingToCart = true;

    // Add to cart with selected quantity
    this.cartService.addToCart(this.product, this.quantity).subscribe({
    next: (res) => console.log(res), // "Product added to cart"
    error: (err) => console.error(err)
  });

    // Show success message
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.isAddingToCart = false;
    }, 2000);
  }

  buyNow(): void {
  if (!this.product || !this.isInStock()) {
    return;
  }

  if (!this.authService.isLoggedIn()) {
    // If user not logged in → redirect to login page
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
    return;
  }

  // ✅ If logged in → navigate to Place Order page with product & quantity info
  const productId = this.product.id;
  const quantity = this.selectedQuantity || 1;

  this.router.navigate(['/place-order'], {
    queryParams: { productId, quantity }
  });
}


  goBack(): void {
    this.router.navigate(['/products']);
  }

  isInStock(): boolean {
  return this.product ? this.product.stockQuantity > 0 : false;
}

getStockStatus(): string {
  if (!this.product) return '';

  if (this.product.stockQuantity > 10) {
    return 'In Stock';
  } else if (this.product.stockQuantity > 0) {
    return `Only ${this.product.stockQuantity} left!`;
  } else {
    return 'Out of Stock';
  }
}


  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  get canAddToCart(): boolean {
    return this.isInStock() && this.quantity > 0 && !this.isAddingToCart;
  }

  get totalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }
}