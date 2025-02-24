import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileService } from '../services/user-profile.service';
import { User } from '../_models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private profileService: UserProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      console.log(this.userId);
      
      this.loadUserData();
    });
    this.loadUserData();
  }

  private loadUserData() {
    if (!this.userId) {
      console.error('User ID is undefined'); 
      return;
    }
    this.profileService.getUserProfile(this.userId).subscribe({
      next: (user) => {
        console.log('User data loaded:', user);
        this.profileForm.patchValue({
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          gender: user.profile.gender,
          dateOfBirth: user.profile.dateOfBirth,
          address: {
            city: user.profile.address.city,
            governorate: user.profile.address.governorate
          },
          contactNo: user.profile.contactNo
        });

      },
      error: (err) => console.error('Error loading profile', err)
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {

      const updatedProfile = {
        profile: {

          firstName: this.profileForm.value.firstName,
          lastName: this.profileForm.value.lastName,
          gender: this.profileForm.value.gender,
          dateOfBirth: this.profileForm.value.dateOfBirth,
          address: {
            city: this.profileForm.value.address.city,
            governorate: this.profileForm.value.address.governorate
          },
          contactNo: this.profileForm.value.contactNo
        }
      };
      console.log('User profile loaded:', updatedProfile);

      this.profileService.updateUserProfile(this.userId, updatedProfile).subscribe({
        next: (updated) => console.log('Profile updated', updated),
        error: (err) => console.error('Update failed', err)
      });
    }
  }

  onCancel(): void {
    alert("Operation cancelled.");
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
