
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServer = "http://localhost:8000/api/auth";

  decodedToken: DecodedToken = {};

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiServer}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiServer}/register`, data);
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token); // Cast to DecodedToken
      console.log(decoded);

      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getDecodedToken(): DecodedToken | null {
    const token = sessionStorage.getItem('tokenkey');
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }

  setHeaders() {
    const token = sessionStorage.getItem('tokenkey');
    if (!token) return false;

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('tokenkey');
    return !!token;
  }
}




