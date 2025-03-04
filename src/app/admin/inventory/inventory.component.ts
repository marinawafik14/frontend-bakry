import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '../../services/product.service';
import { ProductToAdmin } from '../../models/productToAdmin';
import Swal from 'sweetalert2';
import { OrdersService } from '../../services/order.service';
import { OrderTo } from '../../models/orderTo';

@Component({
  selector: 'app-product-list',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [CommonModule, NgxDatatableModule, FormsModule],
})
export class InventoryComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private orderservice: OrdersService
  ) {}

  products: ProductToAdmin[] = []; // will bind
  filteredProducts: ProductToAdmin[] = [];
  pagedProducts: ProductToAdmin[] = [];
  filterText: string = '';
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.loadProducts();
  }

  // loadProducts(): void {
  //   this.productService.getAllProducts().subscribe({
  //     next: (data) => {
  //       console.log('Products fetched:', data);
  //       this.products = data;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching products:', err);
  //     },
  //   });
  // }
  loadProducts(): void {
    this.productService.getAllProductsToadmin().subscribe({
      next: (data) => {
        console.log('Products fetched:', data);

        // Transform API data to match ProductToAdmin structure
        this.products = data.map(
          (item: any) =>
            new ProductToAdmin(
              item.productId?._id || item._id, // Handle nested productId
              item.productId?.name || item.name,
              item.productId?.description || item.description,
              item.productId?.price || item.price,
              item.productId?.categoryName || item.categoryName,
              item.productId?.category || item.category,
              item.productId?.previousprice || item.previousprice,
              item.stockOut, // Inventory related
              item.stockIn, // Inventory related
              item.productId?.flavor || item.flavor,
              item.productId?.discounted || item.discounted,
              item.productId?.status || item.status,
              new Date(item.productId?.createdAt || item.createdAt), // Ensure date type
              new Date(item.productId?.updatedAt || item.updatedAt),
              item.productId?.images || item.images || [], // Ensure images array
              item.productId?.accentColor || item.accentColor
            )
        );

        console.log('Transformed Products:', this.products);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  approveProduct(product: ProductToAdmin): void {
    if (product.status === 'Approved') {
      Swal.fire('Already Approved', 'This product is already approved.', 'info');
      return;
    }

    Swal.fire({
      title: 'Change Product Status',
      text: `Do you want to approve or reject this product?`,
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Approve',
      denyButtonText: 'Reject',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      let newStatus = product.status;

      if (result.isConfirmed) {
        newStatus = 'Approved';
      } else if (result.isDenied) {
        newStatus = 'Rejected';
      } else {
        return; // If canceled, do nothing
      }

      this.productService.changeproductStatus(product._id, newStatus).subscribe({
        next: (updatedProduct) => {
          Swal.fire('Success!', `Product has been ${newStatus}.`, 'success');
          product.status = newStatus; // Update local product list
          this.applyFilter(); // Reapply filter to reflect changes
        },
        error: (err) => {
          console.error('Error updating product status:', err);
          Swal.fire('Error', 'Failed to update the product status.', 'error');
        },
      });
    });
  }

  deleteProduct(product: ProductToAdmin) {
    this.orderservice.getallordersP().subscribe({
      next: (response) => {
        console.log('Fetched Orders:', response); // Debugging

        if (!response || !Array.isArray(response.order)) {
          Swal.fire({
            title: 'Error!',
            text: 'Unexpected orders data format.',
            icon: 'error',
          });
          return;
        }

        const orders: OrderTo[] = response.order; // Extract orders array

        const isInPendingOrder = orders.some(
          (order) =>
            order.orderStatus === 'pending' &&
            order.items.some((item) => item.productId === product._id)
        );

        if (isInPendingOrder) {
          Swal.fire({
            title: 'Cannot Delete!',
            text: 'This product is in a pending order and cannot be deleted.',
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
          }).then((result) => {
            if (result.isConfirmed) {
              this.productService.Deleteproductbyid(product._id).subscribe({
                next: () => {
                  Swal.fire('Deleted!', 'Product has been deleted.', 'success');
                  this.products = this.products.filter((p) => p._id !== product._id);
                  this.applyFilter(); // Reapply filter to reflect changes
                },
                error: (err) => {
                  console.error('Error deleting product:', err);
                  Swal.fire('Error!', 'Failed to delete product.', 'error');
                },
              });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        Swal.fire('Error!', 'Could not check pending orders.', 'error');
      },
    });
  }

  applyFilter(): void {
    const filterValue = this.filterText.toLowerCase().trim();
    if (!filterValue) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(filterValue) ||
          product.description.toLowerCase().includes(filterValue)
      );
    }
    this.currentPage = 1;
    this.updatePagedProducts();
  }

  sortTable(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredProducts.sort((a: any, b: any) => {
      const valueA = key.split('.').reduce((o, k) => (o ? o[k] : ''), a);
      const valueB = key.split('.').reduce((o, k) => (o ? o[k] : ''), b);

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePagedProducts();
  }

  updatePagedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  firstPage(): void {
    this.currentPage = 1;
    this.updatePagedProducts();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePagedProducts();
    }
  }

  lastPage(): void {
    this.currentPage = this.totalPages();
    this.updatePagedProducts();
  }

  clearSearch(): void {
    this.filterText = '';
    this.applyFilter();
  }
}