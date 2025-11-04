import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;   // optional (if your backend supports images)
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://cartify-simple-shopping-cart-1.onrender.com/products'; 

  constructor(private http: HttpClient) { }

  // ✅ API calls
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
  }

  // ✅ Utility methods (optional)
  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  getStockStatus(product: Product): string {
    if (product.stockQuantity > 10) {
      return 'In Stock';
    } else if (product.stockQuantity > 0) {
      return `Only ${product.stockQuantity} left!`;
    } else {
      return 'Out of Stock';
    }
  }

  isInStock(product: Product): boolean {
    return product.stockQuantity > 0;
  }

 
}
