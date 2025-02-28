import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BranchesService } from '../../services/branches.service';
import { Branch } from '../../models/branches';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-admin-base',
  imports: [RouterOutlet, RouterLink , CommonModule, RouterLinkActive],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.css'
})
export class AdminBaseComponent implements OnInit {
branches: Branch[] = [];   
loggedRole: string = ''
loggedEmail: string = ''
decodedToken:any
branchFound:any
branchId: any


constructor(private branchesservice: BranchesService, public authService:AuthService, 
  public router:Router,
  private cdr: ChangeDetectorRef
) { 

}
ngOnInit(): void {
  // Fetch branches
  this.branchesservice.getallbranches().subscribe({
    next: (data: Branch[]) => {
      this.branches = data;
      console.log('Branches fetched:', this.branches);

      // Get decoded token
      this.decodedToken = this.authService.getDecodedToken();
      console.log("Decoded Token: " + this.decodedToken.email);
      this.loggedEmail = this.decodedToken.email;
      this.loggedRole = this.decodedToken.role;


      // Find branch by clerk ID
      this.branchFound = this.getBranchByClerkId(this.decodedToken.userId);
      console.log("Branch Found:", this.branchFound);
      this.branchId = this.branchFound._id
      
      if (this.loggedRole === 'Clerk') {
        this.router.navigate(['admin/branch', this.branchFound._id]); // Alternative syntax
      }
    },
    error: (err) => {
      console.error('Error fetching branches', err);
    },
  });
}

getBranchByClerkId(clerkId: string): Branch | null {
  if (!this.branches || this.branches.length === 0) {
    console.log("Branches data is not yet available.");
    return null;
  }

  const branch = this.branches.find((b) => b.clerks.includes(clerkId));
  return branch || null;
}


  logout(){
    localStorage.removeItem('token');
      console.log("logout done")
      this.router.navigateByUrl('home');
    }
    
}
