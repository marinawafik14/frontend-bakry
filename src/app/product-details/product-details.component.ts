import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink} from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartApiService } from '../_services/cart-api.service';
import { CommonModule } from '@angular/common';
import { Products } from '../models/products';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

  product: Products | null = null;
  quantity: number = 1;
  relatedProducts: Products[] = []; ;
  productId: string = '';
  selectedImage: string = '';
  errorMessage: string = '';
  constructor(private ac: ActivatedRoute, private productService: ProductService, public cartService:CartApiService) {}

  ngOnInit(): void {
    const productId = this.ac.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
          this.selectedImage = data.images[0];
        },
        error: (error) => {
          console.error("Error fetching product:", error);
          this.product = null;
        }
      });
    }
  }

  private notyf = new Notyf({
      duration: 3000,
      position: { x: 'center', y: 'bottom' }
    });

  changeImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

    increaseQuantity() {
      if (this.quantity < this.product!.stock) {
        this.quantity++;
        this.errorMessage = '';
      } else {
        this.notyf.error("Cannot add more than available stock!");
        this.errorMessage = 'Cannot add more than available stock!';
      }
    }

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
        this.errorMessage = '';
      }
    }

     //Add to Cart
     addToCart() {
      if (this.quantity > this.product!.stock) {
        this.notyf.error("Not enough stock available!");
        this.errorMessage = 'Not enough stock available!';
        return;
      }
  
      this.cartService.addToCart(this.product!._id, this.quantity, this.product!.price).subscribe(
        (response) => {
          console.log('Cart updated:', response);
          this.notyf.success("Cart updated successfully");
          this.errorMessage = '';
        },
        (error) => {
          this.notyf.error("Error adding to cart");
          console.error('Error adding to cart:', error);
        }
      );
    }


    getRelatedProducts() {
      this.productService.getProductsByCategory(this.product?.category!).subscribe((data) => {
        this.relatedProducts = data.filter((s:any) => s._id !== this.product!._id).slice(0, 4);
      });
    }

    categories = [
      {
        name: 'cookies',
        image: 'https://www.modernhoney.com/wp-content/uploads/2019/12/One-Bowl-Chocolate-Chip-Cookie-Recipe-5-scaled.jpg'
      },
      {
        name: 'cakes',
        image: 'https://w0.peakpx.com/wallpaper/379/1024/HD-wallpaper-yummy-cacke-birtay-cacke-happy.jpg'
      },
      {
        name: 'cupcakes',
        image: 'https://bellyfull.net/wp-content/uploads/2022/06/Strawberry-Shortcake-Cupcakes-blog-2.jpg'
      }
    ];

}
