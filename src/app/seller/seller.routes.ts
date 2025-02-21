// seller.routes.ts

import { Routes } from '@angular/router';
import { DashbordSellerComponent } from './dashbord-seller/dashbord-seller.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';
import { ChartSellerComponent } from './chart-seller/chart-seller.component';
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerStockComponent } from './seller-stock/seller-stock.component';


export const routes: Routes = [
  {
    path: '',
    component: DashbordSellerComponent,
  }, // Parent route

  { path: 'add', component: SellerAddProductComponent },

  { path: 'update/:id', component: SellerUpdateProductComponent },
  {path:'chart-seller',component:ChartSellerComponent},
  {path:'orders/:sellerId',component:SellerOrdersComponent},
  {path:'stock/:sellerId',component:SellerStockComponent}

];
