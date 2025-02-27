import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
private apiUrl = 'http://localhost:8000/cart/add';
private cartItems: any[] = [];
private cartCount = new BehaviorSubject<number>(0);
cartCount$ = this.cartCount.asObservable(); 

  header: any
  constructor(public httpClient: HttpClient, _authService:AuthService) {
      this.header = _authService.setHeaders()
  }

  getCartForUser(userId:string):Observable<any>{
      return this.httpClient.get<any>(`${environment.BASE_URL}/cart/user/${userId}`,
        {headers: this.header}
      )
  }

  removeCartItem(userId:string, productId:string):Observable<any>{

    return this.httpClient.delete<any>(`${environment.BASE_URL}/cart/items/${productId}?userId=${userId}`)
    .pipe(
      tap(() => this.refreshCartCount()) // Refresh count after removing
  );
  }

  removehomeCartItem(userId:string, productId:string):Observable<any>{

    return this.httpClient.delete<any>(`http://localhost:8000/homeitems/${productId}?userId=${userId}`)
    .pipe(
      tap(() => this.refreshCartCount()) // Refresh count after removing
  );
  }
  

  getProuctById(productId:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.BASE_URL}/products/${productId}`)
  }

  updateCartItemQuantity(userId: string | null, productId: string, quantity: number): Observable<any> {
    const token = sessionStorage.getItem("tokenkey");
    
    if (token) {
      // Logged-in user: Update cart on the server
      const headers = this.getAuthHeaders();
      const requestBody = { userId, quantity };
      
      return this.httpClient.put<any>(`${environment.BASE_URL}/cart/update/${productId}`, requestBody, { headers })
      .pipe(
        tap(() => this.refreshCartCount())
    );
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existingItem = guestCart.find((item: any) => item.productId === productId);
  
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        guestCart.push({ productId, quantity, price: 0 });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      console.log("Updated guest cart:", guestCart);
      this.refreshCartCount();
      return of(guestCart);
    }
  }
  

  updatehomeCartItemQuantity(userId: string | null, productId: string, quantity: number): Observable<any> {
    const token = sessionStorage.getItem("tokenkey");
    
    if (token) {
      // Logged-in user: Update cart on the server
      const headers = this.getAuthHeaders();
      const requestBody = { userId, quantity };
      
      return this.httpClient.put<any>(`http://localhost:8000/homeupdate/${productId}`, requestBody, { headers })
      .pipe(
        tap(() => this.refreshCartCount()) // Refresh after quantity update
    );
    } else {
      // Guest user: Update guest cart in localStorage
      let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      
      // Find the item in the guest cart
      const existingItem = guestCart.find((item: any) => item.productId === productId);
  
      if (existingItem) {
        // If the item exists, update its quantity
        existingItem.quantity = quantity;
      } else {
        // If the item does not exist, add it
        guestCart.push({ productId, quantity, price: 0 });
      }
     
      // Save the updated guest cart back to localStorage
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      console.log("🛒 Updated guest cart:", guestCart);
      this.refreshCartCount();
      // Return the updated cart
      return of(guestCart);
    }
  }
  



  clearCart(userId:string):Observable<any>{
    return this.httpClient.delete(`${environment.BASE_URL}/cart/clear/${userId}`)    .pipe(
      tap(() => this.refreshCartCount()) // Refresh after quantity update
  );
  }

  clearhomeCart(userId:string):Observable<any>{
    return this.httpClient.delete(`http://localhost:8000/homeclear/${userId}`)    .pipe(
      tap(() => this.refreshCartCount()) // Refresh after quantity update
  );
  }

    // Get cart items
    // getCartItems() {
    //   return this.cartItems;
    // }

    // // Get current cart count
    // getCartCount() {
    //   return this.cartCount.value;
    // }

    private getAuthHeaders(): HttpHeaders {
      const token = sessionStorage.getItem('tokenkey');
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.warn("No token found in sessionStorage!");
      }
    
      return headers;
    }

    addToCart(productId: string, quantity: number, price: number): Observable<any> {
      const token = sessionStorage.getItem("tokenkey");
    
      if (token) {
        const headers = this.getAuthHeaders();
        const requestBody = { productId, quantity, price };
    
        return this.httpClient.post<any>(`${this.apiUrl}`, requestBody, { headers })
        .pipe(
          tap(() => this.refreshCartCount()) // Refresh count after adding
      );
      } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    
        const existingItem = guestCart.find((item: any) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          guestCart.push({ productId, quantity, price });
        }
    
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        console.log("Item added to guest cart:", guestCart);
        
        this.refreshCartCount();
        return of(guestCart);
      }
    }

    addTohomeCart(productId: string, quantity: number, price: number): Observable<any> {
      const token = sessionStorage.getItem("tokenkey");
    
      if (token) {
        const headers = this.getAuthHeaders();
        const requestBody = { productId, quantity, price };
    
        return this.httpClient.post<any>(`http://localhost:8000/homecart/add`, requestBody, { headers })
        .pipe(
          tap(() => this.refreshCartCount()) // Refresh count after adding
      );
      } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    
        const existingItem = guestCart.find((item: any) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          guestCart.push({ productId, quantity, price });
        }
    
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        console.log("Item added to guest cart:", guestCart);
        
        this.refreshCartCount();
        return of(guestCart);
      }
    }
    

  refreshCartCount() {
    const token = sessionStorage.getItem('tokenkey'); 
    if (token) {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
      this.cartCount.next(decodedToken.cartItems?.length || 0); 
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      this.cartCount.next(guestCart.length); 
    }
}
 
    
}

