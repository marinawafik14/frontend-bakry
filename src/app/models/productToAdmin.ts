export class ProductToAdmin {
  constructor(
    public _id: string,
    public name: string,
    public description: string,
    public price: number,
    public category: string,
    public previousprice: number,
    public sales: number,
    public stock: number,
    public flavor: string,
    public discounted: boolean,
    public categoryid: number,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date,
    public images: string[],
    public accentColor: string
  ) {}
}
