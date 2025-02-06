import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserserviceService } from '../services/user.service';

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

  constructor(public userservice:UserserviceService , public router:Router) {
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
  if (this.Userloginform.valid) {
    // Populate the user object with form values
    const user = {
      email: this.Userloginform.value.email,
      password: this.Userloginform.value.password,
    };

    this.userservice.login(user).subscribe({
      next: (response) => {
 if (response && response.token) {
   sessionStorage.setItem('tokenkey', response.token);
   console.log('Token stored:', response.token);
 } else {
   console.warn('No token received from the API.');
 }        Swal.fire({
          title: 'Login Success!',
          html: `
          <div>
            <p><strong>Email:</strong> ${user.email}</p>
            <p>Welcome back!</p>
          </div>`,
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });

        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        Swal.fire({
          title: 'Login Failed!',
          text: `Error: ${err.error?.message || 'Invalid credentials'}`,
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



    // alert("login success")
  }

}
