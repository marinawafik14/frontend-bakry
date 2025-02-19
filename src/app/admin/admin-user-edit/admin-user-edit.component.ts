import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminUserApiService } from '../../services/admin-user-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-user-edit',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin-user-edit.component.html',
  styleUrl: './admin-user-edit.component.css',
})
export class AdminUserEditComponent implements OnInit {
  user: any = {
    profile: { firstName: '', lastName: '', address: {}, contactNo: '' },
    email: '',
    role: '', // Ensure role exists to avoid binding issues
  };

  isEditingRole: boolean = false;

  constructor(
    public acroute: ActivatedRoute,
    router: Router,
    public _adminUsersApi: AdminUserApiService
  ) {}

  ngOnInit(): void {
    const userId = this.acroute.snapshot.paramMap.get('id');
    if (userId) {
      this.getUserById(userId);
    }
  }

  getUserById(userId: any) {
    this._adminUsersApi.getUserById(userId).subscribe({
        next: (data) => {
            this.user = data.user;
            if (this.user.profile?.dateOfBirth) {
                this.user.profile.dateOfBirth = this.user.profile.dateOfBirth.split('T')[0];
            }

            console.log(this.user);
        },
        error: (err) => console.error("Error fetching user:", err)
    });
}


  saveUser() {
    this._adminUsersApi.updateUser(this.user._id, this.user).subscribe({
        next: (res)=> {
          console.log(res);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User Updated",
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (err)=>{
            console.log(err);
        }
    })

  }


  toggleRoleEdit(){
  Swal.fire({
    title: 'Change User Role',
    html: `
      <select id="userRoleSelect" class="swal2-select form-control">
        <option value="Customer">Customer</option>
        <option value="Admin">Admin</option>
        <option value="Seller">Seller</option>
        <option value="Cashier">Cashier</option>
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const selectedRole = (document.getElementById('userRoleSelect') as HTMLSelectElement).value;
      if (!selectedRole) {
        Swal.showValidationMessage('Please select a role');
      }
      return selectedRole;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.user.role = result.value;
      console.log("Role updated to:", this.user.role);
    }
  });
  }
}
