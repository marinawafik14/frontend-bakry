import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

// Define interfaces for the order structure
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
  customername: { firstname: string; lastname: string; _id: string };
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

@Component({
  selector: 'app-seller-orders',
  imports: [CommonModule],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']  // Fix typo here: 'styleUrls'
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
        this.orders = res.orders; // Assuming res.orders is of type Order[]
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  getSellerIdFromToken(): string {
    const decodedToken = this.authService.getDecodedToken();  // Assuming you have AuthService set up to decode the token
    return decodedToken?.userId || '';  // Replace 'userId' with the correct property name for sellerId in your token
  }

  getItemsForCurrentSeller(order: Order): OrderItem[] {
    // Filter items that belong to the current seller, and ensure productId and sellerId are not null
    return order.items.filter(item => item.productId && item.productId.sellerId !== null && item.productId.sellerId === this.sellerId);
  }
  
  

  updateStatus(order: Order, status: string): void {
    // Update order status (Pending -> Shipped -> Delivered)
    this.orderService.changeOrderStatus(order._id, status).subscribe({
      next: (response) => {
        console.log(`Order status updated to ${status}`);
        // Update the order in the local list
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
