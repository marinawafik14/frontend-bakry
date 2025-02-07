import { Component, OnInit } from '@angular/core';
import { AdminUserApiService } from '../../_services/admin-user-api.service';
import { User } from '../../_models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  imports: [CommonModule]
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];  // Ensuring it's an array

    constructor(private _adminUsersApi: AdminUserApiService) {}

    ngOnInit(): void {
        this.getAllUsers();
        
    }

    getAllUsers(): void {
      this._adminUsersApi.getAllUsers().subscribe({
          next: (res) => {
              console.log("API Response:", res);
              if (res && res.users) {
                  this.users = res.users;
                  console.log(this.users[4]);
                  
              } else {
                  console.error("Unexpected API response format:", res);
              }
          },
          error: (err) => {
              console.log(err.error);
          }
      });
  }
  
}
