import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/orderHistory';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OrderhistoryService {
  private apiUrl = 'http://localhost:8000/api/order/history';



  constructor(private http: HttpClient) {}

  getOrderHistory(customerId: string): Observable<Order[]> {
    return this.http.get<{ success: boolean, orders: Order[] }>(`${this.apiUrl}/${customerId}`)
      .pipe(
        map(response => response.orders)
      );
  }


   // Cancel an order
   cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(
      `http://localhost:8000/api/order/changeorderstatus/${orderId}`,
      { orderStatus: 'canceled' }
    );
  }

}
