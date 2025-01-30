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
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
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
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  Userregisterform: FormGroup;

  constructor() {
    this.Userregisterform = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, { validators: passwordMatchValidator });
  }

  register() {
   Swal.fire({
     position: "top-end",
     icon: "success",
     title: "create success",
     showConfirmButton: false,
     timer: 1500
   });
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


