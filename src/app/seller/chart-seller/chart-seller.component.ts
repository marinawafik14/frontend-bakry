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


  constructor(private sellerServ: SellerServicesService) {}

  ngOnInit() {
    this.sellerServ.getSellerStats().subscribe({
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
}