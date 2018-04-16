import { Injectable } from '@angular/core';

@Injectable()
export class BasketService {

  public basket:any;

  constructor() { }

  createBasket(){
    function definePrototype ( obj, key, value ){
      var config = {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
      };
      Object.defineProperty( obj, key, config );
    };

    function LineItem(book) {
      this.bookId = book.id;
      this.quantity = book.quantity;
      this.sale_price = book.price;
    };

    var basketModule = (function () {
      // privates

      var instance;
      function init() {
        var basket = [];

        function addItem(book, quantity) {
          var index = checkForBook(book);
          if (index !== -1) {
            var stock = basket[index].qty_in_stock - basket[index].quantity;
            if (stock > quantity) {
              basket[index].quantity += quantity;
              return {success: true, msg: 'Item ' + book.title + ' added to the basket!'};
            } else {
              return {false: true, msg: 'Only ' + stock + ' books are in stock left to be added to basket!'};
            }
          } else {
            if(book.qty_in_stock > quantity) {
              definePrototype(book, 'quantity', quantity);
              basket.push(book);
              return {success: true, msg: 'Item ' + book.title + ' added to the basket!'};
            } else{
              return {false: true, msg: 'Only ' + book.qty_in_stock + ' books are in stock left to be added to basket!'};
            }
          }
        }

        function getLineItems() {
          if (basket.length > 0) {
            var lineItems = [];
            for (var i = 0; i < basket.length; i++) {
              lineItems.push(new LineItem(basket[i]));
            }
            return lineItems;
          } else {
            return null;
          }
        }

        function checkForBook(book) {
          for (var i = 0; i < basket.length; i++) {
            if (book.id === basket[i].id) {
              return i;
            }
          }
          return -1;
        }

        function removeItem(book) {
          var indexOfBook = checkForBook(book);
          if (indexOfBook === -1) {
            return {false: true, msg: ' Book not found in the basket!'};
          } else {
            var bookTitle = basket[indexOfBook].title;
            basket.splice(indexOfBook, 1);
            return {success: true, msg: 'Item ' + bookTitle + ' removed from the basket successfully!'};
          }
        }

        function getItemCount() {
          return basket.length;
        }

        function getItems() {
          return basket;
        }

        function clearBasket() {
          basket = [];
          if (basket.length > 0) {
            return {false: true, msg: ' An error occurred when placing the order!'};
          } else {
            return {success: true, msg: ' Order placed successfully!'};
          }

        }

        function getTotalPrice() {
          var q = this.getItemCount(),
            p = 0;

          while (q--) {
            p += (basket[q].price * basket[q].quantity);
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
          getTotalPrice: getTotalPrice,

          //Get Items in the basket
          getItems: getItems,

          //Get Line Items
          getLineItems: getLineItems,

          //Clear Basket
          clearBasket: clearBasket
        };
      }
      return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {

          if ( !instance ) {
            instance = init();
          }

          return instance;
        }
      };
    })();

    this.basket = basketModule.getInstance();
  }

  getLineItem(){
    function LineItem(book) {
      this.bookId = book.id;
      this.quantity = book.quantity;
      this.sale_price = book.price;
    }
    return LineItem;
  }


  getBasket(){
    if(this.basket){
      return this.basket;
    } else {
      this.createBasket();
      return this.basket;
    }
  }


}
