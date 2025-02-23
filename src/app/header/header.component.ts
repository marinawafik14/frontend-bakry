
import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { CartApiService } from '../services/cart-api.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  isSeller:boolean = false;
  constructor(public router: Router, private cartService: CartApiService, private authService:AuthService) {
    this.loadUserData();
  }
  ngOnInit(): void {
    this.loadUserData();
    this.cartService.refreshCartCount();
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

  }
  userId: any;
  userEmail: string | null = null;

  // wanna to check if there token in session or not
  // if there will customize nav

  // this method check if session have token or not
  islogged(): boolean {
    const token = sessionStorage.getItem('tokenkey');
    return !!token;
  }
  loadUserData() {
    const token = sessionStorage.getItem('tokenkey');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userEmail = decodedToken?.email || null;
      console.log(this.userEmail);
      console.log(decodedToken.email);

      // id
      const decodedToken2 = this.authService.getDecodedToken();
      this.userId = decodedToken2?.userId;
      
            
    }
  }
  // this method to remove token from session
  logout() {
    sessionStorage.removeItem('tokenkey');
    this.userEmail = null;
    // after that redirect to home
    this.router.navigateByUrl('/home');
  }
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  checkUserRole() {
    if (this.authService.isSeller()) {
      this.isSeller = true;
      console.log("Welcome, Seller!");
    } else {
      this.isSeller = false;
      console.log("you are not seller")
      this.router.navigateByUrl('/home');
    }
  }
}
