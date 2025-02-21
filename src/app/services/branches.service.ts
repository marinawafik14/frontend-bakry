import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Branch } from '../models/branches';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BranchInventory } from '../models/ProductsInbranch';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  private allBranches_url = 'http://localhost:8000/api/inventory/branches';
  private getProductsByBranchId_url = `http://localhost:8000/api/inventory/branch/`;
  constructor(private http: HttpClient) {}

  // return all branches

  getallbranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.allBranches_url);
  }

  getProductsByBranchId(branchId: string): Observable<BranchInventory> {
    return this.http.get<BranchInventory>(`${this.getProductsByBranchId_url}${branchId}`).pipe(
      map((data) => new BranchInventory(data)) // Convert API response to class instance
    );
  }
}
