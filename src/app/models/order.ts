export class Order {
  public firstname: string;
  public lastname: string;
  public mobile: string; // Assuming mobile is still required
  public addressdetails: string;
  public customerId: string;
  public paymentMethod: string; // Renamed from payment
  public paymentCode: string; // Renamed from promoCode
  public totalAmount: number; // Renamed from total
  public items: { productId: string; quantity: number; price: number }[]; // Item structure
  public shippingAddress: { governorate: string; city: string };

  constructor(
    firstname: string,
    lastname: string,
    mobile: string,
    customerId: string,
    addressdetails: string,
    items: { productId: string; quantity: number; price: number }[],
    totalAmount: number, // Renamed from total
    paymentMethod: string, // Renamed from payment
    paymentCode: string, // Renamed from promoCode
    shippingAddress: { governorate: string; city: string }
  ) {
    this.customerId = customerId;
    this.firstname = firstname;
    this.lastname = lastname;
    this.mobile = mobile;
    this.addressdetails = addressdetails;
    this.items = items;
    this.totalAmount = totalAmount;
    this.paymentMethod = paymentMethod;
    this.paymentCode = paymentCode;
    this.shippingAddress = shippingAddress;
  }
}

