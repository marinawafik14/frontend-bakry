import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import $ from 'jquery';
import { SellerServicesService } from '../../services/seller-services.service';
import { Products } from '../../models/products';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderTo } from '../../models/orderTo';
import { OrdersService } from '../../services/order.service';

@Component({
  selector: 'app-dashbord-seller',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, RouterModule,FormsModule],
  templateUrl: './dashbord-seller.component.html',
  styleUrls: ['./dashbord-seller.component.css']
})
export class DashbordSellerComponent implements OnInit {
selectedPro :Products[]=[];
prods:Products | undefined;
isSeller: boolean = false;
sellerId: string | null = null;
searchTerm: string = '';
totalOrders: number = 0;
totalProducts: number = 0;
pendingProducts: number = 0;
totalSales: number = 0;
orders: OrderTo[] = [];

  constructor( public productSer:SellerServicesService,private router :Router, public authService:AuthService, public orderservice: OrdersService) {}

  ngOnInit(): void {
    this.sellerId = this.productSer.getSellerIdFromToken();  // Get seller ID from token

    if (this.sellerId) {
      this.productSer.getProductBySellerId(this.sellerId ).subscribe((data) => {
        console.log('Seller products:', data);
        this.selectedPro = data;
      });
    } else {
      console.error('Seller ID is missing');
    }

    this.loadDashboardData();

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

  // checkUserRole() {
  //   if (this.authService.isSeller()) {
  //     this.isSeller = true;
  //     console.log("Welcome, Seller!");
  //   } else {
  //     this.isSeller = false;
  //     console.log("you are not seller")
  //     this.router.navigateByUrl('/home');
  //   }
  // }

  getCategoryName(categoryid: string | { _id: string; name: string }): string {
    if (typeof categoryid === 'object') {
      return categoryid.name;
    }
    return 'Unknown';
  }

  getSellerName(sellerId: string | { _id: string; username?: string; profile?: { firstName?: string; lastName?: string } }): string {
    if (typeof sellerId === 'object') {
      if (sellerId.profile && sellerId.profile.firstName && sellerId.profile.firstName) {
        return `${sellerId.profile.firstName} ${sellerId.profile.lastName}`;
      }
    }
    return 'Unknown';
  }


  loadDashboardData(): void {
    this.productSer.getTotalOrders(this.sellerId!).subscribe(data => {
      this.totalOrders = data.totalOrders;
    });

    this.productSer.getTotalProducts(this.sellerId!).subscribe(data => {
      this.totalProducts = data.totalProducts;
    });

    this.productSer.getPendingProducts(this.sellerId!).subscribe(data => {
      this.pendingProducts = data.pendingProducts;
    });

    this.productSer.getTotalSales(this.sellerId!).subscribe(data => {
      this.totalSales = data.totalSales;
    });
  }


  save(){
    if(this.prods){
      this.productSer.updateProduct(this.prods)
    }

    }

confirmAction() {
  return Swal.fire({
    title: 'Are you sure you want to delete ?',
    text: 'You will not be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, do it!',
    cancelButtonText: 'Cancel',
  });
}

// delete(id: string) {
//   this.confirmAction().then((result) => {
//     if (result.isConfirmed) {
//       this.productSer.deleteById(id).subscribe({
//         next: () => {
//           Swal.fire('Done!', 'Your action was successful.', 'success');

//           this.selectedPro = this.selectedPro.filter(product => product._id !== id);
//         },
//         error: (err) => {
//           Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
//         }
//       });
//     } else if (result.dismiss === Swal.DismissReason.cancel) {
//       Swal.fire('Cancelled', 'Your action has been canceled.', 'info');
//     }
//   });
// }



delete(productId: string): void {
    const isInPendingOrder = this.orders.some(
      (order) =>
        order.orderStatus === 'pending' &&
        order.items.some((item) => item.productId === productId)
    );

    console.log("orderrrrrrs: ", this.orders);

    console.log("isInPendingOrder: ", isInPendingOrder);

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
          this.productSer.deleteById(productId).subscribe({
            next: () => {
              Swal.fire('Deleted!', 'Product has been deleted.', 'success');
              this.selectedPro = this.selectedPro.filter(
                (product) => product._id !== productId
              );
              // this.filteredProducts = [...this.selectedPro];
            },
            error: (err) => {
              Swal.fire('Error!', 'Failed to delete product.', 'error');
            },
          });
        }
      });
    }
  }


update(id: string): void {
  this.prods = this.selectedPro.find(s => s._id ===id);
}

 rowCount:number = 3; // Default number of rows
  isAscending = true;

// Update row count when user types a number

updateRowCount(event:any){
this.rowCount = parseInt(event.target.value,10)|| 5; // defult count

}




//sort table

sortTable(column: keyof Products) {
  this.isAscending = !this.isAscending;
  this.selectedPro.sort((a, b) => {
    return this.isAscending
      ? (a[column] > b[column] ? 1 : -1)
      : (a[column] < b[column] ? 1 : -1);
  });
}
/*
sortTable(column: keyof Products) {
  this.isAscending = !this.isAscending;
  this.selectedPro = [...this.selectedPro].sort((a, b) => {
    return this.isAscending
      ? (a[column] > b[column] ? 1 : -1)
      : (a[column] < b[column] ? 1 : -1);
  });

}
*/

filteredProducts(): any[] {
  if (!this.searchTerm) {
    return this.selectedPro; // No filtering if search term is empty
  }

  return this.selectedPro.filter(product => {
    return (
      (product.name && product.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (product.flavor && product.flavor.toLowerCase().includes(this.searchTerm.toLowerCase())) // Add other fields as needed
    );
  });
}






//check to accept only positive number

onPositiveNumber(event: any): void {
  const value = event.target.value;
  const regex = /^[+]?\d+(\.\d+)?$/;
  if (!regex.test(value)) {
    event.target.value = value.slice(0, -1); // Remove the invalid character
  }
}

}












