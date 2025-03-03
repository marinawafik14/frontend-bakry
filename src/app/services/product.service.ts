
// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private topPro_url: string = 'http://localhost:8000/top-products'; //top product
//   private createpro_url = 'http://localhost:8000/products'; // Your backend API for create product
//   private allProduct_url = 'http://localhost:8000/allproducts';
//   private delete_url = 'http://localhost:8000/products'; // get all products
//   //  // get all products
//   private URLCategory = 'http://localhost:8000/category'; //api category
//   constructor(private http: HttpClient) {}

//   // function get top products

//   getProducts(): Observable<Products[]> {
//     return this.http.get<Products[]>(this.topPro_url);
//   }
//   getAllProducts(): Observable<Products[]> {
//     return this.http.get<Products[]>(this.allProduct_url);
//   }
//   getAllProductsToadmin(): Observable<productToAdmin[]> {
//     return this.http.get<productToAdmin[]>(this.allProduct_url);
//   }

//   getProductsByCategory(categoryName: string): Observable<any> {
//     return this.http.get(`http://localhost:8000/products?category=${categoryName}`);
//   }

//   getProductById(id: string): Observable<any> {
//     return this.http.get(`${this.allProduct_url}/${id}`);
//   }

//   Deleteproductbyid(id: string): Observable<any> {
//     return this.http.get(`${this.delete_url}/${id}`);
//   }

//   getCategories(): Observable<Array<{ _id: string; name: string }>> {
//     return this.http.get<Array<{ _id: string; name: string }>>(
//       this.URLCategory
//     );
//   }

//   // createProduct(std:Products):Observable<Products>{
//   //   return this.http.post<Products>(this.apiUrl, std)
//   // }



//   createProduct(formData: FormData) {
//     const token = sessionStorage.getItem('tokenkey');
//     if (!token) {
//       throw new Error("Unauthorized: No token found");
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.post(this.createpro_url, formData, { headers });
//   }


//   checkBranchCapacity(branchName: string, quantity: number): Observable<any> {
//     return this.http.post<any>(`http://localhost:8000/check-branch-capacity`, { branch: branchName, quantity: quantity });
//   }

// }


// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';
import { ProductToAdmin } from '../models/productToAdmin';
import { ProductMainToAdmin } from '../models/productsmaintoadmin';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private topPro_url: string = 'http://localhost:8000/top-products'; //top product
  private createpro_url = 'http://localhost:8000/products'; // Your backend API for create product
  private allProduct_url = 'http://localhost:8000/api/inventory/all';
  private allinventoryProduct_url = 'http://localhost:8000/api/inventory/allfinal';
  private allall = 'http://localhost:8000/allproducts';
  // private allProduct_url = 'http://localhost:8000/allproducts';

  //  private allProduct_url = 'http://localhost:8000/allproducts';
  private delete_url = 'http://localhost:8000/products'; // get all products
  //  // get all products
  private URLCategory = 'http://localhost:8000/category'; //api category
  constructor(private http: HttpClient) {}

  // function get top products
  // return all data from main inventory

  changeproductStatus(_id: string, status: string): Observable<ProductToAdmin> {
    const url = `http://localhost:8000/product/changeproductstatus/${_id}`;
    return this.http.patch<ProductToAdmin>(url, { status: status });
  }

  // getallproduct in product schema
  getallallproducts(): Observable<ProductToAdmin[]> {
    return this.http.get<ProductToAdmin[]>(this.allall);
  }

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.topPro_url);
  }
  // return all data from main inventory
  getAllProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.allProduct_url);
  }

  //get all products from main inventory
  getAllProductsToadmin(): Observable<ProductToAdmin[]> {
    return this.http.get<ProductToAdmin[]>(this.allProduct_url);
  }
  // get all products from main inventory
  getAllProductsToMaininventory(): Observable<ProductMainToAdmin[]> {
    return this.http.get<ProductMainToAdmin[]>(this.allinventoryProduct_url);
  }

  // getAllProductsToadminFinal(): Observable<ProductToAdmin[]> {
  //   return this.http.get<ProductToAdmin[]>(this.allProduct_url);
  // }

  getProductsByCategory(categoryName: string): Observable<any> {
    return this.http.get(
      `http://localhost:8000/products?category=${categoryName}`
    );
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.createpro_url}/${id}`);
  }

  Deleteproductbyid(id: string): Observable<any> {
    return this.http.get(`${this.delete_url}/${id}`);
  }

  getCategories(): Observable<Array<{ _id: string; name: string }>> {
    return this.http.get<Array<{ _id: string; name: string }>>(
      this.URLCategory
    );
  }

  createProduct(formData: FormData) {
    const token = sessionStorage.getItem('tokenkey');
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.createpro_url, formData, { headers });
  }

  checkBranchCapacity(branchName: string, quantity: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/check-branch-capacity`, {
      branch: branchName,
      quantity: quantity,
    });
  }

  //---------------------------------------------------
  // In order.service.ts (or a dedicated cashier.service.ts)
  getBranchProducts(cashierId: string, category: string): Observable<any> {
    const params = new HttpParams().set('category', category);
    return this.http.get<any>(
      `http://localhost:8000/cashier/${cashierId}/products`,
      { params }
    );
  }

  getCashierOrders(cashierId: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8000/cashier/${cashierId}/orders`
    );
  }

  getInventoryByProduct(productId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/inventory/${productId}`);
  }

  getMainInventoryByCategory(category: string): Observable<any> {
    const params = new HttpParams().set('category', category);
    return this.http.get<any>(`http://localhost:8000/inventory`, { params });
  }
}
