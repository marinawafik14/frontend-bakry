export class Products {
  _id: string = '';
  name: string = '';
  sales: number = 0;
  description: string = '';
  price: number = 0;
  category: string = '';
  previousprice: number = 0;
  stock: number = 0;
  flavor: string = '';
  discounted: Boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  images: String[] = [];
  accentColor: String = '';
}
