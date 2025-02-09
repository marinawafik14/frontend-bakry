export class productToAdmin {
  _id?: string; // Optional for newly created products
  name: string;
  price: number;
  category?: string;
  sales?: number;
  stock: number;
  flavor?: string;
  discounted?: boolean;
  createdAt?: Date;

  constructor(
    _id:string,
    name: string,
    price: number,
    stock: number,
    category?: string,
    sales?: number,
    flavor?: string,
    discounted?: boolean,
    createdAt?: Date,
  ) {
    this._id = _id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.sales = sales;
    this.flavor = flavor;
    this.discounted = discounted;
    this.createdAt = createdAt;
  }
}
