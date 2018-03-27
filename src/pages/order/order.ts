import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  itemList: Item[] = [
    { id:'0', name:'Choco Chip Waffle', image:'samplePP.jpg', description:'This is a description.', price:'60', type:'waffle'},
    { id:'1', name:'Caramel Waffle', image:'samplePP.jpg', description:'This is a description.', price:'60', type:'waffle'},
    { id:'2', name:'Blueberry Waffle', image:'samplePP.jpg', description:'This is a description.', price:'60', type:'waffle'},
    { id:'3', name:'Strawberry Waffle', image:'samplePP.jpg', description:'This is a description.', price:'60', type:'waffle'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

interface Item{
  id: string,
  image: string,
  name: string,
  description: string,
  price: string,
  type: string
}

