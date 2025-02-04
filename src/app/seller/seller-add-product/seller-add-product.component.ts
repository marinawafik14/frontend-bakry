import { Component, OnInit } from '@angular/core';
import { Products } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    public ProductService: ProductService,
    private http: HttpClient,

  ) {}

  ngOnInit(): void {
    this.ProductService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories)
    });
  }



    onFileSelected(event: any, index: number): void {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert('File size exceeds the 10MB limit!');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.productAdd.images[index - 1] = e.target.result; // Save the base64 image
        };
        reader.readAsDataURL(file);
      }
    }
    save(): void {
      const formData = new FormData();
      formData.append('name', this.productAdd.name);
      formData.append('description', this.productAdd.description);
      formData.append('price', this.productAdd.price.toString());
      formData.append('stock', this.productAdd.stock.toString());
      formData.append('categoryid', this.productAdd.categoryid.toString());

      // Append files
      const imageInputs = document.querySelectorAll('input[type="file"]');
      imageInputs.forEach((input: any, index: number) => {
        const file = input.files[0];
        if (file) {
          formData.append(`image${index + 1}`, file);
        }
      });

      this.http.post('http://localhost:8000/products', formData)
        .subscribe(response => console.log('Product added successfully!', response));
    }




    onPositiveNumber(event: any): void {
      const value = event.target.value;
      const regex = /^[+]?\d+(\.\d+)?$/; // Regex for positive integer
      if (!regex.test(value)) {
        event.target.value = value.slice(0, -1); // Remove the invalid character
      }
    }



}
