import { Component, OnInit } from '@angular/core';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminUserApiService } from '../../services/admin-user-api.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
export interface Branch {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  clerks: string[]; // Array of Clerk IDs
  cashiers: string[]; // Array of Cashier IDs
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  __v: number;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, NgxChartsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})


export class AdminDashboardComponent implements OnInit {
  pendingOrders:any = 0;
  totalMoney:any = 0;
  customers: any = 0;
  latestOrders: any;
  topProducts: any;
  branches: any[] = [];

  ngOnInit(): void {
    this.getInventoryDetails()
  }
  constructor(public adminService:AdminUserApiService, public router:Router){
           this.getDashboardStats();
           this.getInventoryDetails();
  }

  getInventoryDetails(){
    this.adminService.getBranchInfo().subscribe({
      next: (res)=>{
          for(let i = 0; i < res.length; i++){
              this.branches = res
          }
          console.log(this.branches);
          
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }
  getDashboardStats(){
    this.adminService.getDashboardStats().subscribe({
      next: (res)=>{
        this.pendingOrders = res.pendingOrders;
        this.totalMoney = res.totalMoney;
        this.latestOrders = res.latestOrders;
        console.log(this.latestOrders);
        this.customers = res.customers;
        this.topProducts = res.topProducts;
        this.getTopSellingProducts();
        console.log(this.topSellingProducts);
        this.data = this.topSellingProducts
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }
  view: [number, number] = [700, 400]; // Chart size

  // Sample Data
  data = [
    { name: 'Product A', value: 10 },
    { name: 'Product B', value: 5 },
    { name: 'Product C', value: 3 }
  ];

  topSellingProducts: { name: string; value: number }[] = [];

  getTopSellingProducts(){
    for(let i = 0; i < this.topProducts.length; i++ ){
      this.topSellingProducts.push({
        name: this.topProducts[i].name,
        value: this.topProducts[i].sales
      })
    }
  }

  navigateToBranch(branchId: string) {
    this.router.navigateByUrl(`/admin/admin/branch/${branchId}`);
    console.log(`/admin/branch/${branchId}`);
    
    // this.router.navigate(['/admin/branch', branchId]);
  }

  //pie chart
  pieChartData = [
    {
      "name": "Category A",
      "value": 40
    },
    {
      "name": "Category B",
      "value": 30
    },
    {
      "name": "Category C",
      "value": 20
    },
    {
      "name": "Category D",
      "value": 10
    }
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] // Custom colors
  };




}


