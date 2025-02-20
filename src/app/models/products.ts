export class Products {
  constructor(
    public _id: string,
    public name:string,
    public description:string,
    public price:number,
    public category:string,
    public previousprice:number,
    public sales:number,
    public stock:number,
    public status:string,
    public flavor:string,
    public discounted:boolean,
    public categoryid:string | { _id: string; name: string },
    public sellerId: string | { _id: string; profile?: { firstName?: string; lastName?: string } },
    public createdAt:Date,
    public updatedAt:Date,
    public images:string[],
    public accentColor:string,
    public branch:string[]
){}
}
