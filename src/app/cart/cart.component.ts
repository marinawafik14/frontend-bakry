import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../_services/cart-api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, TabsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  userId:string = "679cb88e6228c2c41f8d3c6a"
  cartItems:any[] = []
  total:number = 0
  errorMessage:boolean = false;
  constructor(public cartServiceApi:CartApiService, public router:Router){

  }
  ngOnInit(): void {
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
        console.log(err);
      }
    })
  }

  fetchProductData(){
    for(let item of this.cartItems){
      this.cartServiceApi.getProuctById(item.productId).subscribe({
        next: (data)=>{
            item.name = data.name;
            item.category = data.category;
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
