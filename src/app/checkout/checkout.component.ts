import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../models/order';
import { OrdersService } from '../services/order.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import { user } from '../../../model/user.model';
import { CartApiService } from '../_services/cart-api.service';
@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink , RouterOutlet, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})

//   const nameRegex = /^[a-zA-Z\s'-]{2,50}$/; // Allow only letters (no numbers)
//   const mobileRegex = /^\+?[1-9]\d{1,14}$/;
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// const firstname = document.getElementById('firstname') as HTMLInputElement;
// const lastname = document.getElementById('lastname') as HTMLInputElement;
// const email = document.getElementById('email') as HTMLInputElement;
// const phone = document.getElementById('phone') as HTMLInputElement;
// const address = document.getElementById('address') as HTMLInputElement;
// const governorate = document.getElementById('governorate') as HTMLInputElement;
// const city = document.getElementById('city') as HTMLInputElement;

//   const firstNameError = firstname.nextElementSibling;
//   const lastNameError = lastname.nextElementSibling;
//   const mobileNumberError = phone.nextElementSibling;
//   const emailError = email.nextElementSibling;
//   const addressError = address.nextElementSibling;
//   const governorateError = governorate.nextElementSibling;
//   const cityError = city.nextElementSibling;

//   const form = document.querySelector("form.needs-validation");
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
    '', // total
    '', // payment
    '', // promoCode
    { governorate: '', city: '' } // shippingAddress
  );

  // method submit to add a new order

  // need first to check if have a token in session or cookies or not if not having will reserveurl to login page
  // submitOrder(): void {
  //   this.orderservice.addOrder(this.order).subscribe(
  //     (response) => {
  //       console.log('Order added successfully:', response);
  //       this.router.navigateByUrl('/home');
  //     },
  //     (error) => {
  //       console.error('Error adding order:', error);
  //     }
  //   );

  // }

  /*
{
  "items": [
    {
      "productId": "64f39c55c1d7b9a2c8e91234",
      "quantity": 2,
      "price": 199.99
    },
    {
      "productId": "64f39c55c1d7b9a2c8e94567",
      "quantity": 1,
      "price": 499.50
    }
  ],
  "customerId": "64f39c55c1d7b9a2c8e97678",
  "totalAmount": 899.48,
  "shippingAddress": {
    "governorate": "Cairo",
    "city": "Nasr City"
  },
  "addressdetails":"32 alma3mora street",
  "firstname":"omar ",
  "lastname":"reda",
  "paymentMethod": "Credit Card",
  "paymentCode": "CC12345678"
}

need to catch items from cart from user to push it to items to a new order
but first wanna to catch token then decode it


*/
  // catch token from session
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
        console.log(cartData);
        this.order.items = cartData.data.items;
        console.log(cartData.items);
        this.order.totalAmount = cartData.data.total;
        console.log(cartData.total);
        this.order.customerId = cartData.data.userId;

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

  // after click to this button will print token ot userid
  // show() {
  //   const token = sessionStorage.getItem('tokenkey');
  //   console.log(token); // return token true
  //   // error in decode token
  //   if (token) {
  //     const decodedToken: any = jwtDecode(token);
  //     console.log(decodedToken.userid); // print userid after decode
  //     const userid = this.getUseridFromToken();
  //     if(userid)
  //     console.log(this.cartservice.getCartForUser(userid));  // will return cartitems with total of items
  //     //  console.log(this.cartservice.getCartForUser(this.getUseridFromToken()))
  //   }
  //   return null;
  //   // const decodedToken: any =  jwtDecode(token);
  // }

  submitOrder(): void {
    const userId = this.getUseridFromToken();
    console.log(userId);
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

    if (this.checkoutForm.invalid) {
      this.checkoutForm.form.markAllAsTouched();
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please correct the errors in the form before submitting.',
        icon: 'warning',
        showConfirmButton: true,
      });
      return;
    }

    // const orderData = {
    //   items: this.order.items.map((item) => ({
    //     productId: item.productId,
    //     quantity: item.quantity,
    //     price: item.price,
    //   })),
    //   customerId: userId,
    //   totalAmount: this.order.total, // Use totalAmount instead of total
    //   shippingAddress: {
    //     governorate: this.order.governorate,
    //     city: this.order.city,
    //   },
    //   addressdetails: this.order.addressdetails,
    //   firstname: this.order.firstname,
    //   lastname: this.order.lastname,
    //   paymentMethod: this.order.payment, // Use paymentMethod instead of payment
    //   paymentCode: this.order.paymentCode,
    //   mobile: this.order.mobile,
    //   promoCode: this.order.promoCode || '', // Include promoCode if available
    // };

    // const orderData = new Order(
    //   this.order.customerid,
    //   this.order.firstname,
    //   this.order.lastname,
    //   this.order.mobile,
    //   this.order.governorate,
    //   this.order.city,
    //   this.order.addressdetails,
    //   this.order.items.map((item) => ({
    //     productId: item.productId,
    //     quantity: item.quantity,
    //     price: item.price,
    //   })),
    //   this.order.total,
    //   this.order.payment,
    //   this.order.promoCode || '',
    //   {
    //     governorate: this.order.governorate,
    //     city: this.order.city,
    //   }
    // );

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

