import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CartApiService } from '../_services/cart-api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-cart',
  imports:[FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  userId:string = "67a11a306aeced4e3fd89f4d"
  cartItems:any[] = []
  total:number = 0
  errorMessage:boolean = false;
  decodedToken:any
  constructor(public cartServiceApi:CartApiService, public router:Router, public _authServie:AuthService){

  }
  ngOnInit(): void {
    this.decodedToken = this._authServie.getDecodedToken(); 
    if(this.decodedToken){
      this.userId = this.decodedToken.userId
    }
     this.getCartData();
  }

  //functions
  updateQuantity(item:any, quantityCase:number){

      item.quantity += quantityCase;

      if(item.quantity == 0) item.quantity = 1;
      this.updateCartQuantities();

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
}
