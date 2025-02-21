export class Branch {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  clerks: string[];
  cashiers: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: string,
    name: string,
    location: { address: string; city: string; state: string; zipCode: string },
    clerks: string[],
    cashiers: string[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.name = name;
    this.location = location;
    this.clerks = clerks;
    this.cashiers = cashiers;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }
}
