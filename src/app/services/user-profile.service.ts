import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user'; // Import the User model

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = 'http://localhost:8000/api'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Fetch profile data
  getProfile(userId: string): Observable<User> {
    if (!userId) {
      return throwError(() => new Error('User ID is undefined'));
    }
    return this.http.get<User>(`${this.apiUrl}/profile/${userId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching profile:', error);
        return throwError(() => error);
      })
    );
  }

  // Update profile data
  updateUserProfile(userId: string, profileData: User): Observable<User> {
    if (!userId) {
      return throwError(() => new Error('User ID is undefined'));
    }
    return this.http.put<User>(`${this.apiUrl}/profile/${userId}`, profileData).pipe(
      catchError((error: any) => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }
}
