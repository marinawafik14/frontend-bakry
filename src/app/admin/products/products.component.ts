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
import { branchInventory } from '../../models/branchinventory';
import { BranchesService } from '../../services/branches.service';
import { Branch } from '../../models/branches';
import { ProductMainToAdmin } from '../../models/productsmaintoadmin';

@Component({
  selector: 'app-products',
  imports: [FormsModule, NgxDatatableModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductosComponent implements OnInit {
  products: ProductToAdmin[] = [];
  mainproducts: ProductMainToAdmin[] = [];
  branches: Branch[] = [];
  orders: OrderTo[] = [];
  filteredProducts: ProductToAdmin[] = [];
  filteredmainProducts: ProductMainToAdmin[] = [];
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
    public orderservice: OrdersService,
    public branchservice: BranchesService
  ) {}
  ngOnInit(): void {
    this.loadProducts();
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

  // loadproducts(){
  //       this.productservice.getAllProductsToMaininventory().subscribe({
  //         next: (data: ProductMainToAdmin[]) => {
  //           this.products = data;
  //           this.filteredProducts = data;
  //           console.log('Products fetched:', this.products);
  //           console.log(this.filteredProducts);
  //           console.log(this.products);
  //         },
  //         error: (err) => {
  //           console.error('Error fetching products', err);
  //         },
  //       });

  // }

  // loadProducts() {
  //   this.productservice.getAllProductsToMaininventory().subscribe({
  //     next: (response: any) => {
  //       this.mainproducts = response.data; // Accessing 'data' instead of 'response'
  //       console.log('Products fetched:', this.mainproducts);
  //       this.filteredmainProducts = this.mainproducts;
  //       console.log('Products fetched:', this.products);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching products', err);
  //     },
  //   });
  // }
  loadProducts() {
    this.productservice.getAllProductsToMaininventory().subscribe({
      next: (response: any) => {
        console.log('Raw API Response:', response); // Log raw response
        this.mainproducts = response.data; // Assign main products
        console.log('Main Products After API:', this.mainproducts);

        // Ensure assignment happens only after data is available
        if (this.mainproducts && this.mainproducts.length > 0) {
          this.filteredmainProducts = [...this.mainproducts];
        } else {
          console.warn('Main Products is empty!');
        }

        console.log('Filtered Products:', this.filteredmainProducts);
      },
      error: (err) => {
        console.error('Error fetching products', err);
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
  // approve(_id: string) {
  //   this.productservice.getProductById(_id).subscribe((product) => {
  //     if (product.status === 'Approved') {
  //       Swal.fire({
  //         icon: 'info',
  //         title: 'Already Approved',
  //         text: 'This product is already approved.',
  //         confirmButtonText: 'OK',
  //       });
  //     } else {
  //       Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'Do you want to approve this product?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, approve it!',
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.productservice.changeproductStatus(_id, 'Approved').subscribe(
  //             (updatedProduct) => {
  //               Swal.fire({
  //                 icon: 'success',
  //                 title: 'Approved!',
  //                 text: `The product "${updatedProduct.name}" is now approved.`,
  //               });
  //             },
  //             (error) => {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: 'Error',
  //                 text: 'Failed to update the product status.',
  //               });
  //             }
  //           );
  //         }
  //       });
  //     }
  //   });
  // }

  approve(product: any): void {
    // Fetch branches first
    this.branchservice.getallbranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.showApproveModal(product);
      },
      error: (err) => console.error('Error fetching branches:', err),
    });
  }

  showApproveModal(product: any): void {
    Swal.fire({
      title: `Transfer Stock for ${product.name}`,
      input: 'select',
      inputOptions: this.branches.reduce<Record<string, string>>(
        (options, branch) => {
          options[branch._id] = branch.name;
          return options;
        },
        {}
      ),
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
          .transferStockfromadmin(
            product.productId._id,
            selectedBranchId,
            transferQuantity
          )
          .subscribe({
            next: () => {
              Swal.fire('Success!', ` stock transferred to branch.`, 'success');
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

  // reject(_id: string) {
  //   this.productservice.getProductById(_id).subscribe((product) => {
  //     if (product.status === 'Rejected') {
  //       Swal.fire({
  //         icon: 'info',
  //         title: 'Already Rejected',
  //         text: 'This product is already rejected.',
  //         confirmButtonText: 'OK',
  //       });
  //     } else if (product.status === 'Out of Stock') {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Action Not Allowed',
  //         text: "You can't reject this product because it's out of stock.",
  //         confirmButtonText: 'OK',
  //       });
  //     } else {
  //       Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'Do you want to reject this product?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#d33',
  //         cancelButtonColor: '#3085d6',
  //         confirmButtonText: 'Yes, reject it!',
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.productservice.changeproductStatus(_id, 'Rejected').subscribe(
  //             (updatedProduct) => {
  //               Swal.fire({
  //                 icon: 'success',
  //                 title: 'Rejected!',
  //                 text: `The product "${updatedProduct.name}" is now rejected.`,
  //               });
  //             },
  //             (error) => {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: 'Error',
  //                 text: 'Failed to update the product status.',
  //               });
  //             }
  //           );
  //         }
  //       });
  //     }
  //   });
  // }
}
