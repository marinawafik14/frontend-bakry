import { Component, OnInit } from '@angular/core';
import { BranchesService } from '../../services/branches.service';
import { RestockRequest } from '../../models/restockrequesr';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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
}
