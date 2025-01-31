import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {

  constructor(public httpClient: HttpClient) { }

  getCartForUser(userId:string):Observable<any>{
      return this.httpClient.get<any>(`${environment.BASE_URL}/api/cart/user/${userId}`)
  }

  removeCartItem(userId:string, productId:string):Observable<any>{
    // const userId= "679cb88e6228c2c41f8d3c6a"

    return this.httpClient.delete<any>(`${environment.BASE_URL}/api/cart/items/${productId}?userId=${userId}`)
  }

  getProuctById(productId:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.BASE_URL}/products/${productId}`)
  }

  updateCartItemQuantity(userId:string, productId:string, quantity:number):Observable<any>{
      const requestBody = {
        userId,
        quantity
      }
        return this.httpClient.put(`${environment.BASE_URL}/api/cart/update/${productId}`, requestBody)
  }
}
