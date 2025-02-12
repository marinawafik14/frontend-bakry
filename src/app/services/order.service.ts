import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs/internal/Observable';
import { orderToAdmin } from '../models/orderToAdmin';
import { map } from 'rxjs/operators';
import { OrderTo } from '../models/orderTo';

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
  // // get all orders
  // getallorders():Observable<orderToAdmin[]>{
  //   return this.http.get<{ orders: orderToAdmin[] }>(
  //     'http://localhost:8000/order/getallorder'
  //   );
  // }

  getallorders(): Observable<{ order: orderToAdmin[] }> {
    return this.http.get<{ order: orderToAdmin[] }>(
      'http://localhost:8000/order/getallorder'
    );
  }
  getallordersP(): Observable<{ order: OrderTo[] }> {
    return this.http.get<{ order: OrderTo[] }>(
      'http://localhost:8000/order/getallorder'
    );
  }

  // will return order to change status to this order
  getorderbyid(_id: string): Observable<{order:orderToAdmin}> {
    return this.http.get<{ order: orderToAdmin }>(
      `http://localhost:8000/order/getorderbyid/${_id}`
    );
  }

changeOrderStatus(_id: string, status: string): Observable<orderToAdmin> {
  const url = `http://localhost:8000/order/changeorderstatus/${_id}`;
  return this.http.patch<orderToAdmin>(url, { orderStatus: status });
}


}
