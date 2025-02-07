export class User {
    constructor(
        public _id: string,
        public username: string,
        public email: string,
        public password: string,
        public role: string,
        public profile: Profile,
        public cartItems: CartItem[],
        public status: string,
        public orderIds: string[],
        public createdAt: Date,
        public updatedAt: Date,
        public products: any[]
    ) {}
}
export class Address {
    constructor(
        public street: string,
        public city: string,
        public governorate: string,
        public _id?: string // Optional field
    ) {}
}

export class Profile {
    constructor(
        public firstName: string,
        public lastName: string,
        public gender: string,
        public dateOfBirth: Date,
        public address: Address,
        public contactNo: string,
        public image: string
    ) {}
}

export class CartItem {
    constructor(
        public productId: string,
        public quantity: number,
        public price: number,
        public _id: string,
        public addedAt: Date
    ) {}
}

