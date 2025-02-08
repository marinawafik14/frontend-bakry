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
import { OrdersComponent } from './admin/orders/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // {path:"contact",component:ContactUsComponent,canActivate:[canloginGuard]},
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileFormComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  // {path:"category/cookies",component:ProductsComponent},
  // {path:"category/cakes",component:CakesComponent},
  // {path:"category/cupcakes",component:CupcakesComponent},
  { path: 'category/:name', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./seller/seller.routes').then((s) => s.routes),
  },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('../app/admin/admin-base/admin-base.component').then((m) => m.AdminBaseComponent),
  // },

  // {path:"dashboard",component:DashbordSellerComponent},
  // {path:"products", component:ProductsComponent},

  { path: 'category/cookies', component: CookiesComponent },
  { path: 'category/cakes', component: CakesComponent },
  { path: 'category/cupcakes', component: CupcakesComponent },
  { path: 'dashboard', component: DashbordSellerComponent },
//  {path:'admin', component:AdminBaseComponent}, 
  //admin route
  {
    path: 'admin/admin-base',
    component: AdminBaseComponent,
    title: 'Admin Panel',
    children: [
      { path: 'dashboard', component: AdminUsersComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
 

  // { path: '**', component: NotFoundComponent },
];
