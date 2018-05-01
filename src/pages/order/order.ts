import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ModalController, Platform } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


import { DinerDetails } from '../../models/dinerdetails.interface'
import { CustomerDetails } from '../../models/customerdetails.interface'
import { Item } from '../../models/item.model'
import { Order } from '../../models/order.interface'

import { BasketPage } from '../basket/basket';

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
	itemList: Item[];
	categoryList: Category[] = [];
	orderedItemsList: any[] = [];
	items: Observable<Item[]>;
	diner: string;
	diner_id: string;
	itemCollectionRef: AngularFirestoreCollection<Item>
	ordersCollectionRef: AngularFirestoreCollection<Order>
	dinerCollectionRef: AngularFirestoreCollection<DinerDetails>
	customerDocRef: AngularFirestoreDocument<CustomerDetails>

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
				public alertCtrl: AlertController, 
				public events: Events,
				public modalCtrl: ModalController,
				public platform: Platform,
	      		private fire: AngularFireAuth,
	     		private firestore: AngularFirestore) {
		this.diner_id = this.navParams.get('data')
		this.dinerCollectionRef = this.firestore.collection('diners')
		this.itemCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('items')
		this.ordersCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('orders')
		this.customerDocRef = this.firestore.collection('customers').doc(this.fire.auth.currentUser.uid)
	}

	getCategoryList(){
		var categories: any[] = [];

		for (var i = this.itemList.length - 1; i >= 0; i--) {
			if(!(categories.includes(this.itemList[i].item_type))){
				console.log(this.itemList[i].item_type)
				categories.push(this.itemList[i].item_type)
			}
		}

		return categories;
	}

	createCategory(title, items){

		this.categoryList.push({
			title: title,
			items: items
		});

		console.log("Created category: " + title);
		console.log("has the following items: ");
		console.log(items);
	}

	confirmQR(){
		console.log("Open confirm modal.");
	}

	getItems() {
		let that = this
		let items: any[] = []
		this.itemCollectionRef.ref.get()
		.then(function(querySnapshot) {
		  querySnapshot.forEach(function(doc) {
			var _item = doc.data()

			_item.item_ordered = 0
			_item.item_count = 0

		    items.push(_item)
		  })
		  let categories: string[] = that.getCategories(items);
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

	viewItems(){
		this.orderedItemsList =  this.gatherOrder();
		let basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
		basket.present();
	}

	placeOrder(){
		// Saving to database
		let customer_name: string
		let customer_id: string
		let that = this
		let price: number = 0

		this.orderedItemsList =  this.gatherOrder();
		this.orderedItemsList.forEach(doc => {
			price = price + Number(doc.item_price)
		})

		console.log(price)

		this.customerDocRef.ref.get()
		.then(doc => {
			customer_name = doc.data().cust_name
			customer_id = doc.id
			console.log(customer_id)
			let id = that.firestore.createId()
			that.ordersCollectionRef.doc(id).set({
				customer_id: customer_id,
				customer_name: customer_name,
				order_cost: price,
				items: that.orderedItemsList
			})
		})
	}

	itemPanned(e, item){
		if (e.additionalEvent == "panright"){
			item.item_count++;
		} else if (e.additionalEvent == "panleft"){
			item.item_count--;
		}
		if (item.item_count < 0) {
			item.item_count = 0;
		}

		this.itemIsOrdered(e, item)
		item.item_ordered = Math.floor(item.item_count/5);
	}

	itemTapped(e, item){
		var width = this.platform.width();
		if (e.center.x >= width/2) {
			item.item_count += 5;
		  	item.item_ordered++;
		} else if (e.center.x < width/2 && item.item_ordered > 0) {
			item.item_count -= 5;
		  	item.item_ordered--;
		}

		if (item.item_ordered < 0) {
			item.item_ordered = 0;
		} 

		this.itemIsOrdered(e, item)
	}

	itemIsOrdered(e, item){
		var className = "item item-block item-md"

		if (item.item_count > 0) {
			e.target.offsetParent.className = className + " ordered"
		} else {
			e.target.offsetParent.className = className
		}
	}

	gatherOrder(){
		var _list: Item[] = []
		for (var category of this.categoryList) {
			for (var item of category.items) {
				if (item.item_ordered > 0) {
				  	_list.push(item);
				}
			}
		}
		return _list
	}

	clearItem(){

	}

	ionViewDidLoad() {
		this.getItems()
		console.log('ionViewDidLoad OrderPage');
	}

}

interface Category{
  title: string,
  items: any[]
}

