import { Component, OnInit } from '@angular/core';
import { SellerServicesService } from '../../services/seller-services.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-stock',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-stock.component.html',
  styleUrl: './seller-stock.component.css'
})
export class SellerStockComponent implements OnInit{

  sellerInventory: any[] = [];
  sellerId: string = '';
  constructor(public sellerServ:SellerServicesService, private authService: AuthService){}

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    if (decoded && decoded.userId) {
      this.sellerId = decoded.userId;
      this.loadSellerInventory();
    } else {
      console.error("Seller not logged in.");
    }
  }

  loadSellerInventory(): void {
    this.sellerServ.getSellerInventory(this.sellerId).subscribe({
      next: (data) => {
        this.sellerInventory = data;
        console.log("Seller Inventory:", this.sellerInventory);
      },
      error: (error) => {
        console.error("Error fetching seller inventory:", error);
      }
    });
  }
}
