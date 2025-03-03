export class ProductToAdmin {
  constructor(
    public _id: string,
    public name: string,
    public description: string,
    public price: number,
    public category: string,
    public previousprice: number,
    public stockOut: number,
    public stockIn: number,
    public flavor: string,
    public discounted: boolean,
    public categoryName: string,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date,
    public images: string[],
    public accentColor: string
  ) {}
}
