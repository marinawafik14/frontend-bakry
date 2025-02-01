import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LatestProductComponent } from "../latest-product/latest-product.component";
import { Products } from '../models/products';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, LatestProductComponent,CommonModule]
})
export class HomeComponent implements OnInit {
  topProducts: Products[] = [];


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((product)=>{
      this.topProducts = this.getTopProducts(product,5); //top 5 products
    })
  }



  getTopProducts(product: Products[], count: number): Products[] {
    return product.sort((a,b)=>b.sales - a.sales)
    .slice(0,count)
  }




}


