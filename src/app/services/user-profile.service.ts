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
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}


  // Fetch user profile by ID
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile/${userId}`);
  }

  // Update user profile by ID
  updateUserProfile(userId: string, updateData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile/${userId}`, updateData);
  }
}

