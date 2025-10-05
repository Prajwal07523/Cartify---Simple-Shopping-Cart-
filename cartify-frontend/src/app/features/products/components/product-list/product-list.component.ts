import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error = '';
  searchQuery = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredProducts = !query
      ? this.products
      : this.products.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
  }

  isInStock(product: Product): boolean {
    return product.stockQuantity > 0;
  }

  getStockStatus(product: Product): string {
    if (product.stockQuantity === 0) {
      return 'Out of Stock';
    } else if (product.stockQuantity < 5) {
      return `Only ${product.stockQuantity} left`;
    } else {
      return 'In Stock';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  // ✅ Navigate to product detail on card click
goToProductDetail(id: number): void {
  console.group("clicked on goToProductDetails");
  console.log(id);
  this.router.navigate(['/products', id]);
}

}
