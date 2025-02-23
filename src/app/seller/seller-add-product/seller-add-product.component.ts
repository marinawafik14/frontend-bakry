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

  // Method to handle file selection for product images
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productAdd.images.push(file); // Push file into images array
    }
  }

  // Save the product after checking for branch capacity
  save(): void {
    // this.productAdd.branch = Array.isArray(this.productAdd.branch) ? this.productAdd.branch : [this.productAdd.branch];

    console.log('Before check: ', this.productAdd.branch);
this.productAdd.branch = Array.isArray(this.productAdd.branch) ? this.productAdd.branch : [this.productAdd.branch];
console.log('After check: ', this.productAdd.branch);

    console.log('Product data:', this.productAdd);

    const formData = new FormData();
    formData.append('name', this.productAdd.name);
    formData.append('description', this.productAdd.description);
    formData.append('price', this.productAdd.price.toString());
    formData.append('previousprice', this.productAdd.previousprice.toString());
    formData.append('stock', this.productAdd.stock.toString());
    formData.append('flavor', this.productAdd.flavor);
    formData.append('categoryid', this.productAdd.categoryid.toString());

    // Append the branch names
    this.productAdd.branch.forEach((branch) => {
      formData.append('branch', branch);
    });

    // Append the images
    this.productAdd.images.forEach((image) => {
      formData.append('images', image);
    });

      // Log final formData to inspect
  console.log('Form data prepared:', formData);

    // Check the branch capacity before submitting the product
    this.checkBranchCapacity(this.productAdd.branch, this.productAdd.stock).then(() => {
      if (this.branchCapacityErrors.length === 0) {
        // If there are no errors in capacity, create the product
        this.ProductService.createProduct(formData).subscribe(
          (response) => {
            console.log('✅ Product added:', response);
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
            console.error('Error adding product:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        // If there are errors in branch capacity, do not proceed
        Swal.fire({
          title: 'Error!',
          text: this.branchCapacityErrors.join('\n'),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while checking branch capacity.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  // Method to ensure only positive numbers are entered
  onPositiveNumber(event: any): void {
    const value = event.target.value;
    const regex = /^[+]?\d+(\.\d+)?$/;
    if (!regex.test(value)) {
      event.target.value = value.slice(0, -1); // Remove invalid character
    }
  }

  // Method to check branch capacity before saving the product
 // Check branch capacity and update errors
 checkBranchCapacity(branches: string[], quantity: number): Promise<void> {
  this.branchCapacityErrors = []; // Clear previous errors
  this.branchesWithCapacity = {}; // Clear previous branches with capacity

  if (!Array.isArray(branches)) {
    console.error('Branches should be an array.');
    return Promise.reject('Branches should be an array.');
  }

  const capacityCheckPromises = branches.map((branchName) => {
    return new Promise<void>((resolve, reject) => {
      this.ProductService.checkBranchCapacity(branchName, quantity).subscribe(
        (response) => {
          if (response.exceedsCapacity) {
            // If there's not enough capacity, log the error
            this.branchCapacityErrors.push(
              `Branch ${branchName} has insufficient capacity. Available: ${response.availableCapacity}`
            );
          } else {
            // If there is enough capacity, store the branch name and available capacity
            this.branchesWithCapacity[branchName] = response.availableCapacity;
          }
          resolve();
        },
        (error) => {
          console.error('Error fetching branch capacity:', error);
          this.branchCapacityErrors.push('Error checking branch capacity.');
          reject(error);
        }
      );
    });
  });

  return Promise.all(capacityCheckPromises).then(() => {
    // Only display the available capacity message if there are no errors
    if (this.branchCapacityErrors.length === 0) {
      if (Object.keys(this.branchesWithCapacity).length > 0) {
        const branchesWithEnoughCapacity = Object.keys(this.branchesWithCapacity)
          .map(
            (branchName) =>
              `${branchName} has available capacity of ${this.branchesWithCapacity[branchName]} units.`
          )
          .join(' ');
      }
    }
  });
}


processBranchesInput(input: string | string[]): void {
  if (typeof input === 'string') {
    // If input is a string, split it into an array
    this.productAdd.branch = input.split(',').map((branch) => branch.trim());
  } else {
    // If input is already an array, leave it as it is
    this.productAdd.branch = input;
  }

  // Now call the branch capacity check with the updated branch array
  this.checkBranchCapacity(this.productAdd.branch, this.productAdd.stock);
}


}

