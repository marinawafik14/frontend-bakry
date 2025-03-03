import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductToAdmin } from '../../models/productToAdmin';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BranchesService } from '../../services/branches.service';
import { Branch } from '../../models/branches';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  imports: [FormsModule, NgxDatatableModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductosComponent implements OnInit {
  constructor(
    public productservice: ProductService,
    public branchservice: BranchesService
  ) {}

  products: ProductToAdmin[] = []; // All products
  filteredProducts: ProductToAdmin[] = []; // Filtered products for search
  pagedProducts: ProductToAdmin[] = []; // Products for the current page
  filterText: string = ''; // Search text
  sortKey: string = ''; // Column to sort by
  sortDirection: 'asc' | 'desc' = 'asc'; // Sort direction
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 10; // Number of items per page

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products from the service
  loadProducts(): void {
    this.productservice.getAllProductsToadmin().subscribe({
      next: (data: ProductToAdmin[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.updatePagedProducts();
        console.log('Products:', this.products);
      },
      error: (err) => {
        console.error('Error fetching products', err);
      },
    });
  }

  // Apply search filter
  applyFilter(): void {
    const filterValue = this.filterText.toLowerCase().trim();
    if (!filterValue) {
      this.filteredProducts = [...this.products]; // Reset to all products if search is empty
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(filterValue) || // Search by name
          product.status.toLowerCase().includes(filterValue) // Search by status
      );
    }
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePagedProducts();
  }

  // Sort the table
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

  // Update paged products
  updatePagedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  // Calculate total pages
  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Pagination navigation
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

  // Delete a product
  deleteProduct(productId: string): void {
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
            this.updatePagedProducts();
          },
          error: (err) => {
            Swal.fire('Error!', 'Failed to delete product.', 'error');
          },
        });
      }
    });
  }

  // Approve a product
  approve(product: any): void {
    this.branchservice.getallbranches().subscribe({
      next: (branches) => {
        this.showApproveModal(product, branches);
      },
      error: (err) => console.error('Error fetching branches:', err),
    });
  }

  // Show approve modal
  showApproveModal(product: any, branches: Branch[]): void {
    Swal.fire({
      title: `Transfer Stock for ${product.name}`,
      input: 'select',
      inputOptions: branches.reduce<Record<string, string>>((options, branch) => {
        options[branch._id] = branch.name;
        return options;
      }, {}),
      inputPlaceholder: 'Select a branch',
      showCancelButton: true,
      confirmButtonText: 'Transfer Done',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You must select a branch!';
        }
        return undefined;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedBranchId = result.value;
        const transferQuantity = Math.floor(product.stock * 0.1);

        this.branchservice
          .transferStockfromadmin(product._id, selectedBranchId, transferQuantity)
          .subscribe({
            next: () => {
              Swal.fire('Success!', 'Stock transferred to branch.', 'success');
              this.loadProducts(); // Refresh product list
            },
            error: (err) => {
              console.error('Error transferring stock:', err);
              Swal.fire('Error', 'Failed to transfer stock.', 'error');
            },
          });
      }
    });
  }
}