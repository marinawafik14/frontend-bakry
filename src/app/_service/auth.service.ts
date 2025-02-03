import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiServer = "http://localhost:8000/api/auth";

  constructor(private http:HttpClient) { }

  login(data:any): Observable<any> {
    return this.http.post(`${this.apiServer}/login`, data);
  }

  register(data:any): Observable<any> {
    return this.http.post(`${this.apiServer}/register`, data);
  }
}
