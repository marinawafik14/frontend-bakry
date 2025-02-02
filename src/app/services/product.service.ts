import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private API_url:string ="http://localhost:8000/top-products";
  constructor(private http:HttpClient) { }

getProducts():Observable<Products[]>{
return this.http.get<Products[]>(this.API_url)

}



}
