import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrdersService } from '../../services/order.service';
import { orderToAdmin } from '../../models/orderToAdmin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, NgxDatatableModule, FormsModule]

})
export class OrdersComponent implements OnInit {
  constructor(public orderservice: OrdersService) {}

  orders: orderToAdmin[] = []; // will bind
  filteredOrders: orderToAdmin[] = [];
  pagedOrders: orderToAdmin[] = [];
  filterText: string = '';
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.orderservice.getallorders().subscribe({
      next: (data) => {
        if (data && data.order) {
          this.orders = data.order;
          this.filteredOrders = data.order;
          this.updatePagedOrders();
          console.log('Orders:', this.orders);
        } else {
          console.warn('Data structure issue: ', data);
          console.log(data.order);
        }
      },
      error: (err) => console.error('Failed to fetch orders', err),
    });
  }

  markAsShipped(_id: string) {
    this.orderservice.getorderbyid(_id).subscribe({
      next: (response) => {
        const order = response.order;

        if (order.orderStatus === 'shipped') {
          Swal.fire('Notice', 'This order is already marked as shipped.', 'info');
          return;
        }

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
                Swal.fire('Shipped!', `Order ${_id} marked as shipped.`, 'success');
                console.log(`Order ${_id} marked as shipped`);
              },
              error: (err) => {
                console.error('Error updating order status', err);
                Swal.fire('Error!', 'Failed to mark the order as shipped.', 'error');
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

  markAsCanceled(_id: string) {
    this.orderservice.getorderbyid(_id).subscribe({
      next: (response) => {
        const order = response.order;

        if (order.orderStatus === 'cancelled') {
          Swal.fire('Notice', 'This order is already marked as cancel.', 'info');
          return;
        }
        if (order.orderStatus === 'shipped') {
          Swal.fire('Notice', 'Sorry, you can\'t cancel a shipped order.', 'info');
          return;
        }

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to mark this order as canceled?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, cancel it!',
          cancelButtonText: 'No, cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.orderservice.changeOrderStatus(_id, 'canceled').subscribe({
              next: (updatedOrder) => {
                Swal.fire('Canceled!', `Order ${_id} marked as canceled.`, 'success');
                console.log(`Order ${_id} marked as canceled`);
              },
              error: (err) => {
                console.error('Error updating order status', err);
                Swal.fire('Error!', 'Failed to mark the order as canceled.', 'error');
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

  applyFilter(): void {
    const filterValue = this.filterText.toLowerCase().trim();
    if (!filterValue) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        (order) =>
          (order.customername?.firstname + ' ' + order.customername?.lastname)
            .toLowerCase()
            .includes(filterValue) ||
          order.addressdetails?.toLowerCase().includes(filterValue)
      );
    }
    this.currentPage = 1;
    this.updatePagedOrders();
  }

  sortTable(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredOrders.sort((a: any, b: any) => {
      const valueA = key.split('.').reduce((o, k) => (o ? o[k] : ''), a);
      const valueB = key.split('.').reduce((o, k) => (o ? o[k] : ''), b);

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePagedOrders();
  }

  updatePagedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedOrders = this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  firstPage(): void {
    this.currentPage = 1;
    this.updatePagedOrders();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePagedOrders();
    }
  }

  lastPage(): void {
    this.currentPage = this.totalPages();
    this.updatePagedOrders();
  }



  // Clear search and reset the list
  clearSearch(): void {
    this.filterText = '';
    this.applyFilter();
  }
}