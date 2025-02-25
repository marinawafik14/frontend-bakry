import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductToAdmin } from '../../models/productToAdmin';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
})
export class InventoryComponent implements OnInit {
  products: ProductToAdmin[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getallallproducts().subscribe({
      next: (data) => {
        console.log('Products fetched:', data);
        this.products = data;
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
}
