import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileFormComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashbordSellerComponent } from './seller/dashbord-seller/dashbord-seller.component';
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
import { AdminRequestsComponent } from './admin/admin-requests/admin-requests.component';
import { CommentsComponent } from './admin/comments/comments.component';
import { CashierOrdersComponent } from './casheir/cashier-orders/cashier-orders.component';
import { OrdersofflineComponent } from './admin/ordersoffline/ordersoffline.component';
import { cashierGuard } from './guard/cashier.guard';
import { sellerGuard } from './guard/seller.guard';
import { adminGuard } from './guard/admin.guard';

// import { CashierGuard } from './guard/cashier.guard'; 

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
  { path: 'cashier', component: CashierCategoryComponent, title: "Cashier", canActivate: [cashierGuard]},
  {path: 'cashier/category/:name', component:CashierProductsComponent, canActivate: [cashierGuard]},
  {path: 'cashier/cashier-cart', component:CashierCartComponent, canActivate: [cashierGuard]},
  {path: 'cashier/cashier-checkout', component:CashierCheckoutComponent, canActivate: [cashierGuard]},
  {path: 'cashier/cashier-orders', component:CashierOrdersComponent, canActivate: [cashierGuard]},

  // {path: 'cashier/category/:name', component:CashierProductsComponent},
  // {path: 'cashier/cashier-cart', component:CashierCartComponent},
  // {path: 'cashier/cashier-checkout', component:CashierCheckoutComponent},
  // {path: 'cashier/cashier-orders', component:CashierOrdersComponent},
  {
    path: 'dashboard',canActivate: [sellerGuard],
    loadChildren: () => import('./seller/seller.routes').then((s) => s.routes),
  },
  { path: 'dashboard', component: DashbordSellerComponent },
 //admin route
{path:"admin",component:AdminBaseComponent, title: "Admin Panel", canActivate: [adminGuard],children:[
  {path:'dashboard', component:AdminDashboardComponent} ,
  {path:'users', component:AdminUsersComponent},
  { path: "users/edit/:id", component: AdminUserEditComponent },
  {path: 'orders', component: OrdersComponent },
  {path:'products' , component:ProductosComponent},
  {path:'productstoadmin' , component:InventoryComponent},
  {path:'requests' , component:AdminRequestsComponent},
  {path:'comments',component:CommentsComponent},
  {path:'test' , component:TestComponent},
  {path:'admin/branch/:id', component:BranchesComponent },
  {path:'notfound', component:NotFoundComponent},
  {path: "", pathMatch: "full", redirectTo:"dashboard",},
  {path: "**", redirectTo:"notfound"}
]},

  { path: '**', component: NotFoundComponent },
];







