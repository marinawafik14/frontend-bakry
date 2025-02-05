
import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { CartApiService } from '../_services/cart-api.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive ,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
    cartCount: number = 0;
  constructor(public router: Router , private cartService: CartApiService) {
    this.loadUserData();
  }
  ngOnInit(): void {
     // Subscribe to cart count updates
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
  })}
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
    }
  }
  // this method to remove token from session
  logout() {
    sessionStorage.removeItem('tokenkey');
    this.userEmail = null;
    // after that redirect to home
  }
  }
