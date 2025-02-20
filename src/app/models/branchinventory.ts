export class branchInventory {
    constructor(
      public _id: string,
      public branchId:string,
      public productId:string,
      public stockIn:number,
      public stockOut:number,
      public price:number,
      public clerk:string,
      public cashier:string,
      public capacity:number,
      public currentStock:number,
  ){}
}