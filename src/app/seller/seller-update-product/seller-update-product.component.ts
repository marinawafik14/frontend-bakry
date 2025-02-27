import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerServicesService } from '../../services/seller-services.service';
import { Products } from '../../models/products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SellerUpdateProductComponent implements OnInit {
  productUP: Products = new Products('','','',0,'',0,0,0,'','',false,'','',new Date(),new Date(),[],'')

  categories: Products[] = [];

  constructor(
    private updateProSrv: SellerServicesService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productID = params['id'];
      //console.log('Product ID from URL:', productID);
      if (!productID) {
        console.error(' No product ID found in URL. Cannot fetch product.');
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
          console.error(' Error fetching product:', error);
        }
      );
    });
  }

  updateProductone(): void {
    console.log("Updating product:", this.productUP);
    this.updateProSrv.updateProduct(this.productUP).subscribe(
      (response) => {
        console.log(' Product updated successfully:', response);
        this.router.navigate(['/dashboard']); // Redirect after update
      },
      (error) => {
        console.error(' Error updating product:', error);
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
}



