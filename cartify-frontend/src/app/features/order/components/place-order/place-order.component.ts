import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';

// Declare Razorpay for TypeScript
declare var Razorpay: any;

interface DeliveryAddress {
  fullName: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  loading = false;
  orderResponse: any;
  orderConfirmed = false;
  errorMessage: string | null = null;
  
  // Step management
  currentStep = 1;
  
  // Delivery address
deliveryAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    landmark?: string; // <-- Add this property
  } = {
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    landmark: '' // initialize
  };

  
  // Payment method
  paymentMethod: 'razorpay' | 'cod' | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRazorpayScript();
    
    this.route.queryParams.subscribe(params => {
      const productId = params['productId'];
      const quantity = params['quantity'];

      if (productId && quantity) {
        this.buyNow(productId, quantity);
      } else {
        this.checkoutCart();
      }
    });
  }

  // Load Razorpay script dynamically
  loadRazorpayScript(): void {
    if (typeof Razorpay !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  checkoutCart(): void {
    this.loading = true;
    this.errorMessage = null;
    this.orderService.checkout().subscribe({
      next: (res) => {
        this.orderResponse = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Checkout error:', err);
        this.errorMessage = 'Failed to process checkout. Please try again.';
        this.loading = false;
      }
    });
  }

  buyNow(productId: number, quantity: number): void {
    this.loading = true;
    this.errorMessage = null;
    this.orderService.buyNow(productId, quantity).subscribe({
      next: (res) => {
        this.orderResponse = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('BuyNow error:', err);
        this.errorMessage = 'Failed to process Buy Now. Please try again.';
        this.loading = false;
      }
    });
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validate delivery address
  isDeliveryAddressValid(): boolean {
    return !!(
      this.deliveryAddress.fullName &&
      this.deliveryAddress.address &&
      this.deliveryAddress.city &&
      this.deliveryAddress.state &&
      this.deliveryAddress.pincode &&
      this.deliveryAddress.phone &&
      this.deliveryAddress.pincode.length === 6 &&
      this.deliveryAddress.phone.length === 10
    );
  }

  // Select payment method
  selectPaymentMethod(method: 'razorpay' | 'cod'): void {
    this.paymentMethod = method;
  }

  // Cancel order
  cancelOrder(): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderResponse = null;
      this.orderConfirmed = false;
      this.currentStep = 1;
      this.router.navigate(['/cart']);
    }
  }

  // Confirm order
  confirmOrder(): void {
    if (!this.orderResponse || !this.paymentMethod) return;

    if (this.paymentMethod === 'razorpay') {
      this.initiateRazorpayPayment();
    } else {
      // Cash on Delivery
      this.processOrderConfirmation();
    }
  }

  // Razorpay payment integration
  initiateRazorpayPayment(): void {
    if (typeof Razorpay === 'undefined') {
      alert('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    const totalAmount = this.orderResponse.product 
      ? this.orderResponse.product.price * this.orderResponse.quantity 
      : 0;

    const options = {
      key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay test key
      amount: totalAmount * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      name: 'Your Shop Name',
      description: `Order #${this.orderResponse.orderId}`,
      image: 'assets/images/logo.png', // Your logo
      order_id: '', // Leave empty for test mode or generate from backend
      handler: (response: any) => {
        // Payment successful
        console.log('Payment successful:', response);
        this.processOrderConfirmation();
      },
      prefill: {
        name: this.deliveryAddress.fullName,
        contact: this.deliveryAddress.phone,
        email: '' // Add email if available
      },
      notes: {
        address: `${this.deliveryAddress.address}, ${this.deliveryAddress.city}`,
        order_id: this.orderResponse.orderId
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
    });

    rzp.open();
  }

  // Process order confirmation
  processOrderConfirmation(): void {
    // Here you would typically send the delivery address and payment info to your backend
    console.log('Order confirmed with details:', {
      orderId: this.orderResponse.orderId,
      deliveryAddress: this.deliveryAddress,
      paymentMethod: this.paymentMethod
    });

    // You can call your backend API here to save the order details
    // this.orderService.confirmOrder(orderData).subscribe(...)

    this.orderConfirmed = true;
  }

  // Retry on error
  retry(): void {
    if (this.orderResponse) return;

    this.route.queryParams.subscribe(params => {
      const productId = params['productId'];
      const quantity = params['quantity'];

      if (productId && quantity) {
        this.buyNow(productId, quantity);
      } else {
        this.checkoutCart();
      }
    });
  }

  // Format price
  formatPrice(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }
}