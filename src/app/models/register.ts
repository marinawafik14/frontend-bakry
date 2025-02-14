export class register {
  [x: string]: any;
  public firstname?: string;
  public lastname?: string;
  public email?: string;
  public password?: string;
  public token?:string;

  constructor(
    firstname?: string,
    lastname?: string,
    email?: string,
    password?: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }
}
