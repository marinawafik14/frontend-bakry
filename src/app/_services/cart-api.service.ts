import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private apiUrl = 'http://localhost:8000/cart/add';

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
    private cartItems: any[] = [];
    private cartCount = new BehaviorSubject<number>(0);

    cartCount$ = this.cartCount.asObservable(); // Expose count as Observable

    // Get cart items
    getCartItems() {
      return this.cartItems;
    }
  
    // Get current cart count
    getCartCount() {
      return this.cartCount.value;
    }

  
  // Function to retrieve the token from SESSION STORAGE
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('tokenkey');
    if (!token) {
      console.error("No token found in SessionStorage");
    }

    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Updated Add Product to Cart
  addToCart(productId: string, quantity: number, price: number): Observable<any> {
    const requestBody = { productId, quantity, price };

    // console.log("📤 Sending request to:", this.apiUrl);
    // console.log("📦 Request Body:", requestBody);
    // console.log("📝 Headers:", this.getAuthHeaders().keys());

    return this.httpClient.post<any>(this.apiUrl, requestBody, {
      headers: this.getAuthHeaders()
    });
  }

  //Load Cart Count from Token
    loadCartCount() {
      const token = localStorage.getItem('token');
      if (token) {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
        this.cartCount.next(decodedToken.cartItems?.length || 0);
      }
    }

}
