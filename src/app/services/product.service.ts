import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private API_top:string ="http://localhost:8000/top-products"; //top product
private api_creatPro = 'http://localhost:8000/products'; // Your backend API for create product
private URLCategory ='http://localhost:8000/category'; //api category
  constructor(private http:HttpClient) { }



getProducts():Observable<Products[]>{
return this.http.get<Products[]>(this.API_top)

}


getProductsByCategory(categoryName: string): Observable<any> {
  return this.http.get(`${this.api_creatPro}?category=${categoryName}`);
}

getProductById(id: string): Observable<any> {
  return this.http.get(`${this.api_creatPro}/${id}`);
}

getCategories(): Observable<Array<{ _id: string, name: string }>> {
  return this.http.get<Array<{ _id: string, name: string }>>(this.URLCategory);
}

createProduct(std:Products):Observable<Products>{
  return this.http.post<Products>(this.api_creatPro, std)
}



}
