import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  public basket: any=this.createBasket();
  constructor() { }

  createBasket(){
    var basketModule = (function () {

      // privates

      var basket = [];

      function addItem(book) {
        basket.push(book);
      }

      function removeItem(book) {
        var indexOfBook = basket.indexOf(book);
        basket.splice(indexOfBook, 1);
      }

      function getItemCount() {
        return basket.length;
      }

      function getTotalPrice() {
        var q = this.getItemCount(),
          p = 0;

        while (q--) {
          p += basket[q].price;
        }

        return p;
      }

      // Return an object exposed to the public
      return {

        // Add items to our basket
        addItem: addItem,

        //Remove an item from the basket
        removeItem: removeItem,

        // Get the count of items in the basket
        getItemCount: getItemCount,

        // Get the total value of items in the basket
        getTotalPrice: getTotalPrice
      };
    })();

    return basketModule;
  }

  getBasket(){
    return this.basket;
  }

  validateRegister(user) {
    console.log(user);
    if(user.first_name == undefined || user.email == undefined || user.last_name == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateLogin(user){
    if(user.email == undefined || user.password == undefined){
      return false;
    } else {
      return true;
    }
  }

  // check if an object is empty ( true = empty, and false = not empty)
   isEmpty(obj) {
    for ( var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }// end isEmpty

  validateObj(obj){
    for ( var key in obj) {
      if(obj[key] === undefined){
        return false;
      }
    }
    return true;
  }

}
