export class Login {
    public email?:string;
    public password?:string;
    public token?:string;


    constructor(email:string , password:string , token:string) {
        this.email = email;
        this.password = password;
        this.token = token;


    }
}
