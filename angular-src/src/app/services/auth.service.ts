import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

// import { Http, Response } from "@angular/http";
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  admin: any;

  constructor(protected http: Http) { }

  checkLocalStorage(){
    try {
      if(localStorage.getItem('user')) {
        this.user = localStorage.getItem('user');
      } else if (localStorage.getItem('admin')){
        this.admin = localStorage.getItem('admin');
      }
      this.authToken = localStorage.getItem('id_token');
    } catch (e) {
      this.logout();
    }
  }

  registerUser(user) {
    const headers = new Headers();
    const options = new RequestOptions({ headers: headers });

    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/customer/register', user, options)
      .map(res => res.json());
  }

  authenticateUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/customer/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    this.checkLocalStorage();
    if (this.user) {
      console.log('Token not expired!');
      return tokenNotExpired('id_token');
    } else {
      return false;
    }
  }

  logout() {
    this.authToken = null;
    this.user = null;
    this.admin = null;
    localStorage.clear();
  }

  getProfile() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/customer/profile', {headers: headers})
      .map(res => res.json());
  }

  // ********************************     Admin methods ****************************************
  authenticateAdmin(admin) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/admin/authenticate', admin, {headers: headers})
      .map(res => res.json());
  }

  storeAdminData(token, admin) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    this.authToken = token;
    this.admin = admin;
  }

  adminLoggedIn() {
    if (this.admin) {
      console.log('Token not expired!');
      return tokenNotExpired('id_token');
    } else {
      return false;
    }
  }

  // ********************************   BOOK METHODS    ********************************************
  addBook(formData) {
    if (this.adminLoggedIn()) {
      const headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      return this.http.post('http://localhost:3000/book/add', formData, {headers: headers})
        .map(res => res.json());
    }
  }

  getBooks(){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.get('http://localhost:3000/book/get_books', {headers: headers})
      .map(res => res.json());
  }

  deleteBook(bookId){
    if (this.adminLoggedIn()) {
      const headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      const options = new RequestOptions({
        headers: headers,
        body: {bookId: bookId}
      });
      return this.http.delete('http://localhost:3000/book/delete', options)
        .map(res => res.json());
    }
  }

  getBookById(bookId){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    const options = new RequestOptions({
      headers: headers,
      params: {bookId: bookId}
    });
    return this.http.get('http://localhost:3000/book/bookById', options)
      .map(res => res.json());
  }

  searchBook(searchValues){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    const options = new RequestOptions({
      headers: headers,
      params: searchValues
    });
    return this.http.get('http://localhost:3000/book/search', options)
      .map(res => res.json());
  }

  placeOrder(lineItems){
    if (this.adminLoggedIn()) {
      const headers = new Headers();
      this.loadToken();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authToken);
      return this.http.post('http://localhost:3000/book/placeOrder', lineItems, {headers: headers})
        .map(res => res.json());
    }
  }

  updateStock(book){
    if (this.adminLoggedIn()) {
      const headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      return this.http.post('http://localhost:3000/book/updateStock', book, {headers: headers})
        .map(res => res.json());
    }
  }
}
