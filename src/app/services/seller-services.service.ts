import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Products } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class SellerServicesService {
private url="http://localhost:8000/products";

  constructor(private http:HttpClient) { }
// get all products
  getAllProduct():Observable<Products[]>{
    return this.http.get<Products[]>(this.url)
  }

// get by id
getById(id:string):Observable<Products>{
return this.http.get<Products>(this.url+id)
}

  // delete product by id
  deleteById(id:string):Observable<void>{
    return this.http.delete<void>(this.url + id)
  }

// add product
addProduct(pro:Products){
  return this.http.post<Products>(this.url,pro)
}

// update product
updateProduct(pro:Products){
this.http.put<Products>(this.url+pro._id,pro)
}




}
