import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-base',
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.css'
})
export class AdminBaseComponent {

}
