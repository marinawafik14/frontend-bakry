export class OrderTo {
  
    orderStatus:string;
  public items: { productId: string; quantity: number; price: number }[]; // Item structure

  constructor(
    orderStatus:string,
   
    items: { productId: string; quantity: number; price: number }[],
   
  ) {
   
    this.items = items;
    this.orderStatus = orderStatus;
  
}}
