import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../models/order';
import { OrdersService } from '../services/order.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';
import { CartApiService } from '../services/cart-api.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})

export class CheckoutComponent implements AfterViewInit,OnInit {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;
  citiesData: { [key: string]: string[] } = {
    Cairo: [
      'Cairo City Center',
      'Helwan',
      'Maadi',
      'Zamalek',
      'Nasr City',
      'Heliopolis',
    ],
    Giza: ['Giza City', '6th of October City', 'El-Agouza', 'Imbaba', 'Dokki'],
    Alexandria: [
      'Alexandria City',
      'Montazah',
      'Bahri',
      'Smouha',
      'Raml Station',
    ],
    Dakahlia: ['Mansoura', 'Talkha', 'Mit Ghamr', 'Dikirnis', 'Sinbillawin'],
    Sharqia: ['Zagazig', 'El-Hosaynia', 'Belbeis', 'Abu Hammad', 'Faqous'],
    'Port Said': ['Port Said City'],
    Suez: ['Suez City', 'Port Tawfik', 'Ain Sokhna'],
    Qena: ['Qena City', 'Nag Hammadi', 'Dandara', 'Farshut'],
    Aswan: ['Aswan City', 'Nubia', 'Kom Ombo', 'Edfu'],
    Ismailia: ['Ismailia City', 'Fayed', 'Abu Sultan'],
    Luxor: ['Luxor City', 'Karnak', 'Thebes', 'Esna'],
    Assiut: ['Assiut City', 'Abnoub', 'Dairut', 'Manfalut', 'El-Ghanayem'],
    Beheira: ['Damanhur', 'Kafr El-Dawar', 'Edco', 'Shubrakhit', 'Rosetta'],
    Damietta: ['Damietta City', 'Ras El-Bar', 'Kafr Saad', 'New Damietta'],
    'Kafr El Sheikh': ['Kafr El Sheikh City', 'Desouk', 'Qalyub', 'Beyala'],
    Minya: ['Minya City', 'Mallawi', 'Bani Mazar', 'Samalut'],
    Monufia: ['Shibin El Kom', 'Minuf', 'Tala', 'Ashmoun'],
    Gharbia: ['Tanta', 'Mahalla', 'Kafr El Zayat', 'Zefta', 'Samanoud'],
    'Beni Suef': ['Beni Suef City', 'Fayoum City', 'El-Fashn', 'Samasta'],
    Fayoum: ['Fayoum City', 'Ibshway', 'Tameya', 'Sennuris'],
    Qalyubia: ['Benha', 'Shubra El-Kheima', 'Khosous', 'Qalyub'],
    Sohag: ['Sohag City', 'Gerga', 'Tahta', 'Akhnas'],
    'Red Sea': ['Hurghada', 'Safaga', 'El-Quseir', 'Sharm El Sheikh'],
    Matrouh: ['Marsa Matrouh', 'El Alamein', 'Sidi Abdel Rahman'],
    'New Valley': ['Kharga', 'Dakhla', 'Paris'],
    'South Sinai': ['Sharm El Sheikh', 'Dahab', 'Nuweiba', 'Taba'],
    'North Sinai': ['El-Arish', 'Rafah', 'Sheikh Zuweid'],
  };

  @ViewChild('governorateSelect')
  governorateSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('citySelect') citySelect!: ElementRef<HTMLSelectElement>;

  ngAfterViewInit(): void {
    this.governorateSelect.nativeElement.addEventListener('change', () => {
      this.populateCities();
    });
  }

  populateCities(): void {
    const selectedGovernorate = this.governorateSelect.nativeElement.value;

    // Clear existing cities
    this.citySelect.nativeElement.innerHTML =
      '<option value="" disabled selected>Select City</option>';

    // Populate cities if a valid governorate is selected
    if (selectedGovernorate && this.citiesData[selectedGovernorate]) {
      this.citiesData[selectedGovernorate].forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        this.citySelect.nativeElement.appendChild(option);
      });
    }
  }

  constructor(
    public orderservice: OrdersService,
    public router: Router,
    public cartservice: CartApiService
  ) {}
  ngOnInit(): void {
      this.fetchCartItems();
  }
  order: Order = new Order(
    '', // firstname
    '', // lastname
    '', // mobile
    '', // customerid
    '', // addressdetails
    [], // items
    0, // total
    '', // payment
    '', // promoCode
    { governorate: '', city: '' } // shippingAddress
  );

  // get userid after decode token

  getUseridFromToken(): string | null {
    const token = sessionStorage.getItem('tokenkey');
    console.log(token);

    if (!token) {
      // if no token in session
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId; // Customize based on your JWT structure
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  // need to catch cart items from user by id i catch it from session

  fetchCartItems(): void {
    const userId = this.getUseridFromToken();
    if (!userId) {
      Swal.fire({
        title: 'Session Expired!',
        text: 'Please log in again.',
        icon: 'warning',
        showConfirmButton: true,
      }).then(()=>{
        setTimeout(()=>{
          this.router.navigateByUrl('/login');
        }, 2000)
      })

      return;
    }


    this.cartservice.getCartForUser(userId).subscribe({
      next: (cartData) => {
        console.log('Cart Data:', cartData); // Log the data returned by the service
        if (cartData && cartData.data && cartData.data.items) { // Check for cartItems instead of data.items
          this.order.items = cartData.data.items;
          console.log('Items fetched:', this.order.items); // Log the items to ensure they are assigned correctly
          this.order.totalAmount = this.calculateTotalAmount(this.order.items);
          console.log(this.order.totalAmount)
          console.log('Calculated Total Amount:', this.order.totalAmount); // Check the total after calculation
        }
        console.log(this.order.totalAmount)
        // console.log(cartData);
        // this.order.items = cartData.data.items;
        // console.log(cartData.items);
        // this.order.totalAmount = cartData.data.total;
        // console.log(cartData.total);
        // this.order.customerId = cartData.data.userId;

      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch cart items. Please try again later.',
          icon: 'error',
          showConfirmButton: true,
        });
      },
    });
  }

  orderError: any;
  submitOrder(): void {
    const userId = this.getUseridFromToken();
    console.log("userid: ",userId);
    if (!userId) {
      Swal.fire({
        title: 'Session Expired!',
        text: 'Please log in again.',
        icon: 'warning',
        showConfirmButton: true,
      });
      this.router.navigateByUrl('/login');
      return;
    }

    this.order.customerId = userId;
      // Ensure items are correctly fetched
      console.log('Items in order:', this.order.items);
      this.order.totalAmount = this.calculateTotalAmount(this.order.items);
      console.log('Total amount:', this.order.totalAmount); 

    if (this.checkoutForm.invalid) {
      this.checkoutForm.form.markAllAsTouched();
      Object.keys(this.checkoutForm.controls).forEach((field) => {
        const control = this.checkoutForm.controls[field];
        if (control.invalid) {
          console.log(`${field} is invalid:`, control.errors);
          this.orderError = `${field} is invalid`;
        }});
      Swal.fire({
        title: 'Your data is missing!',
        text: this.orderError,
        // text: 'Please correct the errors in the form before submitting.',
        icon: 'warning',
        showConfirmButton: true,
      });
      return;
    }

    
    // this.order.totalAmount = this.calculateTotalAmount(this.order.items);
    // console.log("total ",this.order.totalAmount);
  const orderData =  {
    items: this.order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    customerId: this.order.customerId,
    totalAmount: this.order.totalAmount,
    shippingAddress: {
      governorate: this.order.shippingAddress.governorate,
      city: this.order.shippingAddress.city,
    },
    addressdetails: this.order.addressdetails,
    firstname: this.order.firstname,
    lastname: this.order.lastname,
    paymentMethod: this.order.paymentMethod,
    paymentCode: this.order.paymentCode || '',
  };


    console.log(orderData);
    // error ==> wanna to map or bind data come from ui and getting it fro service [cartitems + total]
    this.orderservice.addOrder(orderData).subscribe({

      next: (response) => {
        Swal.fire({
          title: 'Order Placed!',
          text: 'Thank you for your order. Your order has been successfully submitted.',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });
        this.clearUserCart(orderData.customerId);
      },
      error: (error) => {
        Swal.fire({
          title: 'Order Failed!',
          text: `There was an error submitting your order: ${
            error.message || 'Please try again later.'
          }`,
          icon: 'error',
          showConfirmButton: true,
        });
        console.error('Error adding order:', error);
      },
    });
  }

  calculateTotalAmount(items: any[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // after saving data to do a order must to clear user cart

  clearUserCart(userId: string): void {
    this.cartservice.clearCart(userId).subscribe({
      next: () => {
        console.log('Cart cleared successfully');
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Failed to clear the cart:', error);
      },
    });
  }

  // wanna to get cartitems related to user will return data after get userid from token
  // to add this items to ui and add it to order to api to save it
  getCartItems(): any[] {
    return [];
  }
}

