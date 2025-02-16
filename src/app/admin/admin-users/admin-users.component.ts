<<<<<<< HEAD
import { Component, Inject, OnInit } from '@angular/core';
// import { AdminUserApiService } from '../../_services/admin-user-api.service';
=======
import { Component, OnInit } from '@angular/core';
import { AdminUserApiService } from '../../services/admin-user-api.service';
>>>>>>> 52b38a8db8242900dec30d5677e1992197e8da7f
import { User } from '../../_models/user';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { AdminUserApiService } from '../../services/admin-user-api.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  imports: [CommonModule, RouterLink],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRoles: string[] = [];
  availableRoles: string[] = ['Customer', 'Admin', 'Cashier', 'Seller'];

<<<<<<< HEAD
    constructor(@Inject(AdminUserApiService) private _adminUsersApi: AdminUserApiService) {}

    ngOnInit(): void {
        this.getAllUsers();

    }

    getAllUsers(): void {

      this._adminUsersApi.getAllUsers().subscribe({
          next: (res: { users: User[]; }) => {
              console.log("API Response:", res);
              if (res && res.users) {
                  this.users = res.users;
                  console.log(this.users[4]);

              } else {
                  console.error("Unexpected API response format:", res);
              }
          },
          error: (err: { error: any; }) => {
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
                next: (res: { message: any; })=>{
                    console.log(res);
                    Swal.fire({
                        title: "Removed!",
                        text: res.message,
                        icon: "success"
                      });
                      this.getAllUsers();
                },
                error: (err: { error: { message: any; }; })=>{
                    Swal.fire(`${err.error.message}`);

                }
            })
        }
      });

=======
  constructor(private _adminUsersApi: AdminUserApiService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this._adminUsersApi.getAllUsers().subscribe({
      next: (res) => {
        if (res && res.users) {
          this.users = res.users;
          this.filteredUsers = res.users;
        } else {
          console.error('Unexpected API response format:', res);
        }
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  toggleRoleFilter(role: string, event: any): void {
    if (event.target.checked) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    }
    this.filterUsers();
  }

  filterUsers(): void {
    if (this.selectedRoles.length === 0) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter((user) =>
        this.selectedRoles.includes(user.role)
      );
    }
  }

  removeUser(userId: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete User!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._adminUsersApi.removeUser(userId).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Removed!',
              text: res.message,
              icon: 'success',
            });
            this.getAllUsers();
          },
          error: (err) => {
            Swal.fire(`${err.error.message}`);
          },
        });
      }
    });
>>>>>>> 52b38a8db8242900dec30d5677e1992197e8da7f
  }

  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'manager':
        return 'role-manager';
      case 'cashier':
        return 'role-cashier';
      case 'sales':
        return 'role-sales';
      default:
        return 'status-active';
    }
<<<<<<< HEAD
}

=======
  }
>>>>>>> 52b38a8db8242900dec30d5677e1992197e8da7f
}
