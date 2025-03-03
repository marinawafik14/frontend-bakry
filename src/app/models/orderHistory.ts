
// export class Order {
//   _id: string;
//   items: {
// price: string|number; productId: any; quantity: number
// }[];
//   totalAmount: number;
//   orderStatus: string;
//   createdAt: string;

//   constructor(data: Partial<Order>) {
//     this._id = data._id || '';
//     this.items = data.items || [];
//     this.totalAmount = data.totalAmount || 0;
//     this.orderStatus = data.orderStatus || 'Pending';
//     this.createdAt = data.createdAt || new Date().toISOString();
//   }
// }
export interface Order {
  _id: string;
  items: {
    productId: {
      _id: string;
      name: string;
      price: number;
    };

    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}
