import { Component, OnInit } from '@angular/core';
import { Products } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SellerServicesService } from '../../services/seller-services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-add-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  categories: Array<{ _id: string; name: string }> = [];
  branchError: string | null = null;
  alternativeBranches: any[] = [];
  branchCapacityErrors: string[] = [];
  branchesWithCapacity: { [branchName: string]: number } = {};
  productAdd: Products = new Products(
    '', '', '', 0, '', 0, 0, 0,'' ,'', false,'','', new Date(), new Date(), [], '', []
  );

  // Stores dynamic branches and quantities
  branchInputs: { branch: string; quantity: number }[] = [{ branch: '', quantity: 1 }];


  constructor(
    public prosrv: SellerServicesService,
    public ProductService: ProductService,
    private http: HttpClient,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.ProductService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories);
    });
  }

    // Method to add a new branch input field
    addBranch(): void {
      this.branchInputs.push({ branch: '', quantity: 1 });
    }
  
    // Method to remove a branch input field
    removeBranch(index: number): void {
      this.branchInputs.splice(index, 1);
    }

  // Method to handle file selection for product images
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productAdd.images.push(file); // Push file into images array
    }
  }


  save(): void {
    console.log('Before checking capacity:', this.branchInputs);

    const branches = this.branchInputs.map(b => b.branch);
    const quantities = this.branchInputs.map(b => b.quantity);

    // Validate and check branch capacity before saving
    this.checkBranchCapacity(branches, quantities).then(() => {
      if (this.branchCapacityErrors.length === 0) {
        const formData = new FormData();
        formData.append('name', this.productAdd.name);
        formData.append('description', this.productAdd.description);
        formData.append('price', this.productAdd.price.toString());
        formData.append('previousprice', this.productAdd.previousprice.toString());
        formData.append('stock', this.productAdd.stock.toString());
        formData.append('flavor', this.productAdd.flavor);
        formData.append('categoryid', this.productAdd.categoryid.toString());
        const formattedBranches = this.branchInputs.map(branchInput => ({
          branch: branchInput.branch,
          quantity: branchInput.quantity
        }));

        formData.append('branches', JSON.stringify(formattedBranches));
        const totalStock = formattedBranches.reduce((sum, b) => sum + b.quantity, 0);
        formData.append('stock', totalStock.toString());
        // Append images
        this.productAdd.images.forEach(image => {
          formData.append('images', image);
        });

        console.log('Final FormData:', formData);

        this.ProductService.createProduct(formData).subscribe(
          (response) => {
            Swal.fire({
              title: 'Success!',
              text: 'Product added successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        Swal.fire({
          title: 'Error!',
          text: this.branchCapacityErrors.join('\n'),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onPositiveNumber(event: any): void {
    const value = event.target.value;
    const regex = /^[+]?\d+(\.\d+)?$/;
    if (!regex.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }


  checkBranchCapacity(branches: string[], quantities: number[]): Promise<void> {
    this.branchCapacityErrors = [];
    this.branchesWithCapacity = {};
  
    // ✅ Fix: Remove duplicate branch names to avoid multiple calls
    const uniqueBranches = Array.from(new Set(branches));
  
    const capacityCheckPromises = uniqueBranches.map((branchName, index) => {
      return new Promise<void>((resolve, reject) => {
        this.ProductService.checkBranchCapacity(branchName, quantities[index]).subscribe(
          (response) => {
            if (response.exceedsCapacity) {
              const errorMsg = `Branch ${branchName} has insufficient capacity. Available: ${response.availableCapacity}`;
  
              // ✅ Fix: Ensure each error is added only once
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
  
