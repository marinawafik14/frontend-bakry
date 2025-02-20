import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import $ from 'jquery';
import { SellerServicesService } from '../../services/seller-services.service';
import { Products } from '../../models/products';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashbord-seller',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, RouterModule,FormsModule],
  templateUrl: './dashbord-seller.component.html',
  styleUrls: ['./dashbord-seller.component.css']
})
export class DashbordSellerComponent implements OnInit {
selectedPro :Products[]=[];
prods:Products | undefined
  constructor( public productSer:SellerServicesService,private router :Router) {}

  ngOnInit(): void {
    this.productSer.getAllProduct().subscribe((data)=>{
      this.selectedPro = data;
      //console.log(data)
      //console.log(this.selectedPro);

    })
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

delete(id: string) {
  this.confirmAction().then((result) => {
    if (result.isConfirmed) {
      this.productSer.deleteById(id).subscribe({
        next: () => {
          Swal.fire('Done!', 'Your action was successful.', 'success');

          this.selectedPro = this.selectedPro.filter(product => product._id !== id);
        },
        error: (err) => {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your action has been canceled.', 'info');
    }
  });
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






//check to accept only positive number

onPositiveNumber(event: any): void {
  const value = event.target.value;
  const regex = /^[+]?\d+(\.\d+)?$/;


  if (!regex.test(value)) {
    event.target.value = value.slice(0, -1); // Remove the invalid character
  }
}

}













