import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { register } from '../models/register';
import { Observable } from 'rxjs';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  constructor(public http: HttpClient) {}

  // set methods here will be used to call the API

  public login(user: Login):Observable<Login> {
    return this.http.post<Login>('http://localhost:9999/login', user);
  }

  // will send user data from register form
  public register(user: register): Observable<register> {
    return this.http.post<register>('http://localhost:9999/auth/register', user);
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
}
