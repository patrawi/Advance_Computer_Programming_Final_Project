import { Component, HostListener, Inject, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Books} from '../../models/books'
import { HomeProvider } from '../../providers/home/home';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',

})
export class AboutPage implements OnInit {
  bookName: string;
  ogbook: string;
  authorName: string;
  ogauthor: string;
  ogthumbnail: string;
  oggenre: string;
  public info$: Observable<Books>
  listData =[]
  ograting: string;
  ogprice = 0;
  ogreview  : string;
  value = false
  ogyear : string;
  new = false
  constructor(public homeprovider: HomeProvider ,public httpClient: HttpClient) {
    
  }
  

  showinfo() {
    this.listData= []
    console.log(this.bookName)
    this.ogbook = this.bookName;
    this.ogauthor = this.authorName;
    this.homeprovider.getInfo(this.ogbook,this.ogauthor,this.listData);
    if(this.listData != []) {
      this.value = true;
    }
  }
  addbook(name) {
    this.ogbook = name
    this.value = true;
    this.homeprovider.addinfo(this.ogbook).subscribe(data => {
      console.log(data)
      
    
  })
  }
  showform() {
    this.new = true
  }
  addbookuser(name,author,rating,review,price,thumbnail,genre,year) {
    this.ogbook = name
    this.ogauthor = author
    this.ograting = rating
    this.oggenre = genre
    this.ogthumbnail = thumbnail
    this.ogreview = review
    this.ogprice = price
    this.ogyear = year
    
    this.homeprovider.addnewbook(this.ogbook,this.ogauthor,this.ograting,this.oggenre,this.ogthumbnail,this.ogreview,this.ogprice,this.ogyear).subscribe(data=> {
      console.log(data)
    })
  }
  ngOnInit() {

  }
  }


      



