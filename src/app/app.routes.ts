import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CookiesComponent } from './category/cookies/cookies.component';
import { CakesComponent } from './category/cakes/cakes.component';
import { CupcakesComponent } from './category/cupcakes/cupcakes.component';
import { DashbordSellerComponent } from './seller/dashbord-seller/dashbord-seller.component';

import { canloginGuard } from './guard/canlogin.guard';



export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
{path:"home",component:HomeComponent},
{path:"about",component:AboutComponent},
{path:"contact",component:ContactUsComponent,canActivate:[canloginGuard]},
{path:"login",component:LoginComponent},
{path:"register",component:RegisterComponent},
{path:"profile",component:ProfileComponent},
{path:"cart",component:CartComponent},
{path:"category/cookies",component:CookiesComponent},
{path:"category/cakes",component:CakesComponent},
{path:"category/cupcakes",component:CupcakesComponent},
{
  path: 'dashboard',
  loadChildren: () => import('./seller/seller.routes').then((m) => m.routes),
},
{path:"**",component:NotFoundComponent},


];
