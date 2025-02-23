import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Branch } from '../models/branches';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BranchInventory } from '../models/ProductsInbranch';
import { RestockRequest } from '../models/restockrequesr';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  private allBranches_url = 'http://localhost:8000/api/inventory/branches';
  private branchinto_url =
    'http://localhost:8000/api/inventory/branch/info/:branchId';
  private getProductsByBranchId_url = `http://localhost:8000/api/inventory/branch/`;
  private request_url = 'http://localhost:8000/api/inventory/clerk/request';
  private requests_url = `http://localhost:8000/api/inventory/requests`;
  constructor(private http: HttpClient) {}

  // return all branches

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
}
