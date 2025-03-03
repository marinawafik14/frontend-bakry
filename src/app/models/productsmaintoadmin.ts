export interface ProductMainToAdmin {
  _id: string;
  name: string;
  price: number;
  stockOut: number;
  stockIn: number;
  flavor: string;
  createdAt: string;
  productId: {
    _id:string;
    name: string;
    flavor: string;
    createdAt: string;
  };
  status: string;
}
