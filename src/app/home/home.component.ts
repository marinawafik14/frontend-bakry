import { Component } from '@angular/core';

import { OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    const myCarousel: any = document.querySelector("#myCarousel");
    interval:3000
  };
}


