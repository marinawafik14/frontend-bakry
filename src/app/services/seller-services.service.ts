import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Products } from '../models/products';
import { Seller } from '../models/seller';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class SellerServicesService {
private url="http://localhost:8000/products";
private allproducts_url = "http://localhost:8000/allproducts";
private sellerState_url ="http://localhost:8000/seller-stats";

  constructor(private http:HttpClient) { }


  // get all products
  getAllProduct():Observable<Products[]>{
    return this.http.get<Products[]>(this.allproducts_url)
  }

// get  product by id

getById(id: string): Observable<Products> {
  const apiUrl = `${this.url}/${id}`;
  console.log("Fetching product from API:", apiUrl);
  return this.http.get<Products>(apiUrl);
}


// delete product by id
  deleteById(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

//  seller add  product
addProduct(pro:Products){
  return this.http.post<Products>(this.url,pro)
}

// seller update product

updateProduct(pro: Products): Observable<Products> {
  console.log("blaaaaa")
  return this.http.put<Products>(`${this.url}/${pro._id}`, pro);
}

// get seller state
getSellerStats(): Observable<Seller[]> {
  return this.http.get<Seller[]>(this.sellerState_url);
}

getProductBySellerId(id:string):Observable<any>  {
  return this.http.get(`http://localhost:8000/products/seller/${id}`);
}

getSellerIdFromToken(): string | null {
  const token = sessionStorage.getItem('tokenkey');  // Or from localStorage if needed
  if (token) {
    const decodedToken: any = jwtDecode(token);  // Use `jwt-decode` library to decode the JWT token
    return decodedToken.userId;  // Assuming `userId` is the seller's ID in the token
  }
  return null;
}

getSellerInventory(sellerId: string): Observable<any[]> {
  const token = sessionStorage.getItem('tokenkey');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  // The backend should filter by sellerId (e.g. /branch-inventory?sellerId=xxx)
  return this.http.get<any[]>(`http://localhost:8000/branch-inventory?sellerId=${sellerId}`, { headers });
}


getTotalOrders(sellerId: string): Observable<any> {
  return this.http.get(`http://localhost:8000/seller/totalOrders/${sellerId}`);
}

getTotalProducts(sellerId: string): Observable<any> {
  return this.http.get(`http://localhost:8000/seller/totalProducts/${sellerId}`);
}

getPendingProducts(sellerId: string): Observable<any> {
  return this.http.get(`http://localhost:8000/seller/pendingProducts/${sellerId}`);
}

getTotalSales(sellerId: string): Observable<any> {
  return this.http.get(`http://localhost:8000/seller/totalSales/${sellerId}`);
}


}
