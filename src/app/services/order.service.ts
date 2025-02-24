import { HttpClient, HttpHeaders } from '@angular/common/http';
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

//-----------------------
getOrdersBySellerId(sellerId: string): Observable<any> {
  return this.http.get(`http://localhost:8000/dashboard/orders/${sellerId}`);
}

createOrder(orderData: any): Observable<any> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.post<any>(`http://localhost:8000/order`, orderData, { headers });
}

clearCashierCart(token: string): Observable<any> {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post<any>(`http://localhost:8000/cashier/clear-cart`, {}, { headers });  // Assuming you're sending the token for authentication
}

getOfflineOrders(): Observable<any> {
  return this.http.get(`http://localhost:8000/orders`);
}

  // New API method to cancel an order if within 24 hours
  cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(`http://localhost:8000/orders/${orderId}/cancel`, {});
  }

  // New API method to update order items (delete product or swap products)
  updateOrder(orderId: string, items: any[]): Observable<any> {
    return this.http.patch(`http://localhost:8000/orders/${orderId}/update`, { items });
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`http://localhost:8000/orders/${orderId}`);
  }
  

// clearCartInToken(token: string): Observable<any> {
//   const headers = { Authorization: `Bearer ${token}` };  // Attach the token for authorization
//   return this.http.post<any>(`http://localhost:8000/clear-cart-token`, {}, { headers });
// }

// removeFromCart(productId: string, quantity: number): Observable<any> {
//   const token = sessionStorage.getItem('tokenkey');
//   const headers = { Authorization: `Bearer ${token}` };

//   return this.http.delete<any>(`http://localhost:8000/cart/items/${productId}?quantity=${quantity}`, { headers });
// }



}
