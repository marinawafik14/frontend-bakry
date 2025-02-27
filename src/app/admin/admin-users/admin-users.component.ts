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
  imports: [CommonModule, RouterLink],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRoles: string[] = [];
  availableRoles: string[] = ['Customer', 'Admin', 'Cashier', 'Seller'];
  userNumberMessage: any;
  selectedRole: string = 'Users'; 
  Role: string = ''

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
          this.filteredUsers = this.users; // Ensure filtered list is initialized
          this.selectedRole = 'Users'
        } else {
          console.error("Unexpected API response format:", res);
        }
      },
      error: (err) => {
        console.log(err.error);
      }
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

  removeUser(userId: any): void {
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
            console.log(res);
            
            this.getAllUsers();
          },
          error: (err) => {
            Swal.fire(`${err.error.message}`);
          },
        });
      }
    });
  }

  getUserRole(role: string): void {
    this._adminUsersApi.getUsersByRole(role).subscribe({
      next: (res) => {
        console.log(res);
        if (res && res.users) {
          this.users = res.users;
          this.filteredUsers = this.users;
          this.selectedRole = role;
        } else {
          console.error("Unexpected API response format:", res);
        }
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'manager':
        return 'role-manager';
      case 'cashier':
        return 'role-cashier';
      case 'seller':
        return 'role-sales';
      case 'customer':
          return 'role-customer';
      case 'supplier':
          return 'role-supplier';
      default:
        return 'role-default';
    }
  }
}
