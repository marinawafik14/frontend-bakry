import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Product {
  _id: string;
  name: string;
  price: number;
  sellerId: string;
}

interface OrderItem {
  productId: Product;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  updatedAt: string;
}

@Component({
  selector: 'app-seller-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {
  orders: Order[] = [];
  sellerId: string = '';
  counter:number = 1;

  constructor(public orderService: OrdersService, public authService: AuthService) {}

  ngOnInit(): void {
    this.sellerId = this.getSellerIdFromToken();
    this.fetchOrders();
  }

  fetchOrders(): void {
    console.log("Seller ID: ", this.sellerId);
    this.orderService.getOrdersBySellerId(this.sellerId).subscribe({
      next: (res) => {
        console.log('Response:', res);
        this.orders = res.orders;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  getSellerIdFromToken(): string {
    const decodedToken = this.authService.getDecodedToken();
    return decodedToken?.userId || '';
  }

  getItemsForCurrentSeller(order: Order): OrderItem[] {
    return order.items.filter(item => item.productId && item.productId.sellerId !== null && item.productId.sellerId === this.sellerId);
  }
  
  

  updateStatus(order: Order, status: string): void {
    this.orderService.changeOrderStatus(order._id, status).subscribe({
      next: (response) => {
        console.log(`Order status updated to ${status}`);
        const updatedOrder = this.orders.find(o => o._id === order._id);
        if (updatedOrder) {
          updatedOrder.orderStatus = status;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }
}
