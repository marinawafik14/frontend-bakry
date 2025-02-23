import { Component, OnInit } from '@angular/core';
import { BranchesService } from '../../services/branches.service';
import { RestockRequest } from '../../models/restockrequesr';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  styleUrls: ['./admin-requests.component.css'],
})
export class AdminRequestsComponent implements OnInit {
  requests: RestockRequest[] = [];

  constructor(private restockService: BranchesService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.restockService.getAllRequests().subscribe({
      next: (requests) => {
        console.log('Requests fetched:', requests);
        this.requests = requests;
      },
      error: (err) => {
        console.error('Error fetching requests:', err);
      },
    });
  }

  changeRequestStatus(
    request: RestockRequest,
    status: 'approved' | 'rejected'
  ) {
    Swal.fire({
      title: `Are you sure you want to ${status} this request?`,
      input: 'text',
      inputLabel: 'Enter a response message',
      inputPlaceholder: 'Type your message here...',
      showCancelButton: true,
      confirmButtonText: status === 'approved' ? 'Approve' : 'Reject',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a response message!';
        }
        return undefined;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.restockService
          .updateRequestStatus(request._id, status, result.value)
          .subscribe({
            next: (response) => {
              Swal.fire('Success!', `Request has been ${status}.`, 'success');
              this.loadRequests(); // Refresh the list
            },
            error: (err) => {
              console.error('Error updating status:', err);
              Swal.fire(
                'Error',
                'Failed to update the request status.',
                'error'
              );
            },
          });
      }
    });
  }
}
