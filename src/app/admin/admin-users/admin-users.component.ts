import { Component, OnInit } from '@angular/core';
import { AdminUserApiService } from '../../services/admin-user-api.service';
import { User } from '../../_models/user';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  selectedRole: string = 'Users';
  availableRoles: string[] = ['All Users', 'Customer', 'Admin', 'Cashier', 'Seller', 'Clerk', 'Supplier'];

  constructor(private adminUserApi: AdminUserApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminUserApi.getAllUsers().subscribe({
      next: (res) => {
        console.log('Users fetched:', res);
        if (res && res.users) {
          this.users = res.users;
        } else {
          console.error('Unexpected API response format:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  getUserRole(role: string): void {
    if (role === 'All Users') {
      this.loadUsers();
    } else {
      this.adminUserApi.getUsersByRole(role).subscribe({
        next: (res) => {
          console.log('Filtered users:', res);
          if (res && res.users) {
            this.users = res.users;
            this.selectedRole = role;
          } else {
            console.error('Unexpected API response format:', res);
          }
        },
        error: (err) => {
          console.error('Error fetching users by role:', err);
        },
      });
    }
  }

  removeUser(userId: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete User!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminUserApi.removeUser(userId).subscribe({
          next: (res) => {
            Swal.fire('Removed!', res.message, 'success');
            this.loadUsers();
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Failed to delete user.', 'error');
          },
        });
      }
    });
  }

  // Assigning badge styles to roles
  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-primary';
      case 'seller':
        return 'bg-info';
      case 'customer':
        return 'bg-success';
      case 'cashier':
        return 'bg-warning';
      case 'clerk':
        return 'bg-secondary';
      case 'supplier':
        return 'bg-dark';
      default:
        return 'bg-light';
    }
  }

  // Pagination methods
  get pagedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  firstPage(): void {
    this.currentPage = 1;
  }
  
  lastPage(): void {
    this.currentPage = this.totalPages();
  }
  
  

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortUsers(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  
    this.users.sort((a: any, b: any) => {
      let valueA = this.getNestedValue(a, field);
      let valueB = this.getNestedValue(b, field);
  
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
  
      if (this.sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }
  
  // Helper function to access nested properties
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }
  
}
