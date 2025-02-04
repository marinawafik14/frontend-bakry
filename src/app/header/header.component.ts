import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartApiService } from '../_services/cart-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports:[RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;

  constructor(private cartService: CartApiService, public router: Router) {}

  ngOnInit(): void {
    // Subscribe to cart count updates
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  logout(): void {
    sessionStorage.removeItem('tokenkey');
    this.router.navigateByUrl('/home');
  }
}
