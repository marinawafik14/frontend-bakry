import { Component, OnInit } from '@angular/core';
import { Seller } from '../../models/seller';
import { SellerServicesService } from '../../services/seller-services.service';
import { EchartsWrapperModule } from '../../echarts-wrapper.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-chart-seller',
  templateUrl: './chart-seller.component.html',
  imports: [EchartsWrapperModule, NgxChartsModule],
})
export class ChartSellerComponent implements OnInit {
  sellers: Seller[] = [];
  chartOptions: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  sellerId: string ='';

  pendingOrders: number = 0;
  totalMoney: number = 0;
  customers: number = 0;
  latestOrders: any;
  topProducts: any[] = [];
  topSellingProducts: { name: string; value: number }[] = [];
  data: { name: string; value: number }[] = [];

  view: [number, number] = [700, 400]; // Chart size
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private sellerServ: SellerServicesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.sellerId = this.sellerServ.getSellerIdFromToken() ?? '';
    if (!this.sellerId) {
      console.error('No valid seller ID found in token.');
      return;
    }

    this.getSellerStats();
    this.getDashboardStats();
  }

  private getSellerStats() {
    this.sellerServ.getSellerStats(this.sellerId).subscribe({
      next: (data) => {
        console.log("API Response for Seller Stats:", data);

        const monthlySales = Array(12).fill(0);
        const monthlyRevenue = Array(12).fill(0);

        data.forEach((entry) => {
          const monthIndex = entry.month - 1; // Ensure month is 1-12
          if (monthIndex >= 0 && monthIndex < 12) {
            monthlySales[monthIndex] = entry.totalSales;
            monthlyRevenue[monthIndex] = entry.totalProfits;
          }
        });

        this.chartOptions = {
          title: { text: 'Monthly Sales and Revenue', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['Sales', 'Revenue'], top: '5%' },
          xAxis: { type: 'category', data: this.months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Sales', type: 'bar', data: monthlySales },
            { name: 'Revenue', type: 'bar', data: monthlyRevenue },
          ],
        };
      },
      error: (error) => console.error('Error fetching sales data:', error),
    });
  }


  private getDashboardStats() {
    this.sellerServ.getSellerDashboard(this.sellerId).subscribe({
      next: (res: Seller) => {
        console.log("Dashboard API Response:", res);

        if (!res) {
          console.error("Error: API response is empty.");
          return;
        }
        this.totalMoney = res.totalSales ?? 0;
 this.latestOrders = Array.isArray(res.latestOrders) ? res.latestOrders : [res.latestOrders];

 this.topProducts = Array.isArray(res.topProducts) ? res.topProducts : [];
 this.customers = res.customers ?? 0;
 this.topSellingProducts = this.topProducts.map(product => ({
   name: product.name,
   value: product.sales
 }));


        this.data = [...this.topSellingProducts];
      },
      error: (err) => console.error("Error fetching dashboard stats:", err),
    });
  }




  // Pie Chart Data
  pieChartData = [
    { name: 'Category A', value: 40 },
    { name: 'Category B', value: 30 },
    { name: 'Category C', value: 20 },
    { name: 'Category D', value: 10 },
  ];
}
