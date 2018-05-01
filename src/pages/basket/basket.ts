import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BasketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html',
})
export class BasketPage {

	itemList: Item[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.itemList = navParams.get('orderedItems');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasketPage');
  }
}

interface Item{
  id: string,
  count: number,
  ordered: number,
  image: string,
  name: string,
  description: string,
  price: string,
}