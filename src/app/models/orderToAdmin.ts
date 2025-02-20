export class CustomerName {
  firstname: string;
  lastname: string;

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

export class orderToAdmin {
  public _id: string;
  public firstname: string;
  public lastname: string;
  public customername: CustomerName;
  public addressdetails: string;
  public orderStatus: string;
  public totalAmount: string;

  constructor(
    _id: string,
    firstname: string,
    lastname: string,
    customername: CustomerName,
    orderStatus: string,
    addressdetails: string,
    totalAmount: string
  ) {
    this._id = _id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.customername = customername;
    this.orderStatus = orderStatus;
    this.addressdetails = addressdetails;
    this.totalAmount = totalAmount;
  }
}
