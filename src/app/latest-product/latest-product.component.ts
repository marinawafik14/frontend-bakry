import { Component, OnInit } from '@angular/core';
import { Products } from '../models/products';
import { ProductService } from '../services/product.service';
import { LastProductService } from '../services/last-product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-latest-product',
  imports: [CommonModule,],
  templateUrl: './latest-product.component.html',
  styleUrl: './latest-product.component.css'
})
export class LatestProductComponent implements OnInit {
constructor(private lastproductservice:LastProductService) {}
lastproducts:Products[]=[]; // to store last product addd

ngOnInit(): void {
  this.fetchlastProduct();
}

fetchlastProduct():void{
this.lastproductservice.getLastProducts().subscribe((data)=>{
  this.lastproducts=data;
},
(error)=>{
  console.log("error in fetching data")
})

}

}



