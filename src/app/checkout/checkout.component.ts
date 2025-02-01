import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../models/order';
import { OrdersService } from '../services/order.service';
import { NgForm } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink, RouterOutlet],
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
export class CheckoutComponent implements AfterViewInit {
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
  constructor(public orderservice: OrdersService) {}
  order: Order = new Order('', '', '', '', '', '', '', '');

  // method submit to add a new order

  // need first to check if have a token in session or cookies or not if not having will reserveurl to login page 
  submitOrder(): void {
    this.orderservice.addOrder(this.order).subscribe(
      (response) => {
        console.log('Order added successfully:', response);
      },
      (error) => {
        console.error('Error adding order:', error);
      }
    );
  }


}
