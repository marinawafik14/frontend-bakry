import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(public http: HttpClient) {}

  addOrder(order: any): Observable<Order> {
    return this.http.post<Order>(
      'http://localhost:8000/order/addneworder',
      order
    );
  }
}
