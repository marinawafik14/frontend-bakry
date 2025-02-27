import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Notyf } from 'notyf';
import { CartApiService } from '../../services/cart-api.service';
import { AuthService } from '../../services/auth.service';
import { Products } from '../../../../src/app/models/products';

@Component({
  selector: 'app-cashier-products',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cashier-products.component.html',
  styleUrls: ['./cashier-products.component.css']
})
export class CashierProductsComponent implements OnInit {
  categoryName: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  availableFlavors: string[] = [];
  searchText: string = '';
  selectedFlavor: string = '';
  priceRange: number = 100;
  cashierId: string = '';

  public notyf = new Notyf({
    duration: 3000,
    position: { x: 'center', y: 'bottom' }
  });

  constructor(
    public productService: ProductService,
    public route: ActivatedRoute,
    public CartService: CartApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['name'];
      console.log('Category Name from URL:', this.categoryName);

      this.cashierId = this.getCashierIdFromToken();
      console.log('Cashier ID:', this.cashierId);

      if (this.categoryName && this.cashierId) {
        this.fetchBranchProducts();
      } else {
        console.error('Category Name or Cashier ID is undefined');
      }
    });
  }

  fetchBranchProducts(): void {
    this.productService.getBranchProducts(this.cashierId, this.categoryName).subscribe({
      next: (res) => {
        console.log('Fetched products:', res.products);
        this.products = res.products.map((invItem: any) => {
          return {
            _id: invItem.productId?._id,
            branchInventoryId: invItem._id,   
            name: invItem.productId?.name,
            flavor: invItem.productId?.flavor,
            images: invItem.productId?.images || [],
            price: invItem.price,
            stock: invItem.currentStock || 0,
          };
        });;
        this.filteredProducts = [...this.products];
        this.extractFlavors();
      },
      error: (error) => {
        console.error('Error fetching branch products:', error);
      }
    });
  }

  extractFlavors(): void {
    this.availableFlavors = [
      ...new Set(this.products.map(product => product.flavor))
    ];
  }

  applyFilters(): void {
    console.log('Selected Flavor:', this.selectedFlavor);
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
            if (response.token) {
              console.log("Updating token in session storage:", response.token);
              sessionStorage.setItem('tokenkey', response.token);
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
      let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existingItem = guestCart.find((item: any) => item.productId === product._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
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
  

  getCashierIdFromToken(): string {
    const decodedToken = this.authService.getDecodedToken();
    return decodedToken?.userId || '';
  }
}
