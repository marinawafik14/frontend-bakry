import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
islogin:boolean =true;

// function login
login(email:string , password:string){
  this.islogin = true;
 console.log("login done")

}
//function logout
logout(){
  this.islogin=false;
  console.log("logout done")
}
//function register
register(username:string, password:string,email:string){
  console.log("registered done");
  this.islogin = true;

}


  constructor() { }



}
