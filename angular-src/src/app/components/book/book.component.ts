import {Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from '@angular/platform-browser';
import {ValidateService} from "../../services/validate.service";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  bookId: string;
  book: object;
  qty_in_stock: string;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookId = params["bookId"];
      this.getBookById();
    });
  }

  onChange(): void {
    this.cdr.detectChanges();
  }

  getBookById() {
    if (this.bookId) {
      this.authService.getBookById(this.bookId).subscribe(data => {
          if (data.success) {
            this.book = data.book;
            if(this.book) {
              this.setImgUrl(this.book);
            }
            console.log(this.book);
          } else {
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
          }
        },
        err => {
          console.log(err);
          return false;
        });
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

  onUpdateStock(){
    var Book = function (bookId, newQuantity) {
      this.bookId = bookId;
      this.newQuantity = newQuantity;
    };
    const bookUpdate = new Book(this.bookId, this.qty_in_stock);
    this.authService.updateStock(bookUpdate).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 5000});
        this.getBookById();
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
      }
    });
  }


}
