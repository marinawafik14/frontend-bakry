import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchesService } from '../../services/branches.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clerkrequest',
  imports: [CommonModule],
  templateUrl: './clerkrequest.component.html',
  styleUrl: './clerkrequest.component.css'
})
export class ClerkrequestComponent {
  branchId: string | null = null;
requests: any;
productsinbranch: any;

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
