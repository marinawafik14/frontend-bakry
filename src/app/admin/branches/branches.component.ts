import { Component, OnInit } from '@angular/core';
import { BranchesService } from '../../services/branches.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BranchInventory } from '../../models/ProductsInbranch';

@Component({
  selector: 'app-branches',
  imports: [CommonModule , RouterLinkActive , RouterLink],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent implements OnInit {
//branchid: string = '';  
productsinbranch!: BranchInventory; 
constructor(private branchesservice: BranchesService , private router:ActivatedRoute) { 
  
}
  ngOnInit(): void {
   const branchid = this.router.snapshot.paramMap.get('id'); 
//  console.log('Branch id:', branchid);
   if(branchid){
     this.branchesservice.getProductsByBranchId(branchid).subscribe({
       next: (data) => {
         this.productsinbranch = data;
         console.log('Products fetched:', this.productsinbranch);
       },
       error: (err) => {
         console.error('Error fetching products', err);
       },
     });

   }
  }
  }


