import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { registerAppScopedDispatcher } from '@angular/core/primitives/event-dispatch';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
{path:"home",component:HomeComponent},
{path:"about",component:AboutComponent},
{path:"contact",component:ContactUsComponent},
{path:"login",component:LoginComponent},
{path:"register",component:RegisterComponent},
{path:"profile",component:ProfileComponent},
{path:"cart",component:CartComponent},
{path:"products",component:ProductsComponent},
{path:"**",component:NotFoundComponent},


];
