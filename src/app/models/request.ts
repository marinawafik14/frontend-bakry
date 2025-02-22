export class Request {
    branchId: string;
    productId: string;
    quantity: number;

    constructor(branchId: string, productId: string, quantity: number) {
        this.branchId = branchId;
        this.productId = productId;
        this.quantity = quantity;
    }
}