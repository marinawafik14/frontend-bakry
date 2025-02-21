export class BranchInventory {
  branchId: string;
  capacity: number;
  products: ProductInBranch[];

  constructor(data: Partial<BranchInventory>) {
    this.branchId = data.branchId ?? '';
    this.capacity = data.capacity ?? 0;
    this.products = (data.products ?? []).map((p) => new ProductInBranch(p));
  }
}

export class ProductInBranch {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockIn: number;
  stockOut: number;
  sales: number;
  stock: number;
  status: string;
  createdAt: Date;
  capacity: number;
  currentStock: number;

  constructor(data: Partial<ProductInBranch>) {
    this._id = data._id ?? '';
    this.name = data.name ?? 'Unknown Product';
    this.description = data.description ?? '';
    this.price = data.price ?? 0;
    this.stockIn = data.stockIn ?? 0;
    this.stockOut = data.stockOut ?? 0;
    this.sales = data.sales ?? 0;
    this.stock = data.stock ?? 0;
    this.status = data.status ?? 'Unavailable';
    this.createdAt = new Date(data.createdAt ?? '');
    this.capacity = data.capacity ?? 0;
    this.currentStock = data.currentStock ?? 0;
  }
}
