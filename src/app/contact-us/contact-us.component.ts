import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact-us',
  imports: [FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  message : string=''

constructor(private commentServ : CommentService){}
/*
submitComment() {

  const storedUser= sessionStorage.getItem('tokenkey')

  if (!storedUser) {
    Swal.fire({
      icon: 'error',
      title: 'Unauthorized',
      text: 'You must be logged in to submit a comment!'
    });
    return;
  }
  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Error parsing user session:", error);
    Swal.fire({
      icon: 'error',
      title: 'Session Error',
      text: 'Invalid user session data. Please log in again.'
    });
    return;
  }

  if (!user.user || !user.firstName || !user.lastName || !user.email) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid User Data',
      text: 'Your session data is incomplete. Please log in again!'
    });
    return;
  }

  this.commentServ.addComment(user, this.message).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your comment has been submitted successfully.',
      });
      this.message = '';
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Error submitting comment. Please try again.',
      });
    }
  });
}
*/
submitComment() {
  const token = sessionStorage.getItem('tokenkey');

  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Unauthorized',
      text: 'You must be logged in to submit a comment!'
    });
    return;
  }

  try {
    // Decode the token manually
    const payload = JSON.parse(atob(token.split('.')[1])); // Decoding JWT payload

    const user = {
      userId: payload.userId,
      email: payload.email
    };

    this.commentServ.addComment(user, this.message).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your comment has been submitted successfully.',
        });
        this.message = '';
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Error submitting comment. Please try again.',
        });
      }
    });

  } catch (error) {
    console.error('Error parsing user session:', error);
    Swal.fire({
      icon: 'error',
      title: 'Session Error',
      text: 'Invalid user session data. Please log in again.',
    });
    sessionStorage.removeItem('tokenkey'); // Remove invalid token
  }
}

}
