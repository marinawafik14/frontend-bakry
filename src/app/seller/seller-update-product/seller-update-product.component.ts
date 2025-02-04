import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerServicesService } from '../../services/seller-services.service';
import { Products } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserserviceService } from '../../services/user.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SellerUpdateProductComponent implements OnInit {
  productUP: Products = new Products(
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

  categories: Products[] = [];

  constructor(
    private updateProSrv: SellerServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private catogryies: ProductService,
    private authService :UserserviceService
  ) {}

  ngOnInit(): void {



    if (!this.productUP || !this.productUP._id) {
      console.warn('⚠️ No valid product found in localStorage. Fetching from API...');
    }

    // Step 2: Fetch product from API if ID is available
    this.route.params.subscribe((params) => {
      const productID = params['id'];
      if (productID) {
        this.updateProSrv.getById(productID).subscribe((product) => {
          if (product) {
            this.productUP = product;
            console.log('✅ Loaded productUP from API:', this.productUP);

            // Step 3: Now fetch category products (AFTER `productUP.category` is set)

          }
        });
      }
    });

    this.catogryies.getProductsByCategory(this.productUP.category).subscribe((g) => {
      this.categories = g;
      console.log('✅ Categories loaded:', this.categories);
    });
  }






  updateProduct(): void {
    console.log('🚀 Attempting to update product:', this.productUP);

    if (!this.productUP._id || !this.productUP.name || !this.productUP.price || !this.productUP.categoryid) {
      console.error('❌ Missing required fields:', this.productUP);
      return;
    }

    this.updateProSrv.updateProduct(this.productUP).subscribe(
      (updatedProduct) => {
        console.log('✅ Update successful:', updatedProduct);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('❌ Update failed:', error);
      }
    );
  }


  onFileSelected(event: Event, imageIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (this.productUP.images.length < imageIndex) {
          this.productUP.images.push(reader.result as string);
        } else {
          this.productUP.images[imageIndex - 1] = reader.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  }






}

