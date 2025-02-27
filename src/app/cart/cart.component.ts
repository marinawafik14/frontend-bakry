import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CartApiService } from '../services/cart-api.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Component({
  selector: 'app-cart',
  imports:[FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  userId:string = ""
  cartItems:any[] = []
  total:number = 0
  quantityErrorMessage:boolean = false;
  decodedToken:any
  constructor(public cartServiceApi:CartApiService, public router:Router, public _authServie:AuthService){
    this.getUserId();
    this.getCartData();
  }

  private notyf = new Notyf({
    duration: 3000,  // Notification duration in milliseconds
    position: { x: 'center', y: 'bottom' } // Position on the screen
  });

  ngOnInit(): void {
     this.getCartData();
  }

  //functions
  updateQuantity(item:any, productId:string, quantityCase:number){

    if(quantityCase == -1){
      item.quantity += quantityCase;
      if(item.quantity == 0) item.quantity = 1;
    }
    else{
        item.quantity += quantityCase;
    }
    this.checkQuantity(item.quantity, productId);

      this.updateCartQuantities();
      // this.getCartData();
      this.updateTotal();

  }

  updateTotal(){
      this.cartServiceApi.getCartForUser(this.userId).subscribe({
        next: (res) => {
          this.total = res.data.total;
        },
        error: (err) => {
          console.log(err.error);
        }
      });
    
  }
  checkQuantity(quantity:number ,productId:string){
    this.cartServiceApi.getProuctById(productId).subscribe({
      next: (res)=>{
       const stock = res.stock;
       if(quantity > stock)
       {
        this.notyf.error('Not enough stock available');
        this.quantityErrorMessage = true;
       }
       else{
        this.quantityErrorMessage = false;
       }
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  removeCartItem(productId:string){
    if (this.userId) {
      // For logged-in user, make backend API call
      this.cartServiceApi.removehomeCartItem(this.userId, productId).subscribe({
        next: (res) => {
          this.notyf.success("Remove Item successfully");
          this.getCartData(); // Refresh cart data
        },
        error: (err) => {
          this.notyf.error("Failed to remove item");
          console.log(err);
        }
      });
    } else {
      // For guest user, remove item from localStorage
      let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      guestCart = guestCart.filter((item: any) => item.productId !== productId); // Remove item
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      this.getCartData(); // Refresh cart data
    }
  }

  updateCartQuantities(){
      for(let item of this.cartItems){
          this.cartServiceApi.updatehomeCartItemQuantity(this.userId, item.productId, Number(item.quantity))
          .subscribe({
            next: (res)=>{
                console.log(res);
                // this.calculateTotal(); 
            },
            error: (err)=>{
              console.log(err);
            }
          })
      }
  }
//************ */
  // onQuantityChange() {
  //   this.calculateTotal();
  // }
//************ */
  getCartData(){
    if (this.userId) {
      this.cartServiceApi.getCartForUser(this.userId).subscribe({
        next: (res) => {
          this.userId = res.data.userId;
          this.cartItems = res.data.items;
          this.total = res.data.total;
          this.fetchProductData();
        },
        error: (err) => {
          console.log(err.error);
        }
      });
    } else {
      // For guest users, load cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      this.cartItems = guestCart;
      // this.total = this.calculateTotal(guestCart);
      this.fetchProductData();
    }
  }

  fetchProductData(){
    for(let item of this.cartItems){
      this.cartServiceApi.getProuctById(item.productId).subscribe({
        next: (data)=>{
            item.name = data.name;
            item.category = data.category;
            item.image = data.images[0];
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }
  }

  checkInput(quantity:number){
      if(quantity<1){
        this.quantityErrorMessage = true;
      return
      }
      this.quantityErrorMessage = false;
  }

  clearCart() {
    this.notyf.success("Clearing cart...");
    if (this.userId) {
      this.cartServiceApi.clearhomeCart(this.userId).subscribe({
        next: (res) => {
          this.getCartData();
          this.notyf.success("Cart cleared successfully");
        },
        error: (err) => {
          console.log(err);
          this.notyf.error("Failed to clear cart");
        }
      });
    } else {
      localStorage.removeItem("guestCart");
      this.getCartData();
    }
  }
  

  getUserId(){
    this.decodedToken = this._authServie.getDecodedToken();
    if(this.decodedToken){
      this.userId = this.decodedToken.userId
      console.log(this.userId);
      }
  }


  proceddToCheckout(){
   const token =  this._authServie.getDecodedToken();
   if(!token){
    this.notLoggedIn()
   }
   else if(this.cartItems.length === 0){
    this.cartIsEmpty();
    }
    else if(this.quantityErrorMessage){
    this.notyf.error("No enough items");

    }
    else{
         this.router.navigateByUrl('/checkout')
    }

  }

  notLoggedIn(){
    Swal.fire({
      icon: "error",
      title: "No account found.",
      text: "Please sign up and log in to continue.",
    }).then(()=>{
      setTimeout(()=>{
        this.router.navigateByUrl('/login');
          }, 2000)
    })
  }

  cartIsEmpty(){
    // Swal.fire({
    //   title: "Your Cart is Empty",
    //   showClass: {
    //     popup: `
    //       animate__animated
    //       animate__fadeInUp
    //       animate__faster
    //     `
    //   },
    //   hideClass: {
    //     popup: `
    //       animate__animated
    //       animate__fadeOutDown
    //       animate__faster
    //     `
    //   }
    // });
    this.notyf.error("Your Cart is Empty");
  }

  // calculateTotal(cartItems: any[]): number {
  //   let total = 0;
  //   cartItems.forEach(item => {
  //     total += item.quantity * item.price;  // Multiply quantity by price for each item
  //   });
  // calculateTotal(): number {
  //   let total = 0;
  //   this.cartItems.forEach(item => {
  //     total += item.quantity * item.price;
  //   });

  //   return total;
  // }

}