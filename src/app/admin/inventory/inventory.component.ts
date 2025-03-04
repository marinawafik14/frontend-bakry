import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductToAdmin } from '../../models/productToAdmin';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OrdersService } from '../../services/order.service';
import { Order } from '../../models/order';
import { orderToAdmin } from '../../models/orderToAdmin';
import { OrderTo } from '../../models/orderTo';

@Component({
  selector: 'app-product-list',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
})
export class InventoryComponent implements OnInit {
  products: ProductToAdmin[] = [];
  orders: OrderTo[] = [];
  constructor(
    private productService: ProductService,
    private orderservice: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    // this.orderservice.getallorders().subscribe({
    //   next: (data) => {
    //     console.log('Orders fetched:', data);
    //     if(data){
    //       this.orders = data;
    //     }
    //     //this.orders = data;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching orders:', err);
    //   },
    // });
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
      Swal.fire(
        'Already Approved',
        'This product is already approved.',
        'info'
      );
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

      this.productService
        .changeproductStatus(product._id, newStatus)
        .subscribe({
          next: (updatedProduct) => {
            Swal.fire('Success!', `Product has been ${newStatus}.`, 'success');
            product.status = newStatus; // Update local product list
          },
          error: (err) => {
            console.error('Error updating product status:', err);
            Swal.fire('Error', 'Failed to update the product status.', 'error');
          },
        });
    });
  }

  // deleteProduct(product: any) {
  //   this.orderservice.getallordersP().subscribe({
  //     next: (orders: OrderTo[]) => {
  //       console.log('Fetched Orders:', orders); // Debugging to check the structure

  //       if (!Array.isArray(orders)) {
  //         Swal.fire({
  //           title: 'Error!',
  //           text: 'Unexpected orders data format.',
  //           icon: 'error',
  //         });
  //         return;
  //       }

  //       // Ensure orders have items before checking
  //       const isInPendingOrder = orders.some(
  //         (order) =>
  //           order.orderStatus === 'pending' &&
  //           Array.isArray(order.items) &&
  //           order.items.some((item) => item.productId === product._id)
  //       );

  //       if (isInPendingOrder) {
  //         Swal.fire({
  //           title: 'Cannot Delete!',
  //           text: 'This product is in a pending order and cannot be deleted.',
  //           icon: 'error',
  //         });
  //       } else {
  //         Swal.fire({
  //           title: 'Are you sure?',
  //           text: "You won't be able to revert this!",
  //           icon: 'warning',
  //           showCancelButton: true,
  //           confirmButtonColor: '#d33',
  //           cancelButtonColor: '#3085d6',
  //           confirmButtonText: 'Yes, delete it!',
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.productService.Deleteproductbyid(product._id).subscribe({
  //               next: () => {
  //                 Swal.fire('Deleted!', 'Product has been deleted.', 'success');
  //                 this.products = this.products.filter(
  //                   (p) => p._id !== product._id
  //                 );
  //               },
  //               error: (err) => {
  //                 console.error('Error deleting product:', err);
  //                 Swal.fire('Error!', 'Failed to delete product.', 'error');
  //               },
  //             });
  //           }
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching orders:', err);
  //       Swal.fire('Error!', 'Could not check pending orders.', 'error');
  //     },
  //   });
  // }
  deleteProduct(product: any) {
    this.orderservice.getallordersP().subscribe({
      next: (response) => {
        console.log('Fetched Orders:', response); // Debugging

        // Ensure response is in the expected format
        if (!response || !Array.isArray(response.order)) {
          Swal.fire({
            title: 'Error!',
            text: 'Unexpected orders data format.',
            icon: 'error',
          });
          return;
        }

        const orders: OrderTo[] = response.order; // Extract orders array

        // Check if the product exists in any pending orders
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
                  this.products = this.products.filter(
                    (p) => p._id !== product._id
                  );
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
}
