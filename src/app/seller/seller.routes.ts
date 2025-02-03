// seller.routes.ts

import { Routes } from '@angular/router';
import { DashbordSellerComponent } from './dashbord-seller/dashbord-seller.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SellerDetailsProductComponent } from './seller-details-product/seller-details-product.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';


export const routes: Routes = [
  {
    path: '',
    component: DashbordSellerComponent,
  }, // Parent route

  { path: 'add', component: SellerAddProductComponent },
  { path: 'details/:id', component: SellerDetailsProductComponent },
  { path: 'update/:id', component: SellerUpdateProductComponent },


];
