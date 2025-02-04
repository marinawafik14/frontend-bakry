import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartApiService } from '../_services/cart-api.service';
import { CommonModule } from '@angular/common';

// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

  product: Product | null = null;
  quantity: number = 1;
  relatedProducts: Product[] = []; ;
  productId: string = '';
  selectedImage: string = ''; // Store selected image
  constructor(private ac: ActivatedRoute, private productService: ProductService, public cartService:CartApiService) {}

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

    // Increase Quantity (Max: Stock Limit)
    increaseQuantity(): void {
      if (this.quantity < this.product!.stock) {
        this.quantity++;
      }
    }
  
    // Decrease Quantity (Min: 1)
    decreaseQuantity(): void {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  
    // Add to Cart Only If Stock is Available
    addToCart(product: any) {
      const quantity = 1; // Default quantity (modify if needed)
      this.cartService.addToCart(product._id, quantity, product.price);
    }
    

    getRelatedProducts() {
      this.productService.getProductsByCategory(this.product?.category!).subscribe((data) => {
        this.relatedProducts = data.filter((s:any) => s._id !== this.product!._id).slice(0, 4); // Exclude current product
      });
    }

    // timer: any;
    // remainingTime: string = '';

    // startCountdown(endDate: string) {
    //   const interval = setInterval(() => {
    //     const now = new Date().getTime();
    //     const timeLeft = new Date(endDate).getTime() - now;
        
    //     if (timeLeft <= 0) {
    //       clearInterval(interval);
    //       this.remainingTime = "Offer expired";
    //     } else {
    //       let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    //       let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //       let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    //       this.remainingTime = `${days}d ${hours}h ${minutes}m left`;
    //     }
    //   }, 1000);
    // }

    // addToWishlist(product: any) {
    //   let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    //   if (!wishlist.some((p:any) => p._id === product._id)) {
    //     wishlist.push(product);
    //     localStorage.setItem('wishlist', JSON.stringify(wishlist));
    //     // this.toastr.success('Added to Wishlist!', 'Success');
    //   } else {
    //     // this.toastr.info('Product already in Wishlist', 'Info');
    //   }
    // }

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
