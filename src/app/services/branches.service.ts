import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Branch } from '../models/branches';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BranchInventory } from '../models/ProductsInbranch';
import { RestockRequest } from '../models/restockrequesr';
import { orderoffline } from '../models/ordersoffline';
import { givememyrequests } from '../models/givememyrequests';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  private allBranches_url = 'http://localhost:8000/api/inventory/branches';
  private branchinto_url =
    'http://localhost:8000/api/inventory/branch/info/:branchId';
  private getProductsByBranchId_url = `http://localhost:8000/api/inventory/branch/`;
  private request_url = 'http://localhost:8000/api/inventory/clerk/request';
  private apiUrl = 'http://localhost:8000/api/inventory/transfer';
  private requests_url = `http://localhost:8000/api/inventory/requests`;
  private admintobranch_url =
    'http://localhost:8000/api/inventory/transferfromadmintobranch';
  private changeRequestStatus_url =
    'http://localhost:8000/api/inventory/stockReq';

  private baseUrl = 'http://localhost:8000/api/inventory/branch';
  constructor(private http: HttpClient) {}

  getallbranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.allBranches_url);
  }

  getbranchinfo(branchId: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.branchinto_url}${branchId}`);
  }

  getProductsByBranchId(branchId: string): Observable<BranchInventory> {
    return this.http
      .get<BranchInventory>(`${this.getProductsByBranchId_url}${branchId}`)
      .pipe(
        map((data) => new BranchInventory(data)) // Convert API response to class instance
      );
  }

  askforrequest(
    branchId: string,
    productId: string,
    quantity: number
  ): Observable<Request> {
    return this.http.post<Request>(`${this.request_url}/${branchId}`, {
      productId,
      quantity,
    });
  }

  getAllRequests(): Observable<RestockRequest[]> {
    return this.http
      .get<{ stockRequests: any[] }>(this.requests_url)
      .pipe(
        map((response) =>
          response.stockRequests.map((req) => new RestockRequest(req))
        )
      );
  }

  updateRequestStatus(
    requestId: string,
    status: string,
    message: string
  ): Observable<any> {
    return this.http.put(`${this.changeRequestStatus_url}/${requestId}`, {
      status,
      message,
    });
  }

  transferStock(requestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}`, {});
  }

  transferStockfromadmin(
    productId: string,
    branchId: string,
    quantity: number
  ): Observable<any> {
    const url = `${this.admintobranch_url}`;
    return this.http.post(url, { productId, branchId, quantity });
  }

  // to get all messages
  getRestockRequests(
    branchId: string
  ): Observable<{ status: number; requests: givememyrequests[] }> {
    return this.http.get<{ status: number; requests: givememyrequests[] }>(
      `${this.baseUrl}/requests/${branchId}`
    );
  }

  getRequestsForBranch(branchId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requests/${branchId}`);
  }
  
  // Fetch orders by cashier ID
  getOrdersByCashier(
    cashierId: string
  ): Observable<{ orders: orderoffline[] }> {
    return this.http.get<{ orders: orderoffline[] }>(
      `${this.baseUrl}/requests/${cashierId}`
    );
  }
}
