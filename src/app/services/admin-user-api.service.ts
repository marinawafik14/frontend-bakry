import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class AdminUserApiService {
  header: any
  private apiurl:any = `${environment.BASE_URL}/api`
  constructor(public httpClient: HttpClient, public _authService:AuthService){
       this.header = _authService.setHeaders()
  }

  getAllUsers(): Observable<{ users: User[] }> {
    return this.httpClient.get<{ users: User[] }>(`${this.apiurl}/admin/users`, {
        headers: this.header
    });
  }

  removeUser(userId:any):Observable<any>{
    return this.httpClient.delete<any>(`${this.apiurl}/admin/users/${userId}`);
  }

  getUserById(userId: string): Observable<any> {
    return this.httpClient.get(`${this.apiurl}/admin/user/${userId}`);
  }

  updateUser(userId: string, userData: any) {
    return this.httpClient.put(`${this.apiurl}/admin/users/${userId}`, userData);
  }
  getUsersByRole(role:string){
    return this.httpClient.get<{ users: User[] }>(`${this.apiurl}/admin/users/${role}`)
  }

  getDashboardStats():Observable<any>{
    return this.httpClient.get<any>(`${this.apiurl}/admin/dashboard/stats`);
  }

  getBranchInfo(){
    return this.httpClient.get<any>(`${this.apiurl}/inventory/branches`);
  }
}
