import { Component } from '@angular/core';
import { OrdersService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

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
  createdAt:string;
  isEditing?: boolean;
}


@Component({
  selector: 'app-cashier-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './cashier-orders.component.html',
  styleUrl: './cashier-orders.component.css'
})
export class CashierOrdersComponent {

  orders: Order[] = [];
  deliveredOrders: Order[] = [];
  canceledOrders: Order[] = [];
  cashierId: any;
  counter:number = 1;
  searchText: string = '';

   constructor(public orderService: OrdersService, public authService: AuthService , public productService: ProductService,) {}
  
    ngOnInit(): void {
      this.cashierId = this.getCashierIdFromToken();
      this.fetchCashierOrders();
    }

    fetchCashierOrders(): void {
      this.productService.getCashierOrders(this.cashierId).subscribe({
        next: (res) => {
          console.log("orrrder", res.orders);
          this.orders = res.orders.map((order: any) => {
            return {
              _id: order._id,
              Address: order.Address,           
              orderStatus: order.orderStatus,   
              totalAmount: order.totalAmount,   
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              items: order.items,
            };
          });
        // Partition orders
        this.deliveredOrders = this.orders.filter(o => o.orderStatus !== 'canceled');
        this.canceledOrders = this.orders.filter(o => o.orderStatus === 'canceled');
      },
        error: (error) => {
          console.error('Error fetching cashier orders:', error);
        }
      });
    }
    

    applyOrderFilters(): void {
      const searchLower = this.searchText.toLowerCase();
      
      // Helper function to check if an order matches the search criteria
      const matchesSearch = (order: Order): boolean => {
        // Check invoice (_id)
        const invoiceMatch = order._id.toLowerCase().includes(searchLower);
        // Check totalAmount (convert to string)
        const amountMatch = order.totalAmount.toString().toLowerCase().includes(searchLower);
        // Check Purchase On: using createdAt (you can also use updatedAt if needed)
        const purchaseOnMatch = new Date(order.createdAt)
          .toLocaleString()
          .toLowerCase()
          .includes(searchLower);
        
        return invoiceMatch || amountMatch || purchaseOnMatch;
      };
    
      // Filter delivered orders and canceled orders separately based on search text
      this.deliveredOrders = this.orders.filter(
        o => o.orderStatus !== 'canceled' && matchesSearch(o)
      );
      this.canceledOrders = this.orders.filter(
        o => o.orderStatus === 'canceled' && matchesSearch(o)
      );
    }
    

  
    getCashierIdFromToken(): string {
      const decodedToken = this.authService.getDecodedToken();
      return decodedToken?.userId || '';
    }
  
    getItemsForCurrentCashier(order: Order): OrderItem[] {
      return order.items.filter(item => item.productId);
    }


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
    if (!this.canEditOrder(order)) {
      Swal.fire({
        title: 'Not Allowed!',
        text: 'You cannot modify this order after 24 hours.',
        icon: 'warning',
        showConfirmButton: true
      });
      return;
    }
    order.items.splice(index, 1);
    order.totalAmount = this.calculateTotal(order.items);
  }
  

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


  // Returns true if the order’s most recent timestamp is within 24 hours from now.
canEditOrder(order: Order): boolean {
  const created = new Date(order.createdAt);
  const updated = new Date(order.updatedAt);
  const effectiveDate = updated > created ? updated : created;
  const now = new Date();
  const diff = now.getTime() - effectiveDate.getTime();
  return diff < 24 * 60 * 60 * 1000;
}

  

    

}
