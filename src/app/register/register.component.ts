
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserserviceService } from '../services/user.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { user } from '../models/user.model';
import { User } from '../_models/user';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  Userregisterform: FormGroup;
  user: user = new user(); // will use it to bind data from ui

  constructor(private _authService: AuthService , public userservice:UserserviceService , public router: Router) {
    this.Userregisterform = new FormGroup(
      {
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      { validators: passwordMatchValidator }
    );
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  register() {
    if (this.Userregisterform.valid) {
      // Populate the user object with form values
      this.user.firstname = this.Userregisterform.value.firstName;
      this.user.lastname = this.Userregisterform.value.lastName;
      this.user.email = this.Userregisterform.value.email;
      this.user.password = this.Userregisterform.value.password;
      
      this.userservice.register(this.user).subscribe({
        next: (res) => {
          console.log('Done Register', res);
          console.log(this._authService.getDecodedToken());
const token =res.token;

   if(res.token){
   sessionStorage.setItem('tokenkey',res.token);

   // Decode the token to get user role
   const decodedToken: any = jwtDecode(res.token);
   console.log("Decoded Token:", decodedToken);
   const role = this._authService.getRole();
   console.log("User Role:", role);
   // check the user is supplier

   if (role === 'Supplier') {
    this.router.navigate(['/seller-dashboard']);
  }
}
          Swal.fire({
            title: 'Registration Success!',
            html: `
            <div>
              <p><strong>First Name:</strong> ${this.Userregisterform.value.firstName}</p>
              <p><strong>Last Name:</strong> ${this.Userregisterform.value.lastName}</p>
              <p><strong>Email:</strong> ${this.Userregisterform.value.email}</p>
            </div>`,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          });
          // Navigate to the home page
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: `Registration failed: ${err.message}`,
            icon: 'error',
            showConfirmButton: true,
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        showConfirmButton: true,
      });
    }
  }

  get firstName() {
    return this.Userregisterform.get('firstName');
  }

  get lastName() {
    return this.Userregisterform.get('lastName');
  }

  get email() {
    return this.Userregisterform.get('email');
  }

  get password() {
    return this.Userregisterform.get('password');
  }

  get confirmPassword() {
    return this.Userregisterform.get('confirmPassword');
  }
}


