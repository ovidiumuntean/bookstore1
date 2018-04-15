import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any;
  book: Object;
  j: any;
  sortType: String;
  sortReverse: Boolean=true;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer
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
        if(data){
          this.books = data.books;
          for(var i=0; i < this.books.length; i++){
            this.setImgUrl(this.books[i]);
          }
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
      })
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


}
