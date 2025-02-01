// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { FormGroup, FormControl, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-register',
//   imports: [FormsModule,RouterLink,ReactiveFormsModule,CommonModule],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent {
//   Userregisterform:FormGroup  //crate membervariable from FormGroup

//   constructor(){
//     this.Userregisterform = new FormGroup({
//        firstname:new FormControl('',[Validators.required,Validators.minLength(3)]),
//         lastname:new FormControl('',[Validators.required,Validators.minLength(3)]),
//         email:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
//         password:new FormControl('',[Validators.required,Validators.minLength(6)]),
//         confirmpassword:new FormControl('',[Validators.required,Validators.minLength(6)]),

//     }) //intiallize the formgroup
//   }

//   register(){
//     alert("register success")
//   }
//    get firstname(){
//     return this.Userregisterform.get('firstname');
//    }
//     get lastname(){
//       return this.Userregisterform.get('lastname');
//     }
//     get email(){
//       return this.Userregisterform.get('email');
//     }
//     get password(){
//       return this.Userregisterform.get('password');
//     }
//     get confirmPassword(){
//       return this.Userregisterform.get('confirmpassword');
//     }
// }
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

  constructor(public userservice: UserserviceService, public router: Router) {
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

  // register() {
  //  Swal.fire({
  //    position: "top-end",
  //    icon: "success",
  //    title: "create success",
  //    showConfirmButton: false,
  //    timer: 1500
  //  });
  // }

  // register() {
  //   if (this.user.firstname && this.user.lastname && this.user.email && this.user.password) {
  //    this.userservice.register(this.user).subscribe({
  //       next: () => {
  //         Swal.fire({
  //           position: 'top-end',
  //           icon: 'success',
  //           title: 'User created successfully!',
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });
  //         // Navigate to the login page or another route
  //         this.router.navigateByUrl('/home');
  //       },
  //       error: (err) => {
  //         Swal.fire({
  //           position: 'top-end',
  //           icon: 'error',
  //           title: `Registration failed: ${err.message}`,
  //           showConfirmButton: true,
  //         });
  //       },
  //     });
  //   } else {
  //     Swal.fire({
  //       position: 'top-end',
  //       icon: 'warning',
  //       title: 'Please fill in all required fields.',
  //       showConfirmButton: true
  //     });
  //   }}

  register() {
    if (this.Userregisterform.valid) {
      // Populate the user object with form values
      this.user.firstname = this.Userregisterform.value.firstName;
      this.user.lastname = this.Userregisterform.value.lastName;
      this.user.email = this.Userregisterform.value.email;
      this.user.password = this.Userregisterform.value.password;

      this.userservice.register(this.user).subscribe({
        next: () => {
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
