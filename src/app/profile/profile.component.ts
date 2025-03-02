import { Component, OnInit } from'@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileService } from '../services/user-profile.service';
import { User } from '../_models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl:'./profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  userId: string | null | undefined;
  user: User | null = null;
  route: any;

  constructor(
    private fb: FormBuilder,
    private profileService: UserProfileService,
    private router: Router,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadUserData(); // Call this method to set the userId

    if (this.userId) {
      console.log("Entered")
      this.profileService.getProfile(this.userId).subscribe({
        next: (data: User) => {
          console.log("********************************")
          console.log(data)
          this.user = data; // Store the fetched user data
          this.profileForm.patchValue(data); // Patch the form with fetched data
        },
        error: (error: any) => {
          console.error('Error fetching profile:', error);
          alert('Failed to fetch profile data. Please try again.');
        },
      });
    } else {
                    console.error('User ID is missing.');
      alert('User ID is missing. Please try again.');
    }
  }
  loadUserData() {
    console.log("Loading user data... from profile ");

    const token = sessionStorage.getItem('tokenkey');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // Debugging

      // Use the correct field from the decoded token
      this.userId = decodedToken?.userId||decodedToken?.userid; // Use 'userid' instead of 'userId'
      console.log('User ID:', this.userId); // Debugging
    } else {
      console.log("No token found in sessionStorage.");
    }
  }


  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }
  get lastName() {
    return this.profileForm.get('lastName');
  }
  get email() {
    return this.profileForm.get('email');
  }
  // get gender() {
  //   return this.profileForm.get('gender');
  // }
  // get contactNo() {
  //   return this.profileForm.get('contactNo');
  // }
  get newPassword() {
    return this.profileForm.get('newPassword');
  }
  get confirmPassword() {
    return this.profileForm.get('confirmPassword');
  }

  onSubmit() {
    console.log('Form Data:', this.profileForm.value); // Debugging
    console.log('Form Valid:', this.profileForm.valid); // Debugging
    console.log('Form Errors:', this.profileForm.errors); // Debugging
    console.log('User ID:', this.userId); // Debugging

    if (this.profileForm.valid && this.userId) {
      const formData: User = this.profileForm.value; // Use the User model for type safety
      this.profileService.updateUserProfile(this.userId, formData).subscribe({
        next: (response: any) => {
          console.log('Profile updated successfully!', response);
          alert('Profile updated successfully!');
          this.router.navigate(['/profile']); // Navigate to profile page
        },
        error: (error: any) => {
          console.error('Error updating profile:', error);
          alert('Failed to update profile. Please try again.');
        },
      });
    } else {
      console.error('Form is invalid or User ID is missing.');
      alert('Please fill out the form correctly.');
    }
  }

  onCancel() {
    this.router.navigate(['/profile']); // Navigate back to profile page
  }
}
