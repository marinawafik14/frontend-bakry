export class Order {
  public firstname: string;
  public lastname: string;
  public mobile: string;
  public governorate: string;
  public city: string;
  public addressdetails: string;
  public payment: string;
  public promoCode: string;

  constructor(
    firstname: string,
    lastname: string,
    mobile: string,
    governorate: string,
    city: string,
    addressdetails: string,

    payment: string,
    promoCode: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.mobile = mobile;
    this.governorate = governorate;
    this.city = city;
    this.addressdetails = addressdetails;
    this.payment = payment;
    this.promoCode = promoCode;
  }
}
