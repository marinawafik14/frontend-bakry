
export class Seller {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public phone: string,
    public address: string,
    public storeName: string,
    public products: string[],
    public totalSales: number,
    public totalProfits: number,
    public totalProducts: number,
    public pendingOrders: number,
    public latestOrders: any[],
    public customers: number,
    public topProducts: { name: string; sales: number }[],
    public rating: number,
    public createdAt: string,
    public updatedAt: string
  ) {}

  // Example: Add a method to calculate profit margin
  get profitMargin(): number {
    return this.totalSales === 0 ? 0 : (this.totalProfits / this.totalSales) * 100;
  }
}
