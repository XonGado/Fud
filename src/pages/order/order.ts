import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ModalController } from 'ionic-angular';
import { BasketPage } from '../basket/basket';

import { Item } from '../../models/item.model'

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs/Observable'

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
  diner: string;
  searchQuery: string = '';
  diner_id: string;
  itemList: Item[]
  categoryList: Category[] = [];
  itemCollectionRef: AngularFirestoreCollection<Item>

  constructor(public navCtrl: NavController,
  			  public navParams: NavParams, 
  			  public alertCtrl: AlertController, 
  			  public events: Events,
  			  public modalCtrl: ModalController,
          private fire: AngularFireAuth,
          private firestore: AngularFirestore) {
    this.diner_id = this.navParams.get('data')
    this.itemCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('items')
  }

  getItems() {
    let that = this
    let items: any[] = []
    this.itemCollectionRef.ref.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        items.push(doc.data())
      })
      console.log(items)
      let categories: string[] = that.getCategories(items);
      console.log(categories)
      that.initializeCategories(categories, items);
    })
  }

  getCategories(items){
    let _categoryList: string[] = [];

    for (var item of items) {
      if (!(_categoryList.includes(item.item_type))) {
        _categoryList.push(item.item_type);
      }
    }
    return _categoryList
  }

  initializeCategories(categories, items) {
    var _items: any[] = [];
    for (var category of categories) {
      _items = this.getItemsUnderCategory(category, items);
      this.categoryList.push({
        title: category,
        items: _items
      });
    }
  }

  getItemsUnderCategory(category, items){
    let _items: any[] = [];
      if (category && category.trim() != '') {
      items.filter((item) => {
        if(item.item_type.toLowerCase().indexOf(category.toLowerCase()) > -1){
          _items.push(item);
        }
      })
      }
      return _items;
  }

  ionViewDidLoad() {
    this.getItems()
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

interface Category{
  title: string,
  items: any[]
}
