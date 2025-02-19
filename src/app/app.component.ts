import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
import { AuthService } from './services/auth.service';

>>>>>>> 52b38a8db8242900dec30d5677e1992197e8da7f
@Component({
  standalone:true,
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecomerce-bakery';
  // constructor(@Inject(AuthService) public _authService: AuthService){
  // }
}
