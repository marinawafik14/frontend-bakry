import { Component } from '@angular/core';
import { OrdersService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
  createdAt: string;
  // Optional flag to track editing state
  isEditing?: boolean;
}


@Component({
  selector: 'app-cashier-orders',
  imports: [CommonModule],
  templateUrl: './cashier-orders.component.html',
  styleUrl: './cashier-orders.component.css'
})
export class CashierOrdersComponent {

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
      this.orderService.getOfflineOrders().subscribe({
        next: (res) => {
          console.log('Response:', res);
          this.orders = res;
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
  
    getItemsForCurrentCashier(order: Order): OrderItem[] {
      return order.items.filter(item => item.productId);
      // return order.items.filter(item => item.productId && item.productId.sellerId !== null && item.productId.sellerId === this.sellerId);
    }

     // Method to cancel an order
  // cancelOrder(order: Order): void {
  //   this.orderService.cancelOrder(order._id).subscribe({
  //     next: (res) => {
  //       console.log('Order canceled:', res);
  //       // Update local order status to "canceled"
  //       const updatedOrder = this.orders.find(o => o._id === order._id);
  //       if (updatedOrder) {
  //         updatedOrder.orderStatus = 'canceled';
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error canceling order:', error);
  //     }
  //   });
  // }


  cancelOrder(order: Order): void {
    this.orderService.cancelOrder(order._id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Order canceled successfully.',
          icon: 'success',
          showConfirmButton: true,
        });
        // Update local order status to "canceled"
        const updatedOrder = this.orders.find(o => o._id === order._id);
        if (updatedOrder) {
          updatedOrder.orderStatus = 'canceled';
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: `Cancellation failed: Can't Cancel Order after one day`,
          icon: 'error',
          showConfirmButton: true,
        });
      }
    });
  }
  


  //  // Method to update order items.
  // // In a real application, you would gather new items from a form or modal.
  // updateOrder(order: Order, newItems: OrderItem[]): void {
  //   this.orderService.updateOrder(order._id, newItems).subscribe({
  //     next: (res) => {
  //       console.log('Order updated:', res);
  //       // Assuming the response returns the updated order object:
  //       const updatedOrder = this.orders.find(o => o._id === order._id);
  //       if (updatedOrder) {
  //         updatedOrder.items = res.order.items;
  //         updatedOrder.totalAmount = res.order.totalAmount;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error updating order:', error);
  //     }
  //   });
  // }


  //  // Stub method to open an update modal (or similar UI) to edit order items.
  // // Here you would implement the UI logic to get the new list of items.
  // openUpdateModal(order: Order): void {
  //   // For demonstration purposes, we assume a newItems array is created.
  //   // In practice, implement a form/modal where the cashier can adjust the items.
  //   const newItems: OrderItem[] = order.items.filter(item => {
  //     // Example: remove an item if needed. Adjust as required.
  //     return item.productId._id !== 'ID_OF_PRODUCT_TO_REMOVE';
  //   });
  //   this.updateOrder(order, newItems);
  // }


  // Toggle editing state. If turning OFF editing, call update API.
  toggleEdit(order: Order): void {
    // If we're switching from non-edit to edit, just set the flag.
    if (!order.isEditing) {
      order.isEditing = true;
      return;
    }
    // If we're switching from edit to non-edit, call the update API.
    order.isEditing = false;
    this.updateOrder(order, order.items);
  }

  // Recalculate the total amount for the order based on its items
  calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);
  }

  // Remove an item from the order
  removeItem(order: Order, index: number): void {
    order.items.splice(index, 1);
    order.totalAmount = this.calculateTotal(order.items);
  }

  // Method that calls your existing updateOrder API
  updateOrder(order: Order, updatedItems: OrderItem[]): void {
    this.orderService.updateOrder(order._id, updatedItems).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Order updated successfully.',
          icon: 'success',
          showConfirmButton: true
        });
        // Update the local data with the response from the server
        const updatedOrder = this.orders.find(o => o._id === order._id);
        if (updatedOrder && res.order) {
          updatedOrder.items = res.order.items;
          updatedOrder.totalAmount = res.order.totalAmount;
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: `Update failed: ${error.error?.error || error.message}`,
          icon: 'error',
          showConfirmButton: true
        });
      }
    });
  }


  removeOrder(order: Order): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this order permanently?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with order removal if confirmed
        this.orderService.deleteOrder(order._id).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Removed!',
              text: 'Order removed successfully.',
              icon: 'success',
              showConfirmButton: true
            });
            // Remove the order from the local array
            this.orders = this.orders.filter(o => o._id !== order._id);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: `Remove failed: ${error.error?.error || error.message}`,
              icon: 'error',
              showConfirmButton: true
            });
          }
        });
      }
    });
  }
  

    

}
