import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../_models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartApiService } from '../_services/cart-api.service';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  constructor(public productService: ProductService, public route: ActivatedRoute, public CartService:CartApiService){}
  categoryName: string = '';
  products: any[] = []; // Store products
  filteredProducts: any[] = []; // Store filtered products
  availableFlavors: string[] = []; // Unique flavors list

  searchText: string = '';
  selectedFlavor: string = '';
  priceRange: number = 100; // Default max price

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['name']; // Get category name from URL
  
      console.log("Category Name from URL:", this.categoryName); // Debugging
  
      if (this.categoryName) {
        this.fetchProducts(); // Fetch products for this category
      } else {
        console.error("Category Name is undefined");
      }
      // this.selectedFlavor = 'All Flavors';
    });
  }

  fetchProducts(): void {
    console.log("Fetching products for category:", this.categoryName); // Debugging
  
    this.productService.getProductsByCategory(this.categoryName).subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data; // Ensure all products are visible initially
        this.extractFlavors();
        console.log("Fetched Products:", this.products); // Debugging
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  

  extractFlavors(): void {
    this.availableFlavors = [...new Set(this.products.map(product => product.flavor))]; // Get unique flavors
  }

  applyFilters(): void {
    console.log("Selected Flavor:", this.selectedFlavor);
    this.filteredProducts = this.products.filter(product => {
      return (
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) && // Search by name
        (this.selectedFlavor === '' || product.flavor === this.selectedFlavor) && // Filter by flavor
        product.price <= this.priceRange // Filter by price
      );
    });
  }

  addToCart(product: any) {
    const quantity = 1; // Default quantity (modify if needed)
    this.CartService.addToCart(product._id, quantity, product.price);
  }

  categories = [
    {
      name: 'Cookies',
      image: 'https://www.modernhoney.com/wp-content/uploads/2019/12/One-Bowl-Chocolate-Chip-Cookie-Recipe-5-scaled.jpg'
    },
    {
      name: 'Cakes',
      image: 'https://w0.peakpx.com/wallpaper/379/1024/HD-wallpaper-yummy-cacke-birtay-cacke-happy.jpg'
    },
    {
      name: 'Cupcakes',
      image: 'https://bellyfull.net/wp-content/uploads/2022/06/Strawberry-Shortcake-Cupcakes-blog-2.jpg'
    }
  ];

}
