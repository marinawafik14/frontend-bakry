import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8000/products'; // Your backend API

  constructor(private http: HttpClient) {}

  getProductsByCategory(categoryName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?category=${categoryName}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
