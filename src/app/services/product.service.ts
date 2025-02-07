import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private topPro_url:string ="http://localhost:8000/top-products"; //top product
private createpro_url = 'http://localhost:8000/products'; // Your backend API for create product
private allProduct_url ="http://localhost:8000/allproducts" // get all products
private URLCategory ='http://localhost:8000/category'; //api category
  constructor(private http:HttpClient) { }

// function get top products

getProducts():Observable<Products[]>{
return this.http.get<Products[]>(this.topPro_url)

}
getAllProducts(): Observable<Products[]> {
  return this.http.get<Products[]>(this.allProduct_url);
}


getProductsByCategory(categoryName: string): Observable<any> {
  return this.http.get(`${this.allProduct_url}?category=${categoryName}`);
}

getProductById(id: string): Observable<any> {
  return this.http.get(`${this.allProduct_url}/${id}`);
}

getCategories(): Observable<Array<{ _id: string, name: string }>> {
  return this.http.get<Array<{ _id: string, name: string }>>(this.URLCategory);
}

// createProduct(std:Products):Observable<Products>{
//   return this.http.post<Products>(this.apiUrl, std)
// }


createProduct(formData: FormData) {
  return this.http.post(this.createpro_url, formData, {
    headers: new HttpHeaders({
      // Remove `Content-Type` because Angular sets it automatically for FormData
    }),
  });
}



}
