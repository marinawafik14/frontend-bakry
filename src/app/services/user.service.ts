import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { register } from '../models/register';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  constructor(public http: HttpClient) {}

  // set methods here will be used to call the API

  public login(user: Login): Observable<Login> {
    return this.http.post<Login>('http://localhost:8000/auth/login', user);
  }

  // will send user data from register form
  public register(user: register): Observable<register> {
    return this.http
      .post<register>('http://localhost:8000/auth/register', user)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code: ${error.status}, message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  public getUser() {
    return this.http.get('http://localhost:3000/user');
  }

  public updateUser(user: any) {
    return this.http.put('http://localhost:3000/user', user);
  }

  public deleteUser(user: any) {
    return this.http.delete('http://localhost:3000/user', user);
  }

  public getUserbyid(): Observable<string> {
    return this.http.get<{ id: string }>('http://localhost:8000/api/user').pipe(
      map((res) => res.id) // ✅ FIXED: Extract only `id`
    );


  }
}
