import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserserviceService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  Userloginform: FormGroup; //crate membervariable from FormGroup

  constructor(public userservice:UserserviceService , public router:Router, public _authservice:AuthService) {
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

    });
  }


 login() {
  if (this.Userloginform.valid) {
    // Retrieve guest cart from localStorage
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    // Populate user object with form values
    const user = {
      email: this.Userloginform.value.email,
      password: this.Userloginform.value.password,
      guestCart, // Send guestCart to backend
    };

    this.userservice.login(user).subscribe({
      next: (response) => {
        if (response && response.token) {
          sessionStorage.setItem("tokenkey", response.token); // Store new token
          localStorage.removeItem("guestCart"); // Clear guest cart after merging
          console.log("✅ Token stored:", response.token);
          console.log("✅ User logged in:", this._authservice.getDecodedToken()?.role);
          console.log(this._authservice.getDecodedToken());
        //  const userData = this._authservice.getDecodedToken();

          // will return data from token after decode it 

        } else {
          console.warn("⚠️ No token received from the API.");
        }

        Swal.fire({
          title: "Login Success!",
          html: `
          <div>
            <p><strong>Email:</strong> ${user.email}</p>
            <p>Welcome back!</p>
          </div>`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          setTimeout(() => {
            if(this._authservice.getDecodedToken()?.role === 'Seller') {
              this.router.navigateByUrl('/dashboard');
            }
            else if(this._authservice.getDecodedToken()?.role === 'Admin') {
              this.router.navigateByUrl('admin/dashboard');
            }else if(this._authservice.getDecodedToken()?.role === 'Cashier') {
              this.router.navigateByUrl("/cashier");
            }else if(this._authservice.getDecodedToken()?.role === 'Clerk') {
              this.router.navigateByUrl("admin");
            }
            else {  
              this.router.navigateByUrl("/home");
            }
           // this.router.navigateByUrl("/home");
          }, 1500);
        });
      },
      error: (err) => {
        console.log(err);

        Swal.fire({
          title: "Login Failed!",
          text: `Error: ${err.error?.message || "Invalid credentials"}`,
          icon: "error",
          showConfirmButton: true,
        });
      },
    });
  } else {
    Swal.fire({
      title: "Validation Error!",
      text: "Please fill in all required fields correctly.",
      icon: "warning",
      showConfirmButton: true,
    });
  }
}


}
