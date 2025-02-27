import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
private comment_api = 'http://localhost:8000/api/comments'
  constructor(private http: HttpClient) { }

addComment (user : any ,message: string):Observable<Comment>{
const token = sessionStorage.getItem('tokenkey')

if (!token) {
  console.error('No token found in sessionStorage');
  return new Observable<Comment>(); // Return empty observable
}

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`  // Attach token
});
const newComment = {
  message: message,
};


return this.http.post<Comment>(`${this.comment_api}/add`, newComment, { headers }).pipe(
  tap(response => console.log('✅ Comment submitted successfully:', response)),
  catchError(error => {
    console.error('❌ Error submitting comment:', error);
    return throwError(() => new Error('Failed to submit comment'));
  })
);
}

// get all comments acess admin
getAllComments ():Observable<Comment[]>{
  const token = sessionStorage.getItem('tokenkey')
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

return this.http.get<Comment[]>(`${this.comment_api}/all`,{headers})

}

deleteComment(commentId: string): Observable<any> {
  return this.http.delete(`${this.comment_api}/${commentId}`);
}


}
