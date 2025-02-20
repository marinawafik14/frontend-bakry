export class register {
  public first_name?: string;
  public last_name?: string;
  public email?: string;
  public password?: string;
  public token?: string;

  constructor(
    first_name?: string,
    last_name?: string,
    email?: string,
    password?: string,
    token?: string
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.token = token;
  }
}
