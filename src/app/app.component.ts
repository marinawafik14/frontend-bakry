import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  showHeaderFooter = true;
  title = 'ecomerce-bakery';
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.showHeaderFooter = !(
          url.includes('/admin') ||
          url.includes('/cashier') ||
          url.includes('/dashboard')||
          url.includes('/login')||
          url.includes('/register')
        );
        console.log('Current URL:', url.includes('/home'), 'Show header/footer:', this.showHeaderFooter);

      }
    });
  }
}
