
// export class address {
//   constructor( public city?: string, public governorate?: string) {
//     this.city = city;
//     this.governorate = governorate;
//   }
// }

// export class Profile {
//   constructor(public firstName?: string, public lastName?: string, public gender?:string, public dateOfBirth?: Date | string, public address?: address, public mobile?: string) {
// }
// }
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  address: {
    city: string;
    governorate: string;
  };
  contactNo: string;
  currentPassword?: string; // Optional fields for password updates
  newPassword?: string;
}
