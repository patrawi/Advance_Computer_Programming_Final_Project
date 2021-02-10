import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { Books } from '../../models/books'
import { HomeProvider } from '../../providers/home/home';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
    @ViewChild('barChart') barChart;
    bars : any;
    colorArray: any;
    info$ : Observable<Books>
    data : any
    num = 10
    constructor(public navCtrl: NavController,public homeprovider: HomeProvider) {

  }
  ionViewDidEnter() {
    this.info$ = this.homeprovider.getgraph()
    this.createBarChart();
    
  }
  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return this.colorArray;
  }
  createBarChart() {
    this.info$.subscribe(items => {
      console.log(items)
      let ctx = this.barChart.nativeElement;
      ctx.height = 400;
      let item = items['data']
      let name = item[0]
      let count = item[1]

      this.bars = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: [name['name10'],name['name9'],name['name8'],name['name7'],name['name6'],name['name5'],name['name4'],name['name3'],name['name2'],name['name1']],
          datasets: [{
            label: 'reviews count in 10k',
            data: [(count['review10']/10000),(count['review9']/10000),(count['review8']/10000),(count['review7']/10000),(count['review6']/10000),(count['review5']/10000),(count['review4']/10000),(count['review3']/10000),(count['review2']/10000),(count['review1']/10000)],
            backgroundColor:this.generateColorArray(this.num) ,
            borderColor: 'rgb(38,194,129)',
            borderWidth: 0.9,
   
            
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes:  [{
              gridLines: {
                offsetGridLines: true
              }
            }]
          }
        }
      })
    })

  }
}
