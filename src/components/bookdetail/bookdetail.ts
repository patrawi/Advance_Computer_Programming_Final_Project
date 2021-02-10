import { Component } from '@angular/core';

/**
 * Generated class for the BookdetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bookdetail',
  templateUrl: 'bookdetail.html'
})
export class BookdetailComponent {

  text: string;

  constructor() {
    console.log('Hello BookdetailComponent Component');
    this.text = 'Hello World';
  }

}
