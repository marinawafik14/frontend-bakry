import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-dashbord-seller',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, RouterModule],
  templateUrl: './dashbord-seller.component.html',
  styleUrls: ['./dashbord-seller.component.css']
})
export class DashbordSellerComponent {
  constructor() {}





}
