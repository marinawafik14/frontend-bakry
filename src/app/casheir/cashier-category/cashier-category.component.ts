import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CashierProductsComponent } from '../cashier-products/cashier-products.component';
import { CashierCartComponent } from '../cashier-cart/cashier-cart.component';
import { CashierCheckoutComponent } from '../cashier-checkout/cashier-checkout.component';

@Component({
  selector: 'app-cashier-category',
  imports: [RouterLink, CommonModule, RouterModule ],
  templateUrl: './cashier-category.component.html',
  styleUrl: './cashier-category.component.css'
})
export class CashierCategoryComponent {

}
