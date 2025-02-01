import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // loginForm: any;
  // onSubmit(arg0: any) {
  // throw new Error('Method not implemented.');
  // }
  Userloginform: FormGroup; //crate membervariable from FormGroup

  constructor() {
    //intiallize the formgroup
    this.Userloginform = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),

      // address:new FormGroup({
      //   city:new FormControl(''),
      //   street:new FormControl(''),

      // })
    });
  }
  login() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'login success',
      showConfirmButton: false,
      timer: 1500,
    });

    // alert("login success")
  }
}
