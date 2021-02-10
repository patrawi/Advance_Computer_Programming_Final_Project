import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Books } from '../../models/books'

/*
  Generated class for the HomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomeProvider  {
  private base_url = 'http://d2e898ed191d.ngrok.io/'
  constructor(public http: HttpClient) {
    console.log('Hello HomeProvider Provider');
  }
  shownewbook(name,listData) {
    this.http.get(this.base_url + '/shownewbook?name=' + name).subscribe(data => {
      listData.push(data['data'][0])
      console.log(listData)
      
    })
  }
  getData(itemsList,id,event) {
    console.log("Get The Data");
    this.http.get(this.base_url +'showdata?num='+id).subscribe(data => {
      for (let i = 0;i < data['data'].length;i++) {
        itemsList.push(data['data'][i]);
        if(id != 0) {
          event.complete();
        }
        else if (id === 1000) {
          console.log("THE END");
        }
      }   
    });
  }
  getgraph() {
    console.log('Yike')
    return this.http.get<Books>(this.base_url + 'graph')
  }
  getInfo(name,author,list) {

    console.log('Get Data')

    this.http.get(this.base_url +'findbook?name='+name+'&'+author).subscribe(data=> {
      for (let i = 0;i < data['data'].length;i++) {
        list.push(data['data'][i]);
        
      }
      
    })
    
  }
  addinfo(book) {
    const header = {'content-type' : 'application/json'}
    console.log(book)
    return this.http.post(this.base_url +'addnewbook?name='+book, {'headers': header})
  }
  addnewbook(name,author,rating,genre,thumbnail,review,price,year) {
    return this.http.get(this.base_url + 'addbookbyuser?' + 'name=' + name +'&'+ 'author=' + author+'&'+ 'rating='+rating +'&'+ 'genre=' + genre +'&'+ 'thumbnail=' + thumbnail+'&'+'year='+year +'&'+ 'review=' + review +'&'+'price=' + price)
  }
  }



  //https://bci.kinokuniya.com/jsp/images/book-img/97819/97819747/9781974700561.JPG

  //https://images-na.ssl-images-amazon.com/images/I/51vDU2OX0wL._SX379_BO1,204,203,200_.jpg