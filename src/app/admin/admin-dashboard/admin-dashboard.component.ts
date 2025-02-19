import { Component } from '@angular/core';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminUserApiService } from '../../services/admin-user-api.service';
import { RouterLink } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  pendingOrders:any = 0;
  totalMoney:any = 0;
  customers: any = 0;
  latestOrders: any;
  topProducts: any;

  constructor(public adminService:AdminUserApiService){
        adminService.getDashboardStats().subscribe({
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


