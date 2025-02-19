import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileService } from '../services/user-profile.service';
import { User } from '../models/UserProfile';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileFormComponent implements OnInit  {
  profileForm!: FormGroup;
  userId!: string;


  constructor(
    private fb: FormBuilder,
    private profileService: UserProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: this.fb.group({
        city: ['', Validators.required],
        governorate: ['', Validators.required]
      }),
      contactNo: ['', Validators.required],
      currentPassword: [''],
      newPassword: ['']
    });
    this.profileService.getUserProfile(this.userId).subscribe(
      (user: User|any) => {
        this.profileForm.patchValue(user );
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }



  onSubmit() {
    if (this.profileForm.valid) {
      const updateData = this.profileForm.value;
      this.profileService.updateUserProfile(this.userId, updateData).subscribe(
        (response) => {
          console.log('Profile updated successfully:', response);
          alert('Profile updated successfully');
          this.router.navigate(['/profile', this.userId]); // Redirect to profile page
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile');
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/profile', this.userId]);
  }

  get firstName() { return this.profileForm.get('firstName')!; }
  get lastName() { return this.profileForm.get('lastName')!; }
  get gender() { return this.profileForm.get('gender')!; }
  get dateOfBirth() { return this.profileForm.get('dateOfBirth')!; }
  get address() { return this.profileForm.get('address') as FormGroup; }
  get contactNo() { return this.profileForm.get('contactNo')!; }
  get newPassword() { return this.profileForm.get('newPassword')!; }
  get currentPassword() { return this.profileForm.get('currentPassword')!; }
}
