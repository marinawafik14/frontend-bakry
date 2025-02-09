import { Component, OnInit } from '@angular/core';
import { productToAdmin } from '../../models/productToAdmin';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductosComponent implements OnInit {
  products: productToAdmin[] = [];

  constructor(public productservice:ProductService) {
    
    
  }
  ngOnInit(): void {
     this.productservice.getAllProductsToadmin().subscribe({
       next: (data: productToAdmin[]) => {
         this.products = data;
         console.log('Products fetched:', this.products);
       },
       error: (err) => {
         console.error('Error fetching products', err);
       },
     });
  }


}
