import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';


@Injectable({
  providedIn: 'root'
})

export class LastProductService {
private url ='http://localhost:8000/last-products'
  constructor(private http:HttpClient) { }
  getLastProducts(): Observable<Products[]> {
    return this.http.get<any>(`${this.url}`);
  }


}
