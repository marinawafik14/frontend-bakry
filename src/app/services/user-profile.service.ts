import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  checkEmailExists(value: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<any> {
    if (!userId) {
      console.error('User ID is undefined'); // Debugging
      return throwError('User ID is undefined');
    }
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, profileData);
  }
}

