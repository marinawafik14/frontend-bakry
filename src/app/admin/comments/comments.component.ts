import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [FormsModule,CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent  implements OnInit{
  comments: Comment[] = [];

  constructor(private commentService: CommentService) {}
  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments() {
    this.commentService.getAllComments().subscribe({
      next: (data) => {
        console.log("comment resived",data)
        this.comments = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch comments. Make sure you are logged in as an admin.',
        });
      }
    });
  }

  deleteComment(commentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to recover this comment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            this.comments = this.comments.filter(comment => comment._id !== commentId);
            Swal.fire('Deleted!', 'The comment has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error!', 'Failed to delete the comment.', 'error');
          }
        });
      }
    });
  }




}
