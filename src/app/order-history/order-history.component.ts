import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../models/orderHistory';
import { OrderhistoryService } from '../services/orderhistory.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  customerId: string | null = null;

  constructor(
    private orderService: OrderhistoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = params['customerId'];
      console.log('Customer ID from URL:', this.customerId);

      if (this.customerId) {
        this.fetchOrderHistory();
      } else {
        console.error('Customer ID is undefined');
      }
    });
  }

  fetchOrderHistory(): void {
    if (this.customerId) {
      this.orderService.getOrderHistory(this.customerId).subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (error) => {
          console.error('Error fetching order history:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-badge badge-pending';
      case 'delivered': return 'status-badge badge-delivered';
      case 'canceled': return 'status-badge badge-canceled';
      case 'shipped': return 'status-badge badge-shipped';
      default: return 'status-badge';
    }
  }
  // Cancel an order
  // cancelOrder(orderId: string): void {
  //   if (confirm('Are you sure?')) {
  //     this.orderService.cancelOrder(orderId).subscribe({
  //       next: () => {
  //         const order = this.orders.find(o => o._id === orderId);
  //         if (order) order.orderStatus = 'canceled';
  //       },
  //       error: (error) => {
  //         console.error('Cancel failed:', error);
  //         alert('Cancellation failed. Please try again.');
  //       }
  //     });
  //   }
  // }
  async cancelOrder(orderId: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          const order = this.orders.find(o => o._id === orderId);
          if (order) order.orderStatus = 'canceled';
          Swal.fire(
            'Cancelled!',
            'Your order has been cancelled.',
            'success'
          );
        },
        error: (error) => {
          Swal.fire(
            'Error!',
            'Failed to cancel order. Please try again.',
            'error'
          );
          console.error('Cancel failed:', error);
        }
      });
    }
  }
}
