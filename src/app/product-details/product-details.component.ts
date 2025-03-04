import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartApiService } from '../services/cart-api.service';
import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';
import { Products } from '../models/products';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Products | null = null;
  quantity: number = 1;
  relatedProducts: Products[] = [];
  productId: string = '';
  selectedImage: string = '';
  errorMessage: string = '';
  quantityErrorMessage: boolean = false;

  private notyf = new Notyf({
    duration: 3000,
    position: { x: 'center', y: 'bottom' }
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartApiService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
          // Use safe navigation for images with fallback if none provided.
          this.selectedImage = data.images?.[0] || 'assets/default.jpg';
          this.getRelatedProducts();
        },
        error: (error) => {
          console.error("Error fetching product:", error);
          this.product = null;
        }
      });
    }
  }

  changeImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
      this.errorMessage = '';
      this.checkQuantity(this.quantity, this.product._id);
    } else {
      this.notyf.error("Cannot add more than available stock!");
      this.errorMessage = 'Cannot add more than available stock!';
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.errorMessage = '';
      this.checkQuantity(this.quantity, this.product!._id);
    }
  }

  addToCart(): void {
    if (!this.product) return;
    if (this.quantity > this.product.stock) {
      this.notyf.error("Not enough stock available!");
      this.errorMessage = 'Not enough stock available!';
      return;
    }
  
    this.cartService.addTohomeCart(this.product._id, this.quantity, this.product.price).subscribe({
      next: (response) => {
        console.log('Cart updated:', response);
        this.notyf.success("Cart updated successfully");
        this.errorMessage = '';
      },
      error: (error) => {
        this.notyf.error("Error adding to cart");
        console.error("Error adding to cart:", error);
      }
    });
  }

  checkQuantity(quantity: number, productId: string): void {
    this.cartService.getProuctById(productId).subscribe({
      next: (res) => {
        const stock = res.stock; // assuming your API returns the product's stock
        if (quantity > stock) {
          this.notyf.error('Not enough stock available');
          this.quantityErrorMessage = true;
        } else {
          this.quantityErrorMessage = false;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  

  getRelatedProducts(): void {
    if (!this.product) return;
    this.productService.getProductsByCategory(this.product.category).subscribe({
      next: (data) => {
        // Exclude the current product and limit to 4 related items.
        this.relatedProducts = data.filter((p: Products) => p._id !== this.product?._id).slice(0, 4);
      },
      error: (error) => {
        console.error("Error fetching related products:", error);
      }
    });
  }
}
