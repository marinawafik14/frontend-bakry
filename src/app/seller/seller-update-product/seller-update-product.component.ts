import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerServicesService } from '../../services/seller-services.service';
import { Products } from '../../models/products';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SellerUpdateProductComponent implements OnInit {
  productUP: Products = new Products('','','',0,'',0,0,0,'','',false,'','',new Date(),new Date(),[],'',[])

  //categories: Products[] = [];

// Stores dynamic branches and quantities
branchInputs: { branch: string; quantity: number }[] = [{ branch: '', quantity: 1 }];
categories: Array<{ _id: string; name: string }> = [];
  branchError: string | null = null;
  alternativeBranches: any[] = [];
  branchCapacityErrors: string[] = [];
  branchesWithCapacity: { [branchName: string]: number } = {};
// List of allowed branches
allowedBranches: string[] = ['Cairo Branch', 'Mansoura Branch'];



  constructor(
    private updateProSrv: SellerServicesService,
    private route: ActivatedRoute,
    private router: Router,
private ProductService : ProductService

  ) {}






  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productID = params['id'];
      //console.log('Product ID from URL:', productID);
      if (!productID) {
        console.error(" No product ID found in URL. Cannot fetch product.");
        return;
      }

      this.updateProSrv.getById(productID).subscribe(
        (product) => {
          if (product) {
            this.productUP = product;
           // console.log(" Product loaded:", this.productUP);
          } else {
            //console.warn(" No product data received from API.");
          }
        },
        (error) => {
          console.error(" Error fetching product:", error);
        }
      );
    });
  }





  updateProductone(): void {
    this.productUP.branch = this.branchInputs.map(branchInput => branchInput.branch);
    console.log("Updating product:", this.productUP);
    this.updateProSrv.updateProduct(this.productUP).subscribe(
      (response) => {
        console.log(" Product updated successfully:", response);
        this.router.navigate(['/dashboard']);  // Redirect after update
      },
      (error) => {
        console.error(" Error updating product:", error);
      }
    );
  }



  onFileSelected(event: Event, imageIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (this.productUP.images.length < imageIndex) {
          this.productUP.images.push(reader.result as string);
        } else {
          this.productUP.images[imageIndex - 1] = reader.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  }

//check to accept only positive number

onPositiveNumber(event: any): void {
  const value = event.target.value;
  const regex = /^[+]?\d+(\.\d+)?$/;


  if (!regex.test(value)) {
    event.target.value = value.slice(0, -1); // Remove the invalid character
  }
}
 // Method to add a new branch input field
 addBranch(): void {
  this.branchInputs.push({ branch: '', quantity: 1 });
}

// Method to remove a branch input field
removeBranch(index: number): void {
  this.branchInputs.splice(index, 1);
}


checkBranchCapacity(branches: string[], quantities: number[]): Promise<void> {
  this.branchCapacityErrors = [];
  this.branchesWithCapacity = {};

  //Remove duplicate branch names to avoid multiple calls
  const uniqueBranches = Array.from(new Set(branches));

  const capacityCheckPromises = uniqueBranches.map((branchName, index) => {
    return new Promise<void>((resolve, reject) => {
      this.ProductService.checkBranchCapacity(branchName, quantities[index]).subscribe(
        (response) => {
          if (response.exceedsCapacity) {
            const errorMsg = `Branch ${branchName} has insufficient capacity. Available: ${response.availableCapacity}`;

            //  Ensure each error is added only once
            if (!this.branchCapacityErrors.includes(errorMsg)) {
              this.branchCapacityErrors.push(errorMsg);
            }
          } else {
            this.branchesWithCapacity[branchName] = response.availableCapacity;
          }
          resolve();
        },
        (error) => {
          const errorMsg = `Error checking capacity for branch: ${branchName}`;
          if (!this.branchCapacityErrors.includes(errorMsg)) {
            this.branchCapacityErrors.push(errorMsg);
          }
          reject(error);
        }
      );
    });
  });

  return Promise.all(capacityCheckPromises).then(() => {});
}




// Called when a branch name or quantity is updated
onBranchInputChange(index: number): void {
const branch = this.branchInputs[index].branch;
const quantity = this.branchInputs[index].quantity;

if (branch && quantity > 0) {
  clearTimeout((this as any).branchCheckTimeout);
  (this as any).branchCheckTimeout = setTimeout(() => {
    this.checkBranchCapacity(
      this.branchInputs.map(b => b.branch),
      this.branchInputs.map(b => b.quantity)
    );
  }, 300); // Delay prevents excessive function calls
}
}





}
