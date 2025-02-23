import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartApiService } from '../../services/cart-api.service';
import { OrdersService } from '../../services/order.service';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-cashier-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './cashier-checkout.component.html',
  styleUrls: ['./cashier-checkout.component.css']
})
export class CashierCheckoutComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;
  cartCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  //shipping: number = 10.0; // Or any logic for shipping
  totalAmount: number = 0;
  paymentMethod: string = "cash";  // Default payment method

  paymentMethods = ["Credit Card", "PayPal", "Vodafone Cash", "cash"]; // Available payment methods

  constructor(
    private cartService: CartApiService,
    private orderService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Retrieve cartItems from query parameters
    const cartItemsParam = this.route.snapshot.queryParamMap.get('cartItems');
    if (cartItemsParam) {
      this.cartItems = JSON.parse(cartItemsParam);
      this.calculateTotal();
    }
  }

    public notyf = new Notyf({
      duration: 3000,
      position: { x: 'center', y: 'bottom' }
    });
  

  calculateTotal(): void {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.totalAmount = this.subtotal;
  }

  completePurchase() {
    const orderData = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.totalAmount,
      Address: "Cairo",
      paymentMethod: this.paymentMethod,
      orderStatus: 'delivered',
    };
  
    this.orderService.createOrder(orderData).subscribe(
      (response) => {
        // alert('Order placed successfully!');
        this.notyf.success("Order placed successfully!");
        this.clearCart();
        this.router.navigate(['/cashier']);
        this.cartService.refreshCartCount();
      },
      (error) => {
        console.error('Error placing the order:', error);
        alert('Failed to place the order');
      }
    );
  }
  
  clearCart() {
    const token = sessionStorage.getItem('tokenkey');
    if (token) {
      this.orderService.clearCashierCart(token).subscribe(
        (response) => {
          sessionStorage.setItem('tokenkey', response.token);
          localStorage.removeItem('guestCart');
          this.cartItems = [];
          this.cartCount.next(0);
          this.cartService.refreshCartCount();
        },
        (error) => {
          console.error('Error clearing the cart:', error);
        }
      );
  }}


  
  
}
