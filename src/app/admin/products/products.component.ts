import { Component, NgModule, OnInit } from '@angular/core';
import { ProductToAdmin } from '../../models/productToAdmin';
import { ProductService } from '../../services/product.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/order.service';
import { Order } from '../../models/order';
import Swal from 'sweetalert2';
import { OrderTo } from '../../models/orderTo';

@Component({
  selector: 'app-products',
  imports: [FormsModule, NgxDatatableModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductosComponent implements OnInit {
  products: ProductToAdmin[] = [];
  orders: OrderTo[] = [];
  filteredProducts: ProductToAdmin[] = [];
  sortColumn: string = '';
  sortDirection: boolean = true;
  filterText: string = '';
  columns: any[] = [
    { prop: '_id', name: 'ID' },
    { prop: 'name', name: 'Name' },
    { prop: 'price', name: 'Price' },
    { prop: 'category', name: 'Category' },
    { prop: 'sales', name: 'Sales' },
    { prop: 'stock', name: 'Stock' },
    { prop: 'flavor', name: 'Flavor' },
    { prop: 'discounted', name: 'Discounted' },
    { prop: 'createdAt', name: 'Created At' },
  ];

  constructor(
    public productservice: ProductService,
    public orderservice: OrdersService
  ) {}
  ngOnInit(): void {
    this.productservice.getAllProductsToadmin().subscribe({
      next: (data: ProductToAdmin[]) => {
        this.products = data;
        this.filteredProducts = data;
        console.log('Products fetched:', this.products);
        console.log(this.filteredProducts);
        console.log(this.products);
      },
      error: (err) => {
        console.error('Error fetching products', err);
      },
    });

    // Load orders for checking pending status
    this.orderservice.getallordersP().subscribe({
      next: (response) => {
        this.orders = response.order; // Access the nested order array
      },
      error: (err) => {
        console.error('Error fetching orders', err);
      },
    });
  }

  applyFilter(): void {
    if (!this.filterText.trim()) {
      // Reset to the full product list if search input is empty
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }

  sortTable(column: keyof ProductToAdmin): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection; // Toggle direction
    } else {
      this.sortColumn = column;
      this.sortDirection = true; // Default to ascending
    }

    this.filteredProducts.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Handle undefined or null values
      if (valueA == null || valueB == null) return 0;

      // Handle different types (Date, number, and string)
      const formattedValueA = this.formatValue(valueA);
      const formattedValueB = this.formatValue(valueB);

      return this.sortDirection
        ? formattedValueA.localeCompare(formattedValueB)
        : formattedValueB.localeCompare(formattedValueA);
    });
  }

  private formatValue(value: any): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }

  deleteProduct(productId: string): void {
    const isInPendingOrder = this.orders.some(
      (order) =>
        order.orderStatus === 'pending' &&
        order.items.some((item) => item.productId === productId)
    );

    if (isInPendingOrder) {
      Swal.fire({
        title: 'Cannot Delete!',
        text: 'This product is associated with a pending order and cannot be deleted.',
        icon: 'error',
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will delete the product permanently.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.productservice.Deleteproductbyid(productId).subscribe({
            next: () => {
              Swal.fire('Deleted!', 'Product has been deleted.', 'success');
              this.products = this.products.filter(
                (product) => product._id !== productId
              );
              this.filteredProducts = [...this.products]; // Update the list
            },
            error: (err) => {
              Swal.fire('Error!', 'Failed to delete product.', 'error');
            },
          });
        }
      });
    }
  }

  // to approve product
  approve(_id: string) {
    this.productservice.getProductById(_id).subscribe((product) => {
      if (product.status === 'Approved') {
        Swal.fire({
          icon: 'info',
          title: 'Already Approved',
          text: 'This product is already approved.',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to approve this product?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, approve it!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.productservice.changeproductStatus(_id, 'Approved').subscribe(
              (updatedProduct) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Approved!',
                  text: `The product "${updatedProduct.name}" is now approved.`,
                });
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to update the product status.',
                });
              }
            );
          }
        });
      }
    });
  }

  reject(_id: string) {
    this.productservice.getProductById(_id).subscribe((product) => {
      if (product.status === 'Rejected') {
        Swal.fire({
          icon: 'info',
          title: 'Already Rejected',
          text: 'This product is already rejected.',
          confirmButtonText: 'OK',
        });
      } else if (product.status === 'Out of Stock') {
        Swal.fire({
          icon: 'warning',
          title: 'Action Not Allowed',
          text: "You can't reject this product because it's out of stock.",
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to reject this product?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, reject it!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.productservice.changeproductStatus(_id, 'Rejected').subscribe(
              (updatedProduct) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Rejected!',
                  text: `The product "${updatedProduct.name}" is now rejected.`,
                });
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to update the product status.',
                });
              }
            );
          }
        });
      }
    });
  }
}
