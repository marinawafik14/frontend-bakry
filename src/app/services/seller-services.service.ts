import { HttpClient } from '@angular/common/http';
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
private sellerSales_url ="http://localhost:8000/products/seller";

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
  return this.http.put<Products>(`${this.url}/${pro._id}`, pro);
}

// get seller state
/*
getSellerStats(): Observable<Seller[]> {
  const token = sessionStorage.getItem('tokenkey');

  if (!token) {
    throw new Error('No token found, user is not logged in.');
  }
  const decodedToken: any = jwtDecode(token);
  const sellerId = decodedToken.userId;
  return this.http.get<Seller[]>(`${this.sellerSales_url}/sales`);
  headers: {
    Authorization: `Bearer ${token}`, // Include token for authentication
  },
}

}
*/


getSellerStats(): Observable<Seller[]> {
  const token = sessionStorage.getItem('tokenkey');

  if (!token) {
    throw new Error('No token found, user is not logged in.');
  }

  const decodedToken: any = jwtDecode(token);
  const sellerId = decodedToken.userId || decodedToken.userid || decodedToken._id;

  return this.http.get<Seller[]>(`${this.sellerSales_url}/sales`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token for authentication
    },
  });
}
}
