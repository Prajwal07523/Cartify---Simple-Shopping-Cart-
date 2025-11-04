import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponseDto } from 'src/app/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'https://cartify-simple-shopping-cart-1.onrender.com/orders';

  constructor(private http: HttpClient) {}

  checkout(): Observable<OrderResponseDto> {
    return this.http.post<OrderResponseDto>(`${this.baseUrl}/checkout`, {});
  }

  buyNow(productId: number, quantity: number): Observable<OrderResponseDto> {
    return this.http.post<OrderResponseDto>(
      `${this.baseUrl}/buyNow/${productId}?quantity=${quantity}`,
      {}
    );
  }
   getOrders(): Observable<OrderResponseDto[]> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('JWT token not found. User might not be logged in.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<OrderResponseDto[]>(`${this.baseUrl}/my-orders`, { headers });
  }
}
