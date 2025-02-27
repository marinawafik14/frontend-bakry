import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BranchesService } from '../../services/branches.service';

@Component({
  selector: 'app-offlineorders',
  imports: [RouterLink],
  templateUrl: './offlineorders.component.html',
  styleUrl: './offlineorders.component.css'
})
export class OfflineordersComponent implements OnInit{
  branchId: string | null = null;

  constructor(private route: ActivatedRoute, private branchServ: BranchesService) {}

  ngOnInit(): void {
    this.branchId = this.route.snapshot.paramMap.get('id'); // Get branch ID from URL
    console.log("Branch ID:", this.branchId);

    if (this.branchId) {
      this.loadOfflineOrders();
    }
  }

  loadOfflineOrders(): void {
    this.branchServ.getRequestsForBranch(this.branchId!).subscribe({
      next: (data) => {
        console.log("Restock Requests:", data);
      },
      error: (err) => {
        console.error("Error fetching restock requests:", err);
      }
    });
  }


}
