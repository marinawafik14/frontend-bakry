import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrdersService } from '../../services/order.service';
import { orderToAdmin } from '../../models/orderToAdmin';
import { data } from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  constructor(public orderservice: OrdersService) {}
  orders: orderToAdmin[] = []; // will bind

  ngOnInit(): void {
    this.orderservice.getallorders().subscribe({
      next: (data) => {
        if (data && data.order) {
          this.orders = data.order;
          console.log('Orders:', this.orders);
        } else {
          console.warn('Data structure issue: ', data);
          console.log(data.order);
        }
      },
      error: (err) => console.error('Failed to fetch orders', err),
    });

    // this.orderservice.getallorders().subscribe({
    //   next: (data) => {
    //     this.orders = data;
    //     console.log('Orders:', this.orders);
    //   },
    //   error: (err) => console.error('Failed to fetch orders', err),
    // });
  }

  markAsShipped(_id: string) {
    // Fetch the current order details first
    this.orderservice.getorderbyid(_id).subscribe({
      next: (response) => {
        const order = response.order;

        // Check if the order is already shipped
        if (order.orderStatus === 'shipped') {
          Swal.fire(
            'Notice',
            'This order is already marked as shipped.',
            'info'
          );
          return; // Exit early
        }

        // Proceed with confirmation if not already shipped
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to mark this order as shipped?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, ship it!',
          cancelButtonText: 'No, cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.orderservice.changeOrderStatus(_id, 'shipped').subscribe({
              next: (updatedOrder) => {
                Swal.fire(
                  'Shipped!',
                  `Order ${_id} marked as shipped.`,
                  'success'
                );
                console.log(`Order ${_id} marked as shipped`);
              },
              error: (err) => {
                console.error('Error updating order status', err);
                Swal.fire(
                  'Error!',
                  'Failed to mark the order as shipped.',
                  'error'
                );
              },
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'The order remains unchanged.', 'info');
          }
        });
      },
      error: (err) => {
        console.error('Error fetching order status', err);
        Swal.fire('Error!', 'Failed to fetch order details.', 'error');
      },
    });
  }

  markAscanceled(_id:string){
    // Fetch the current order details first
    this.orderservice.getorderbyid(_id).subscribe({
      next: (response) => {
        const order = response.order;

        // Check if the order is already shipped
        if (order.orderStatus === 'cancelled') {
          Swal.fire(
            'Notice',
            'This order is already marked as cancel.',
            'info'
          );
          return; // Exit early
        }
        if (order.orderStatus === 'shipped') {
          Swal.fire(
            'Notice',
            'sorry u cant cancelled order shipped',
            'info'
          );
          return; // Exit early
        }

        // Proceed with confirmation if not already shipped
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to mark this order as canceled?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, ship it!',
          cancelButtonText: 'No, cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.orderservice.changeOrderStatus(_id, 'canceled').subscribe({
              next: (updatedOrder) => {
                Swal.fire(
                  'canceled!',
                  `Order ${_id} marked as canceled.`,
                  'success'
                );
                console.log(`Order ${_id} marked as canceled`);
              },
              error: (err) => {
                console.error('Error updating order status', err);
                Swal.fire(
                  'Error!',
                  'Failed to mark the order as canceled.',
                  'error'
                );
              },
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'The order remains unchanged.', 'info');
          }
        });
      },
      error: (err) => {
        console.error('Error fetching order status', err);
        Swal.fire('Error!', 'Failed to fetch order details.', 'error');
      },
    });
  }
}
