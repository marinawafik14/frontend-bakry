import { Component, OnInit } from '@angular/core';
import { AdminUserApiService } from '../../services/admin-user-api.service';
import { User } from '../../_models/user';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  imports: [CommonModule, RouterLink]
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];  // Ensuring it's an array

    constructor(private _adminUsersApi: AdminUserApiService) {
        this.getAllUsers();
    }

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

  removeUser(userId:any){
    Swal.fire({
        title: "Are you sure u want to delete this user?",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete User!"
      }).then((result) => {
        if (result.isConfirmed) {
            console.log('deleted');
            this._adminUsersApi.removeUser(userId).subscribe({
                next: (res)=>{
                    console.log(res);
                    Swal.fire({
                        title: "Removed!",
                        text: res.message,
                        icon: "success"
                      });
                      this.getAllUsers();
                },
                error: (err)=>{                    
                    Swal.fire(`${err.error.message}`);
                        
                }
            })
        }
      });
   
  }
  getUserRole(role:string){
        this._adminUsersApi.getUsersByRole(role).subscribe({
            next: (res)=>{
                console.log(res);
                if (res && res.users) {
                    this.users = res.users;                    
                } else {
                    console.error("Unexpected API response format:", res);
                }
            },
            error: (err) => {
                console.log(err.error);
            }
        })

  }
  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
        case 'admin':
            return 'role-admin'; // Red
        case 'manager':
            return 'role-manager'; // Blue
        case 'cashier':
            return 'role-cashier'; // Green
        case 'sales':
            return 'role-sales'; // Purple
        default:
            return 'status-active'; // Gray
    }
}
  
}
