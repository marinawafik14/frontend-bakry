import { Component } from '@angular/core';

@Component({
  selector: 'app-clerkrequest',
  imports: [],
  templateUrl: './clerkrequest.component.html',
  styleUrl: './clerkrequest.component.css'
})
export class ClerkrequestComponent {
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
