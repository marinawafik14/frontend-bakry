import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private API_url:string ="http://localhost:8000/top-products"; //top product
private apiUrl = 'http://localhost:8000/products'; // Your backend API for create product
private URLCategory ='http://localhost:8000/category'; //api category
  constructor(private http:HttpClient) { }

getProducts():Observable<Products[]>{
return this.http.get<Products[]>(this.API_url)

}


getProductsByCategory(categoryName: string): Observable<any> {
  return this.http.get(`${this.apiUrl}?category=${categoryName}`);
}

getProductById(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}

getCategories(): Observable<Array<{ _id: string, name: string }>> {
  return this.http.get<Array<{ _id: string, name: string }>>(this.URLCategory);
}

// createProduct(std:Products):Observable<Products>{
//   return this.http.post<Products>(this.apiUrl, std)
// }


createProduct(formData: FormData) {
  return this.http.post("http://localhost:8000/products", formData, {
    headers: new HttpHeaders({
      // Remove `Content-Type` because Angular sets it automatically for FormData
    }),
  });
}



}
