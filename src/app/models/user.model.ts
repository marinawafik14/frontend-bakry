export class user {
  public firstname?: string;
  public lastname?: string;
  public email?: string;
  public password?: string;
  public role?: string
  constructor(
    firstname?: string,
    lastname?: string,
    email?: string,
    password?: string,
   role?: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.role =role;
  }
}
