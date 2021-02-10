import { Pipe, PipeTransform } from '@angular/core';
import { Books } from '../../models/books'
/**
 * Generated class for the SearchfilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchfilter',
})
export class SearchfilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(Books: Books[], searchValue: string): Books[] {
    if (!Books || !searchValue) {
      return Books;
    }
    
    return Books.filter(book =>
      book['name'].toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      book['author'].toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
    
  }
}
