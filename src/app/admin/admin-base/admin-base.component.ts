import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BranchesService } from '../../services/branches.service';
import { Branch } from '../../models/branches';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-base',
  imports: [RouterOutlet, RouterLink , CommonModule, RouterLinkActive],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.css'
})
export class AdminBaseComponent implements OnInit {
branches: Branch[] = [];   

constructor(private branchesservice: BranchesService) { 

}
  ngOnInit(): void {
    // sub 
this.branchesservice.getallbranches().subscribe({
  next: (data: Branch[]) => {
    this.branches = data;
    console.log('Branches fetched:', this.branches);
  },
  error: (err) => {
    console.error('Error fetching branches', err);
  },
}); 

  }
}
