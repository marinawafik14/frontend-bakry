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
  currentPage: number = 1;
  pageSize: number = 10;

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
            next: () => {
              if (status === 'approved') {
                this.transferStock(request);
              } else {
                Swal.fire('Rejected!', 'Request has been rejected.', 'success');
                this.loadRequests();
              }
            },
            error: (err) => {
              console.error('Error updating status:', err.message);
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

  transferStock(request: RestockRequest) {
    this.restockService.transferStock(request._id).subscribe({
      next: (response) => {
        console.log(response);
        
        if (response.message.status === 200) {
          Swal.fire('Success!', response.message.message, 'success');
        } else {
          Swal.fire('Warning!', response.message.message, 'warning');
        }
        this.loadRequests(); // Refresh list
      },
      error: (err) => {
        console.error('Error transferring stock:', err);
        Swal.fire('Error', err.error?.message || 'Failed to transfer stock.', 'error');
      },
    });
  }
    

   // Getter to return only the items for the current page.
   get pagedRequests(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.requests.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.requests.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


}
