import { Component, OnInit } from '@angular/core';
import { Products } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { SellerServicesService } from '../../services/seller-services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-add-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css',
})
export class SellerAddProductComponent implements OnInit {
  categories: Array<{ _id: string; name: string }> = [];

  productAdd: Products = new Products(
    '',
    '',
    '',
    0,
    '',
    0,
    0,
    0,
    '',
    false,
    0,
    new Date(),
    new Date(),
    [],
    ''
  );
  constructor(
    public prosrv: SellerServicesService,
    public router: Router,
    public ProductService: ProductService
  ) {}

  ngOnInit(): void {
    this.ProductService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories)
    });
  }
/*
  save() {
    // this.ProductService.createProduct(this.productAdd);
    // if (this.productAdd) {
      this.ProductService.createProduct(this.productAdd).subscribe((s) => {
        console.log(s);
        alert('product added sucessfully');
        this.router.navigate(['/dashboard']);
      });
    // } else {
    //   console.error('Product is undefined');
    // }
  }*/

save(){
  this.ProductService.createProduct(this.productAdd).subscribe((s)=>{
    console.log(s);
    alert('product added sucessfully');
        this.router.navigate(['/dashboard']);
  })

}


  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productAdd.images[index - 1] = e.target.result; // Save the base64 image
      };
      reader.readAsDataURL(file);
    }
  }
}
