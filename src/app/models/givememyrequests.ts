export class givememyrequests {
  id: number;
  status: string;
  responseMessage?: string;
  requestedBy: string;
  dateRequested: string;
  items: { productId: number; quantity: number }[];

  constructor(
    id: number,
    status: string,
    requestedBy: string,
    dateRequested: string,
    items: { productId: number; quantity: number }[],
    responseMessage?: string
  ) {
    this.id = id;
    this.status = status;
    this.requestedBy = requestedBy;
    this.dateRequested = dateRequested;
    this.items = items;
    this.responseMessage = responseMessage;
  }
}
