import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Notyf } from 'notyf';
import { CartApiService } from '../services/cart-api.service';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  constructor(public productService: ProductService, public route: ActivatedRoute, public CartService:CartApiService){}
  categoryName: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  availableFlavors: string[] = [];
  searchText: string = '';
  selectedFlavor: string = '';
  priceRange: number = 100;
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      
      this.categoryName = params['name'];
      console.log("params", params);
      console.log("Category Name from URL:", this.categoryName);

      if (this.categoryName) {
        this.fetchProducts();
      } else {
        console.error("Category Name is undefined");
      }
    });
  }

  public notyf = new Notyf({
    duration: 3000,
    position: { x: 'center', y: 'bottom' }
  });

  fetchProducts(): void {
    console.log("Fetching products for category:", this.categoryName);

    this.productService.getProductsByCategory(this.categoryName).subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractFlavors();
        console.log("Fetched Products:", this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }


  extractFlavors(): void {
    this.availableFlavors = [...new Set(this.products.map(product => product.flavor))];
  }

  applyFilters(): void {
    console.log("Selected Flavor:", this.selectedFlavor);
    this.filteredProducts = this.products.filter(product => {
      return (
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedFlavor === '' || product.flavor === this.selectedFlavor) &&
        product.price <= this.priceRange
      );
    });
  }

  addToCart(product: any) {
    const token = sessionStorage.getItem('tokenkey');
    const quantity = 1;
    if (token) {
      this.CartService.addToCart(product._id, quantity, product.price)
        .subscribe({
          next: (response) => {
            console.log("Product added successfully:", response);
            this.notyf.success("Product added successfully");
  
            // If response contains a new token, update the session storage
            if (response.token) {
              console.log("Updating token in session storage:", response.token);
              sessionStorage.setItem('tokenkey', response.token); //Store new token
            } else {
              console.warn("No new token received in response.");
            }
  
            this.CartService.refreshCartCount();
          },
          error: (err) => {
            this.notyf.error("Error adding to cart");
            console.error("Error adding to cart:", err);
          }
        });
    } else {
      // If no token, treat as a guest and add product to guest cart in localStorage
      let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
  
      // Check if the product already exists in the guest cart
      const existingItem = guestCart.find((item: any) => item.productId === product._id);
      if (existingItem) {
        existingItem.quantity += quantity; // Increase quantity if the item already exists
      } else {
        // If the item doesn't exist, add it to the guest cart
        guestCart.push({
          productId: product._id,
          quantity,
          price: product.price
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      console.log("Product added to guest cart in localStorage:", guestCart);
      this.CartService.refreshCartCount();
    }
  }

  
  

}
