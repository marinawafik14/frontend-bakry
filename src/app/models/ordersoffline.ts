export class orderoffline {
  _id: string;
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  address: string;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Vodafone Cash' | 'cash';
  paymentCode?: string;
  orderStatus: 'delivered' | 'canceled';
  cashier: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: string,
    items: { productId: string; quantity: number; price: number }[],
    totalAmount: number,
    address: string,
    paymentMethod: 'Credit Card' | 'PayPal' | 'Vodafone Cash' | 'cash',
    orderStatus: 'delivered' | 'canceled',
    cashier: string,
    createdAt: Date,
    updatedAt: Date,
    paymentCode?: string
  ) {
    this._id = _id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.address = address;
    this.paymentMethod = paymentMethod;
    this.orderStatus = orderStatus;
    this.cashier = cashier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.paymentCode = paymentCode;
  }
}
