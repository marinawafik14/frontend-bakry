import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductToAdmin } from '../../models/productToAdmin';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BranchesService } from '../../services/branches.service';
import { Branch } from '../../models/branches';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductMainToAdmin } from '../../models/productsmaintoadmin';
import { OrderTo } from '../../models/orderTo';

@Component({
  imports: [FormsModule, NgxDatatableModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductosComponent implements OnInit {
  currentPage: number = 1;
  rowCount: number = 10;
  products: ProductToAdmin[] = [];
  mainproducts: ProductMainToAdmin[] = [];
  branches: Branch[] = [];
  orders: OrderTo[] = [];
  filteredProducts: ProductToAdmin[] = [];
  filteredmainProducts: ProductMainToAdmin[] = [];
  sortColumn: string = '';
  sortDirection: boolean = true;
  filterText: string = '';

  constructor(
    public productservice: ProductService,
    public branchservice: BranchesService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productservice.getAllProductsToMaininventory().subscribe({
      next: (response: any) => {
        console.log('Raw API Response:', response);
        this.mainproducts = response.data;

        if (this.mainproducts && this.mainproducts.length > 0) {
          this.filteredmainProducts = [...this.mainproducts];
        } else {
          console.warn('Main Products is empty!');
        }
      },
      error: (err) => {
        console.error('Error fetching products', err);
      },
    });
  }

  applyFilter(): void {
    const filterValue = this.filterText.toLowerCase().trim();
    this.filteredmainProducts = filterValue
      ? this.mainproducts.filter(
          (product) =>
            product.name.toLowerCase().includes(filterValue) ||
            product.status.toLowerCase().includes(filterValue)
        )
      : [...this.mainproducts];
    this.currentPage = 1;
  }

  sortTable(column: keyof ProductMainToAdmin): void {
    this.sortDirection =
      this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;
    this.filteredmainProducts.sort((a, b) => {
      return this.sortDirection
        ? a[column] > b[column]
          ? 1
          : -1
        : a[column] < b[column]
        ? 1
        : -1;
    });
  }

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
            this.mainproducts = this.mainproducts.filter(
              (product) => product._id !== productId
            );
            this.filteredmainProducts = [...this.mainproducts];
          },
          error: (err) => {
            Swal.fire('Error!', 'Failed to delete product.', 'error');
          },
        });
      }
    });
  }

  approve(product: any): void {
    this.branchservice.getallbranches().subscribe({
      next: (branches) => {
        this.showApproveModal(product, branches);
      },
      error: (err) => console.error('Error fetching branches:', err),
    });
  }

  // showApproveModal(product: any, branches: Branch[]): void {
  //   Swal.fire({
  //     title: `Transfer Stock for ${product.name}`,
  //     input: 'select',
  //     inputOptions: branches.reduce((options, branch) => {
  //       options[branch._id] = branch.name;
  //       return options;
  //     }, {}),
  //     inputPlaceholder: 'Select a branch',
  //     showCancelButton: true,
  //     confirmButtonText: 'Transfer Done',
  //     cancelButtonText: 'Cancel',
  //     inputValidator: (value) =>
  //       value ? undefined : 'You must select a branch!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const selectedBranchId = result.value;
  //       const transferQuantity = Math.floor(product.stock * 0.1);

  //       this.branchservice
  //         .transferStockfromadmin(
  //           product.productId._id,
  //           selectedBranchId,
  //           transferQuantity
  //         )
  //         .subscribe({
  //           next: () => {
  //             Swal.fire('Success!', `Stock transferred to branch.`, 'success');
  //             this.loadProducts();
  //           },
  //           error: (err) => {
  //             console.error('Error transferring stock:', err);
  //             Swal.fire('Error', 'Failed to transfer stock.', 'error');
  //           },
  //         });
  //     }
  //   });
  // }

  showApproveModal(product: any, branches: Branch[]): void {
    Swal.fire({
      title: `Transfer Stock for ${product.name}`,
      input: 'select',
      inputOptions: branches.reduce<Record<string, string>>(
        (options, branch) => {
          options[branch._id] = branch.name; // ✅ Now TypeScript knows keys are strings
          return options;
        },
        {}
      ),
      inputPlaceholder: 'Select a branch',
      showCancelButton: true,
      confirmButtonText: 'Transfer Done',
      cancelButtonText: 'Cancel',
      inputValidator: (value) =>
        value ? undefined : 'You must select a branch!',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedBranchId = result.value;
        const transferQuantity = Math.floor(product.stock * 0.1);

        this.branchservice
          .transferStockfromadmin(
            product.productId._id,
            selectedBranchId,
            transferQuantity
          )
          .subscribe({
            next: () => {
              Swal.fire('Success!', `Stock transferred to branch.`, 'success');
              this.loadProducts();
            },
            error: (err) => {
              console.error('Error transferring stock:', err);
              Swal.fire('Error', 'Failed to transfer stock.', 'error');
            },
          });
      }
    });
  }

  firstPage(): void {
    this.currentPage = 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  lastPage(): void {
    this.currentPage = this.totalPages;
  }

  get pagedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.rowCount;
    return this.filteredmainProducts.slice(
      startIndex,
      startIndex + this.rowCount
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredmainProducts.length / this.rowCount);
  }

  clearSearch(): void {
    this.filterText = '';
    this.applyFilter();
  }
}


