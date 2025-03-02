import { Component, OnInit } from '@angular/core';
import { BranchesService } from '../../services/branches.service';
import { orderoffline } from '../../models/ordersoffline'; // Ensure this path is correct
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ordersoffline',
  templateUrl: './ordersoffline.component.html',
  styleUrls: ['./ordersoffline.component.css'],
  imports: [CommonModule, RouterLink],
})
export class OrdersofflineComponent implements OnInit {
  orders: orderoffline[] = [];
  cashierId: string = 'your-cashier-id'; // Replace with dynamic ID if needed

  constructor(private branchService: BranchesService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.branchService.getOrdersByCashier(this.cashierId).subscribe({
      next: (response) => {
        this.orders = response.orders;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }
}
