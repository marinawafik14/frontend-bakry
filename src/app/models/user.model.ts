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

export class address {
  constructor( public city?: string, public governorate?: string) {
    this.city = city;
    this.governorate = governorate;
  }
}

export class Profile {
  constructor(public firstName?: string, public lastName?: string, public gender?:string, public dateOfBirth?: Date | string, public address?: address, public mobile?: string) {
}
}
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  contactNo: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
