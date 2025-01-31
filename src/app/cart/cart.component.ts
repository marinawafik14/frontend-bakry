import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../_services/cart-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  userId:string = "679cb88e6228c2c41f8d3c6a"
  cartItems:any[] = []
  total:number = 0
  constructor(public cartServiceApi:CartApiService, public router:Router){

  }
  ngOnInit(): void {
      this.cartServiceApi.getCartForUser(this.userId).subscribe({
        next: (res)=>{
          this.userId = res.data.userId
          this.cartItems = res.data.items;
          this.total = res.data.total
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
                    
        },
        error: (err)=>{
          console.log(err);
        }
      })
  }


  //functions
  updateQuantity(item:any, quantityCase:number){
      console.log(item);
      item.quantity += quantityCase;
      
      if(item.quantity == -1) item.quantity = 0;
      console.log(this.cartItems);
      
      
  }

  removeCartItem(productId:string){
      this.cartServiceApi.removeCartItem(this.userId, productId).subscribe({
          next: (res)=>{
            console.log(res);
            this.refreshPage()
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
      this.refreshPage();
  }

  refreshPage() {
    window.location.reload();
  }
}
