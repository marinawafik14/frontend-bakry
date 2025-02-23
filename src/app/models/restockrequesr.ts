export class RestockRequest {
  _id: string;
  branchId: string;
  branchName?: string; 
  productId: string;
  productName?: string; 
  quantity: number;
  status: string;
  responsemessage:string;
;
  constructor(data: any) {
    this._id = data._id;
    this.branchId = data.branchId?._id || data.branchId;
    this.branchName = data.branchId?.name || ''; 
    this.productId = data.productId?._id || data.productId;
    this.productName = data.productId?.name || ''; 
    this.quantity = data.quantity;
    this.status = data.Status;
    this.responsemessage = data.responsemessage;
  }
}
