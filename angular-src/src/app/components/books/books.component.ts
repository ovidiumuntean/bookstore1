import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {DomSanitizer} from '@angular/platform-browser';
import { ValidateService } from '../../services/validate.service';
import { BasketService } from '../../services/basket.service';
import { Router, NavigationExtras } from '@angular/router';
 // import {basketModule} from '../../models/basket.js';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any;
  book: Object;
  sortType: String;
  sortReverse: Boolean=true;
  category: string;
  searchValue: String;
  quantity: string;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private router: Router,
    private validateService: ValidateService,
    public basketService: BasketService
  ) { }

  ngOnInit(){
    this.getBooks();
  }

  onChange(): void {
    this.cdr.detectChanges();
  }

  dynamicSort(property) {
    var sortOrder = 1;
    // if(!this.sortReverse) {
    //   sortOrder = -1;
    //   property = property.substr(1);
    // }
    return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  onSortTable(sortType){
    this.sortType = sortType;
    if(this.sortReverse) {
      this.books.sort(this.dynamicSort(this.sortType));
    } else {
      this.books.sort(this.dynamicSort(this.sortType));
      this.books.reverse(this.dynamicSort(this.sortType));
    }
    this.sortReverse = !this.sortReverse;
  }

  getBooks(){
    this.authService.getBooks().subscribe(data => {
        if(data.success){
          this.books = data.books;
          for(var i=0; i < this.books.length; i++){
            this.setImgUrl(this.books[i]);
          }
        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
      },
      err => {
        console.log(err);
        return false;
      });
  }

  getImageUrl(i){
      if (this.books[i].image) {
        // var file = new Blob([this.books[i].image], {
        //   type: 'image/jpeg'
        // });
        const buffer = btoa(this.books[i].image.data);
        const file = new Blob([new Uint8Array(this.books[i].image.data)], { type: "image/jpg" });
        var urlCreator = window.URL || (window as any).webkitURL;
        var objurl = urlCreator.createObjectURL(file);
        console.log(file);
        return objurl;
      }
  }

  setImgUrl(b){
    if (b.image) {
      // var file = new Blob([this.books[i].image], {
      //   type: 'image/jpeg'
      // });
      const file = new Blob([new Uint8Array(b.image.data)], { type: "image/jpg" });
      var urlCreator = window.URL || (window as any).webkitURL;
      var objurl = urlCreator.createObjectURL(file);
      b.image = objurl;
    }
  }

  setImage(event){
    if (this.books[0].image) {
      // var file = new Blob([this.books[i].image], {
      //   type: 'image/jpeg'
      // });
      const buffer = btoa(this.books[0].image.data);
      const file = new Blob([new Uint8Array(this.books[0].image.data)], { type: "image/jpg" });
      var urlCreator = window.URL || (window as any).webkitURL;
      var objurl = urlCreator.createObjectURL(file);
      console.log(file);
      event.target.src = this.books[0].image;
    }
  }

  deleteBook(i){
    if(this.authService.adminLoggedIn()){
      this.authService.deleteBook(this.books[i].id).subscribe(data => {
        if (data.success) {
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.getBooks();

        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});

        }
      });
    }
  }

   _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  onSearch(){
    var cat = "";
    var newObject = new Object();

    var defineProp = function ( obj, key, value ){
      var config = {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
      };
      Object.defineProperty( obj, key, config );
    };
    var search = Object.create(Object.prototype);
    defineProp(search, this.category, this.category);
    defineProp(search, 'searchValue', this.searchValue);
    console.log(search);

    if(this.validateService.validateObj(search) || this.validateService.isEmpty(search)) {
      this.authService.searchBook(search).subscribe(data => {
        if (data.success) {
          this.books = data.books;
          for (var i = 0; i < this.books.length; i++) {
            this.setImgUrl(this.books[i]);
          }
        } else {
          this.getBooks();
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
      });
    } else {
      this.flashMessage.show("Please provide values for search operation!", {cssClass: 'alert-danger', timeout: 3000});
    }
  }

  addToBasket(i){
    var basketModule = this.basketService.getBasket();
    var message = basketModule.addItem(this.books[i], parseInt(this.quantity));
    if(message.success){
      this.flashMessage.show(message.msg, {cssClass: 'alert-success', timeout: 3000});
    } else {
      this.flashMessage.show(message.msg, {cssClass: 'alert-danger', timeout: 3000});
    }
    console.log(basketModule.getTotalPrice());
  }

  onViewBook(i){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "bookId": this.books[i].id.toString()
      }
    };
    this.router.navigate(['/book'], navigationExtras);
  }

}
