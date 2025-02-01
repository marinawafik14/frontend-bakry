import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { ActivatedRoute} from '@angular/router';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

  product: Product | null = null;
  productId: string = '';
  selectedImage: string = ''; // Store selected image
  constructor(private ac: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    const productId = this.ac.snapshot.paramMap.get('id');
    
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
          this.selectedImage = data.images[0]; // Set default image
        },
        error: (error) => {
          console.error("Error fetching product:", error);
          this.product = null;
        }
      });
    }
  }

  changeImage(imageUrl: string): void {
    this.selectedImage = imageUrl; // Update selected image
  }
}
