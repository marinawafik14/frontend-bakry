import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CartApiService } from '../_services/cart-api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_service/auth.service';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Component({
  selector: 'app-cart',
  imports:[FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  userId:string = ""
  cartItems:any[] = []
  total:number = 0
  errorMessage:boolean = false;
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
      this.errorMessage = false;
    }
    else{
        item.quantity += quantityCase;
        this.checkQuantity(item.quantity, productId);
        
    }

      this.updateCartQuantities();

  }

  checkQuantity(quantity:number ,productId:string){
    this.cartServiceApi.getProuctById(productId).subscribe({
      next: (res)=>{
       const stock = res.stock;
       if(quantity > stock)
        this.errorMessage = true;
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }
  removeCartItem(productId:string){
      this.cartServiceApi.removeCartItem(this.userId, productId).subscribe({
          next: (res)=>{
            console.log(res);
           this.getCartData();
          },
          error: (err)=>{
            console.log(err);
          }
      })

  }

  updateCartQuantities(){
      for(let item of this.cartItems){
          this.cartServiceApi.updateCartItemQuantity(this.userId, item.productId, Number(item.quantity))
          .subscribe({
            next: (res)=>{
                console.log(res);
            },
            error: (err)=>{
              console.log(err);
            }
          })
      }
  }

  getCartData(){
    this.cartServiceApi.getCartForUser(this.userId).subscribe({
      next: (res)=>{
        this.userId = res.data.userId
        this.cartItems = res.data.items;
        this.total = res.data.total
        this.fetchProductData()
      },
      error: (err)=>{
        console.log(err.error);
      }
    })
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
        this.errorMessage = true;
      return
      }
      this.errorMessage = false;
  }

  clearCart(){
    console.log('clear cart');
    this.cartServiceApi.clearCart(this.userId).subscribe({
        next:(res)=>{
          console.log(res);
          this.getCartData()
        },
        error:(err)=>{
            console.log(err);
        }
    })
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
    else{
         this.router.navigateByUrl('/Checkout')
    }

  }

  notLoggedIn(){
    Swal.fire({
      icon: "error",
      title: "No account found.",
      text: "Please sign up or log in to continue.",
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

}
