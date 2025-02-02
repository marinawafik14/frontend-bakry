
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { AuthService } from '../_service/auth.service';
import { user } from '../../../model/user.model';

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

  constructor(private _authService: AuthService) {
    this.Userregisterform = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, { validators: passwordMatchValidator });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  register() {

    if (this.Userregisterform.valid) {
      const userData = this.Userregisterform.value;
      delete userData.confirmPassword;

      this._authService.register(userData).subscribe(
        (res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "create success",
            showConfirmButton: false,
            timer: 1500
          });
          console.log('register success');
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          console.log('register failed');
        }
      );
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
