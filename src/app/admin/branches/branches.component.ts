import { Component, OnInit } from '@angular/core';
import { BranchesService } from '../../services/branches.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BranchInventory } from '../../models/ProductsInbranch';
import Swal from 'sweetalert2';
import { RestockRequest } from '../../models/restockrequesr';
import { givememyrequests } from '../../models/givememyrequests';

@Component({
  selector: 'app-branches',
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
})
export class BranchesComponent implements OnInit {
  branchId!: string | null;
  productsinbranch!: BranchInventory;
  unreadRequests: number = 0;
  requests: givememyrequests[] = [];
  responseMessages: string[] = [];
  constructor(
    private branchesservice: BranchesService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let branchid = this.router.snapshot.paramMap.get('id');
    if (branchid) {
      this.branchesservice.getProductsByBranchId(branchid).subscribe({
        next: (data) => {
          this.productsinbranch = data;
          console.log('Products fetched:', this.productsinbranch);
        },
        error: (err) => {
          console.error('Error fetching products', err);
        },
      });
    }
    this.loadRestockRequests();
  }
  //

  //   if (this.branchId) {
  //     this.branchesservice.getRestockRequests(this.branchId).subscribe({
  //       next: (data) => {
  //         this.requests = data;
  //         this.unreadRequests = this.requests.filter(
  //           (req) => req.responsemessage
  //         ).length; // ✅ Fixed reference to requests
  //       },
  //       error: (err) => {
  //         console.error('Error fetching requests', err);
  //       },
  //     });
  //   }
  // }
  // Show SweetAlert input before requesting stock

  // loadRestockRequests() {
  //   if (this.branchId) {
  //     this.branchesservice.getRestockRequests(this.branchId).subscribe({
  //       next: (data) => {
  //         this.requests = data.requests;
  //         this.unreadRequests = this.requests.filter(
  //           (req) => req.responsemessage
  //         ).length;
  //       },
  //       error: (err) => {
  //         console.error('Error fetching requests', err);
  //       },
  //     });
  //   }
  // }

  loadRestockRequests() {
    if (this.branchId) {
      this.branchesservice.getRestockRequests(this.branchId).subscribe({
        next: (data) => {
          this.requests = data.requests;

          this.responseMessages = this.requests
            .map((req) => req.responseMessage ?? '') 
            .filter((msg) => msg !== ''); // Remove empty strings

          this.unreadRequests = this.responseMessages.length; // ✅ Count unread messages
        },
        error: (err) => {
          console.error('Error fetching requests', err);
        },
      });
    }
  }

  requestStock(productId: string) {
    Swal.fire({
      title: 'Enter Quantity',
      input: 'number',
      inputAttributes: {
        min: '1',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonText: 'Request',
      preConfirm: (quantity) => {
        if (!quantity || quantity <= 0) {
          Swal.showValidationMessage('Please enter a valid quantity');
        }
        return quantity;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = result.value;
        // const branchId = this.router.snapshot.paramMap.get('id');
        this.router.paramMap.subscribe((params) => {
          let branchid = params.get('id');
          console.log(branchid);
          if (branchid) {
            this.branchesservice
              .askforrequest(branchid, productId, quantity)
              .subscribe({
                next: (data) => {
                  Swal.fire('Success', 'Request sent successfully!', 'success');
                  console.log('Request sent', data);
                },
                error: (err) => {
                  Swal.fire('Error', 'Failed to send request', 'error');
                  console.error('Error sending request', err);
                },
              });
          }
        });
      }
    });
  }
}
