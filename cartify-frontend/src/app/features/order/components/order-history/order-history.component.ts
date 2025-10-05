import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';

// Interfaces matching backend DTO
interface OrderItemDto {
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDetailDto {
  orderId: number;
  orderDate: string;
  status: string;
  items?: OrderItemDto[]; // ✅ Optional because backend might return null
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;

  orders: OrderDetailDto[] = [];
  filteredOrders: OrderDetailDto[] = [];

  selectedFilter: 'all' | string = 'all';
  searchTerm = '';

  showDetailsModal = false;
  selectedOrder: OrderDetailDto | null = null;

  // Configurable values
  currencySymbol = ''; // e.g., '₹', '$'
  statusIcons: { [key: string]: string } = {}; // e.g., { 'PENDING': '⏳' }

 constructor(private router: Router, private orderService: OrderService) {}


  ngOnInit(): void {
    this.loadOrders();
  }

 loadOrders(): void {
  this.loading = true;
  this.errorMessage = null;

  this.orderService.getOrders().subscribe({
    next: (orders) => {
      console.log('✅ Orders fetched:', orders);

      // Map backend OrderResponseDto → frontend OrderDetailDto
      this.orders = orders.map(order => ({
        orderId: order.orderId,
        orderDate: order.createdAt || '', // map createdAt → orderDate
        status: order.status,
        items: order.items?.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        })) || []
      }));

      this.filteredOrders = [...this.orders];
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error fetching orders:', err);
      this.errorMessage = err?.error?.message || 'Failed to fetch orders.';
      this.loading = false;
    }
  });
}


  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(order =>
        order.status.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(searchLower) ||
        (order.items?.some(item =>
          item.productName.toLowerCase().includes(searchLower)
        ) ?? false) // ✅ Safe check
      );
    }

    this.filteredOrders = filtered;
  }

  clearFilters(): void {
    this.selectedFilter = 'all';
    this.searchTerm = '';
    this.filteredOrders = [...this.orders];
  }

  getTotalOrders(): number {
    return this.orders.length;
  }

  formatPrice(amount: number): string {
    return `${this.currencySymbol}${amount.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  viewOrderDetails(order: OrderDetailDto): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  reorder(order: OrderDetailDto): void {
    const confirmation = confirm(
      `Do you want to reorder these items?\n` +
      (order.items?.map(item =>
        `${item.productName} (${item.quantity})`
      ).join('\n') ?? 'No items found.') // ✅ Safe fallback
    );

    if (confirmation) {
      alert('Items added to cart successfully!');
      this.router.navigate(['/cart']);
    }
  }

  cancelOrder(order: OrderDetailDto): void {
    const confirmation = confirm(
      `Are you sure you want to cancel Order #${order.orderId}?`
    );

    if (confirmation) {
      const orderIndex = this.orders.findIndex(o => o.orderId === order.orderId);
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = 'CANCELLED';
        localStorage.setItem('userOrders', JSON.stringify(this.orders));
        this.applyFilters();
        alert(`Order #${order.orderId} cancelled successfully.`);
      }
    }
  }
}
