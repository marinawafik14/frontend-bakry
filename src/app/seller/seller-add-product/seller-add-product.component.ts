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


    onFileSelected(event: any, index: number): void {
      const file = event.target.files[0];
      if (file) {
        this.productAdd.images[index - 1] = file; // Store File object
      }
    }

    save() {
      const formData = new FormData();
    
      formData.append("name", this.productAdd.name);
      formData.append("description", this.productAdd.description);
      formData.append("price", this.productAdd.price.toString()); // Convert to string
      formData.append("stock", this.productAdd.stock.toString());
      // formData.append("createdAt", this.productAdd.createdAt.toISOString());

        // ✅ Convert createdAt to a Date before calling toISOString()
        if (typeof this.productAdd.createdAt === "string") {
          this.productAdd.createdAt = new Date(this.productAdd.createdAt);
        }

        // ✅ Check if createdAt is a valid Date before calling toISOString()
        if (!isNaN(this.productAdd.createdAt.getTime())) {
          formData.append("createdAt", this.productAdd.createdAt.toISOString());
        } else {
          console.error("Invalid createdAt value:", this.productAdd.createdAt);
          formData.append("createdAt", new Date().toISOString()); // Use current date if invalid
        }
    
      // Append images
      this.productAdd.images.forEach((image, index) => {
        formData.append(`images`, image); // Append each image file
      });
    
      this.ProductService.createProduct(formData).subscribe(
        (response) => {
          console.log(response);
          alert("Product added successfully");
          this.router.navigate(["/dashboard"]);
        },
        (error) => {
          console.error("Error adding product:", error);
        }
      );
    } 
}
