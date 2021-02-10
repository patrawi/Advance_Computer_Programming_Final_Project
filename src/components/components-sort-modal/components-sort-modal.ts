import { Component } from '@angular/core';

/**
 * Generated class for the ComponentsSortModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'components-sort-modal',
  templateUrl: 'components-sort-modal.html'
})
export class ComponentsSortModalComponent {

  text: string;

  constructor() {
    console.log('Hello ComponentsSortModalComponent Component');
    this.text = 'Hello World';
  }

}
