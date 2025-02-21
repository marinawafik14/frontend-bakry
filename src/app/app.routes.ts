import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileFormComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CookiesComponent } from './category/cookies/cookies.component';
import { CakesComponent } from './category/cakes/cakes.component';
import { CupcakesComponent } from './category/cupcakes/cupcakes.component';
import { DashbordSellerComponent } from './seller/dashbord-seller/dashbord-seller.component';

import { canloginGuard } from './guard/canlogin.guard';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminBaseComponent } from './admin/admin-base/admin-base.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminUserEditComponent } from './admin/admin-user-edit/admin-user-edit.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ProductosComponent } from './admin/products/products.component';
import { TestComponent } from './admin/test/test.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CashierCategoryComponent } from './casheir/cashier-category/cashier-category.component';
import { CashierProductsComponent } from './casheir/cashier-products/cashier-products.component';
import { CashierCartComponent } from './casheir/cashier-cart/cashier-cart.component';
import { CashierCheckoutComponent } from './casheir/cashier-checkout/cashier-checkout.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { BranchesComponent } from './admin/branches/branches.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:userId', component: ProfileFormComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'category/:name', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cashier', component: CashierCategoryComponent, title: "Cashier"},
  {path: 'cashier/category/:name', component:CashierProductsComponent},
  {path: 'cashier/cashier-cart', component:CashierCartComponent},
  {path: 'cashier/cashier-checkout', component:CashierCheckoutComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./seller/seller.routes').then((s) => s.routes),
  },
  { path: 'dashboard', component: DashbordSellerComponent },

 //admin route
{path:"admin",component:AdminBaseComponent, title: "Admin Panel", children:[
  {path:'dashboard', component:AdminDashboardComponent},
  {path:'users', component:AdminUsersComponent},
  { path: "users/edit/:id", component: AdminUserEditComponent },
  {path: 'orders', component: OrdersComponent },
  {path:'products' , component:ProductosComponent},
  {path:'inventory' , component:InventoryComponent},
  {path:'test' , component:TestComponent},
  {path:'admin/branch/:id', component:BranchesComponent},
  {path: "", pathMatch: "full", redirectTo:"dashboard",},
  {path: "**", redirectTo:"dashboard"}
]},

  { path: '**', component: NotFoundComponent },
];