import { Component, OnInit } from '@angular/core';
import NumberFormat = Intl.NumberFormat;
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  title: String;
  author: String;
  category: String;
  price: Number;
  qty_in_stock: Number;
  image_title: String;
  image: File = null;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onAddBookSubmit() {
    const book = {
      title: this.title,
      author: this.author,
      category: this.category,
      price: this.price,
      qty_in_stock: this.qty_in_stock,
      image: this.image
    };

    var formData = new FormData();
    formData.append('title', this.title);
    formData.append('author', this.author);
    formData.append('category', this.category);
    formData.append('price', this.price);
    formData.append('qty_in_stock', this.qty_in_stock);
    formData.append('image', this.image, this.image.name);


    console.log(book.image);

    // Required Fields
    if (!this.validateService.validateObj(book)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Add Book
    this.authService.addBook(formData).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Book added successfully!', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/books']);
      } else {
        this.flashMessage.show('Error in creation of the book!', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/']);
      }
    });
  }

  onFileSelected(event) {
    try {
      this.image= event.target.files[0];
      var file = event.target.files[0];
      var blob = null;
      console.log(this.image);
    } catch (e) {
      console.log(e.message);
    }

    // var reader = new FileReader();
    // reader.onload = function(){
    //   var arrayBuffer = this.result;
    //   blob = arrayBuffer;
    // }
    // reader.readAsArrayBuffer(event.target.files[0]);
    // if(blob) {
    //   this.image = blob;
    //   console.log('Image value'+this.image);
    // }
  }

  onImageTitle(){
    if(this.image){
    }
  }

  getImageUrl(event){
    const i = 0;


      if (this.image) {
        // var file = new Blob([this.image], {
        //   type: 'image/jpeg'
        // });
        const file = new Blob([this.image]);
        console.log(file);
        var objurl = URL.createObjectURL(file);
        event.target.src = objurl;

      }

  }


}
