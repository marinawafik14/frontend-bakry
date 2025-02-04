export class Order {
  public firstname: string;
  public lastname: string;
  public mobile: string; // Assuming mobile is still required
  public governorate: string;
  public city: string;
  public addressdetails: string;
  public customerid:string;
  public payment: string;
  public promoCode: string; // Optional
  public total: string;
  public items: { productId: string; quantity: number; price: number }[]; // Item structure
  public shippingAddress: { governorate: string; city: string };


  constructor(
    firstname: string,
    lastname: string,
    mobile: string,
    governorate: string,
    city: string,
    customerid:string,
    addressdetails: string,
    items: { productId: string; quantity: number; price: number }[],
    total: string,
    payment: string,
    promoCode: string, // Optional
  
    shippingAddress: { governorate: string; city: string }
  ) {
    this.customerid = customerid
    this.firstname = firstname;
    this.lastname = lastname;
    this.mobile = mobile;
    this.governorate = governorate;
    this.city = city;
    this.addressdetails = addressdetails;
    this.items = items;
    this.total = total;
    this.payment = payment;
    this.promoCode = promoCode;
    this.shippingAddress = shippingAddress;
  }
}
