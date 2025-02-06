import { Component, OnInit } from '@angular/core';
import { Products } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SellerServicesService } from '../../services/seller-services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-add-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css',
})
export class SellerAddProductComponent implements OnInit {
  categories: Array<{ _id: string; name: string }> = [];

  productAdd: Products = new Products('','','',0,'',0,0,0,'',false,0,new Date(),new Date(),[],'');
  constructor(
    public prosrv: SellerServicesService,
    public ProductService: ProductService,
    private http: HttpClient,
    public router :Router,

  ) {}

  ngOnInit(): void {
    this.ProductService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories)
    });
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productAdd.images.push(file); // Push file i
    }
  }

  save() {
    const formData = new FormData();

    formData.append("name", this.productAdd.name);
    formData.append("description", this.productAdd.description);
    formData.append("price", this.productAdd.price.toString()); // ✅ Convert to string
    formData.append("stock", this.productAdd.stock.toString()); // ✅ Convert to string
    formData.append("categoryid", this.productAdd.categoryid.toString()); // ✅ Convert to string

    // Append images correctly
    this.productAdd.images.forEach((image, index) => {
      formData.append("images", image);
    });

    this.ProductService.createProduct(formData).subscribe(
      (response) => {
        console.log("✅ Product added:", response);

        // ✅ Show success SweetAlert instead of alert()
        Swal.fire({
          title: 'Success!',
          text: 'Product added successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(["/dashboard"]);
        });

      },
      (error) => {
        console.error(" Error adding product:", error);

        // ✅ Show error SweetAlert if the request fails
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
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
