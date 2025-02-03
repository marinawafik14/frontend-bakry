import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  header: any
  constructor(public httpClient: HttpClient, _authService:AuthService) {
      this.header = _authService.setHeaders()
  }

  getCartForUser(userId:string):Observable<any>{
      return this.httpClient.get<any>(`${environment.BASE_URL}/api/cart/user/${userId}`,
        {headers: this.header}
      )
  }

  removeCartItem(userId:string, productId:string):Observable<any>{
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
  clearCart(userId:string):Observable<any>{
    return this.httpClient.delete(`${environment.BASE_URL}/api/cart/clear/${userId}`)
  }

  
}
