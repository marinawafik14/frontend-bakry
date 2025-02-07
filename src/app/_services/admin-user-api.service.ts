import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../_service/auth.service';
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

  
}
