import { Component, OnInit } from '@angular/core';
import { HomeProvider} from '../../providers/home/home';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import {Books} from '../../models/books'
import {AboutPage} from '../../pages/about/about'
import { ModalController } from 'ionic-angular';
import { ComponentsSortModalComponent } from '../../components/components-sort-modal/components-sort-modal';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchValue: string;
  itemsListData = [];
  pageNumber = 0;
  value = false;
  ogbook : string;
  bookname: string;
  public data$ : Observable<Books>
  list = []
  constructor(public homeprovider: HomeProvider,public http : HttpClient,public about: AboutPage,private modalController: ModalController) {
    

  }
  
  ionViewDidLoad() {
    this.homeprovider.getData(this.itemsListData,0," ");
    console.log('You are here')
    

    
  } 
  doInfinite(event) {
    this.pageNumber++;
    this.homeprovider.getData(this.itemsListData,this.pageNumber*20,event);
  }
  getbook() {
    this.list = []
    console.log('Providing Data')
    this.ogbook = this.bookname;
    this.homeprovider.shownewbook(this.ogbook,this.list)
    if(this.list != []) {
      this.value = true
    }
  }
    
}
