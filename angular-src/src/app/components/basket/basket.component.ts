import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BasketService} from "../../services/basket.service";
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {DomSanitizer} from '@angular/platform-browser';
import {ValidateService} from "../../services/validate.service";
@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  books: any;
  book: Object;
  sortType: String;
  sortReverse: Boolean=true;
  category: string;
  searchValue: String;
  quantity: number;
  payment: string;
  totalCost: number;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    public sanitizer: DomSanitizer,
    public basketService: BasketService
  ) { }

  ngOnInit() {
    this.setBasketItems();
  }

  setBasketItems(){
    this.books = this.basketService.getBasket().getItems();
    if(this.books.length > 0){
      this.totalCost = this.basketService.getBasket().getTotalPrice();
    }
  }

  onPlaceOrder(){
    function LineItems(items, payment) {
      this.items = items;
      this.paymentType = payment;
    };

    var lineItems = new LineItems(this.basketService.getBasket().getLineItems(), this.payment);
    if(lineItems.items !== null) {
      this.authService.placeOrder(lineItems).subscribe(data => {
        if(data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.basketService.getBasket().clearBasket();
          this.setBasketItems();
        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
      });
    } else {
      this.flashMessage.show(" Basket is empty!", {cssClass: 'alert-danger', timeout: 3000});
    }
  }

  onDeleteBook(i){
    var book = this.books[i];
    var message = this.basketService.getBasket().removeItem(book);
    if(message.success){
      this.flashMessage.show(message.msg, {cssClass: 'alert-success', timeout: 3000});
      this.books = this.basketService.getBasket().getItems();
      this.totalCost = this.basketService.getBasket().getTotalPrice();
    } else {
      this.flashMessage.show(message.msg, {cssClass: 'alert-danger', timeout: 3000});
    }
  }

}
