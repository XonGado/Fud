import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ModalController } from 'ionic-angular';
import { BasketPage } from '../basket/basket';

// import * as item from '../assets/js/item';
// import * as order from '../assets/js/order';
// import * as orderController from '../assets/js/orderController';
// import * as orderModel from '../assets/js/orderModel';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  searchQuery: string = '';

  constructor(public navCtrl: NavController,
  			  public navParams: NavParams, 
  			  public alertCtrl: AlertController, 
  			  public events: Events,
  			  public modalCtrl: ModalController) {
  }


  ionViewDidLoad() {
	console.log('ionViewDidLoad OrderPage');
  }

  confirmQR(){
	console.log("Open confirm modal.");
  }

  addItemToOrder(){
	console.log("Added item to order.");
  }

  subtractItemFromOrder(){
	console.log("Subtract item from order.");
  }
}
