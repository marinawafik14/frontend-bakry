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
      console.log(this.selectedPro);
    })
  }

  save(){
    if(this.prods){
      this.productSer.updateProduct(this.prods)
    }

    }
// delete product

delete(id:string){
  this.confirmAction().then((result) => {
    if (result.isConfirmed) {
      this.productSer.deleteById(id);
      Swal.fire('Done!', 'Your action was successful.', 'success');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your action has been canceled.', 'info');
    }
  });
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








update(id: string): void {
  this.prods = this.selectedPro.find(s => s._id ==id);
}







  }









