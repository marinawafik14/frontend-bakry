import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public router:Router){

  }

  logout(){
    sessionStorage.removeItem('tokenkey');
      this.router.navigateByUrl('/home');
  }
}
