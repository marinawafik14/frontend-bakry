
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
islogin:boolean =false;

// function login
login(email:string , password:string){
  this.islogin = true;
console.log("login done")

}
//function logout
logout(){
localStorage.removeItem('token');
  this.islogin=false;
  console.log("logout done")
}

//function register
register(username:string, password:string,email:string){
  console.log("registered done");
  this.islogin = true;

}






}




// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AccountService {
// // <<<<<<< HEAD

// // islogin:boolean =false;
// // constructor(private http:HttpClient){}
// // // function login
// // login(email: string, password: string) {
// //   this.http.post<{ token: string }>("http://localhost:8000/auth/login", {
// //     email,
// //     password,
// //   }).subscribe((response) => {
// //     const token = response.token; // Get token from API
// //     localStorage.setItem('token', token);
// //     this.islogin = true;
// //     console.log("Login successful");
// //   },
// //   (error) => {
// //     console.error('Login failed', error);
// //   });
// // =======
// islogin:boolean =false;

// // function login
// login(email:string , password:string){
//   this.islogin = true;
// console.log("login done")

// }
// //function logout
// logout(){
// localStorage.removeItem('token');
//   this.islogin=false;
//   console.log("logout done")
// }

// //function register
// register(username:string, password:string,email:string){
//   console.log("registered done");
//   this.islogin = true;

// }






// }
