import { Component, OnInit } from '@angular/core';
import { Seller } from '../../models/seller';
import { SellerServicesService } from '../../services/seller-services.service';
import { EchartsWrapperModule } from '../../echarts-wrapper.module';

@Component({
  standalone: true,
  selector: 'app-chart-seller',
  templateUrl: './chart-seller.component.html',
  imports:[EchartsWrapperModule],
})
export class ChartSellerComponent implements OnInit {
  sellers: Seller[] = [];
  chartOptions: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private sellerServ: SellerServicesService) {}
/*
  ngOnInit() {
    this.sellerServ.getSellerStats.subscribe({
      next: (data: Seller[]) => {
        this.sellers = data;


        const storeNames = this.sellers.map((seller) => seller.storeName);
        const totalSales = this.sellers.map((seller) => seller.totalSales);
        const totalProfits = this.sellers.map((seller) => seller.totalProfits);

        this.chartOptions = {
          title: {
            text: 'Sales and Profits',
          },
          tooltip: {},
          legend: {
            data: ['Sales', 'Profits'],
          },
          xAxis: {
            data: storeNames,
          },
          yAxis: {},
          series: [
            {
              name: 'Sales',
              type: 'bar',
              data: totalSales,
            },
            {
              name: 'Profits',
              type: 'bar',
              data: totalProfits,
            },
          ],
        };
      },
      error: (error: any) => console.error('Error fetching stats:', error),
    });
  }
*/
/*
ngOnInit() {
  this.sellerServ.getSellerStats().subscribe({
    next: (data: any[]) => {
      console.log("API Response for Seller Stats:", data);
      const monthlySales = new Array(12).fill(0);
      const monthlyRevenue = new Array(12).fill(0);

      // data.forEach((entry) => {
      //   monthlySales[entry._id - 1] = entry.totalSales;
      //   monthlyRevenue[entry._id - 1] = entry.totalRevenue;
      // });
      data.forEach((entry) => {
        const monthIndex = entry._id ? Number(entry._id) - 1 : -1; // Ensure numeric index
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlySales[monthIndex] = entry.totalSales;
          monthlyRevenue[monthIndex] = entry.totalRevenue;
        }
      });


      this.chartOptions = {
        title: {
          text: 'Monthly Sales and Revenue',
        },
        tooltip: {},
        legend: {
          data: ['Sales', 'Revenue'],
        },
        xAxis: {
          data: this.months,
        },
        yAxis: {},
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: monthlySales,
          },
          {
            name: 'Revenue',
            type: 'bar',
            data: monthlyRevenue,
          },
        ],
      };
    },
    error: (error) => console.error('Error fetching sales data:', error),
  });
}*/

ngOnInit() {
  this.sellerServ.getSellerStats().subscribe({
    next: (data: any[]) => {
      console.log("API Response for Seller Stats:", data);

      const monthlySales = new Array(12).fill(0);
      const monthlyRevenue = new Array(12).fill(0);

      data.forEach((entry) => {
        const monthIndex = entry._id ? Number(entry._id) - 1 : -1; // Ensure numeric index
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlySales[monthIndex] = entry.totalSales;
          monthlyRevenue[monthIndex] = entry.totalRevenue;
        }
      });

      this.chartOptions = {
        title: { text: 'Monthly Sales and Revenue' },
        tooltip: {},
        legend: { data: ['Sales', 'Revenue'] },
        xAxis: { type: 'category', data: this.months },
        yAxis: { type: 'value' },
        series: [
          { name: 'Sales', type: 'bar', data: monthlySales },
          { name: 'Revenue', type: 'bar', data: monthlyRevenue },
        ],
      };

      console.log("Chart Options:", this.chartOptions); // Debugging line
    },
    error: (error) => console.error('Error fetching sales data:', error),
  });
}

}

