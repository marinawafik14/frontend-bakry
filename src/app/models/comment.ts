export class Comment {
  _id?:string;
  userId: string;
  email: string;
  message: string;
createdAt: Date;

  constructor(userId: string, email: string, message: string,createdAt:Date, _id?:string) {
    this.userId = userId;
    this.email = email;
    this.message = message;
    this.createdAt = createdAt;
    if (_id) this._id = _id;
  }


}
