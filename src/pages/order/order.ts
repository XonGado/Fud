import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ModalController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { DinerDetails } from '../../models/dinerdetails.interface'
import { Item } from '../../models/item.model'

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
	itemsCollectionRef: AngularFirestoreCollection<Item>
	diner: string;
	diner_id: string;
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

	// initalizeCategories(){
	// 	var list = this.getCategoryList();

	// 	console.log("Got category list");

	// 	for (var i = list.length - 1; i >= 0; i--) {
	// 		this.createCategory(list[i], this.getItemsUnderCategory(list[i]));
	// 	}
	// }

	// getItems(ev: any) {
	// 	this.initializeItems();

	// 	let val = ev.target.value;

	// 	if (val && val.trim() != '') {
	// 		this.itemList = this.itemList.filter((item) => {
	// 			return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
	// 		})
	// 	}
	// }

	getCategoryList(){
		var categories: any[] = [];

		for (var i = this.itemList.length - 1; i >= 0; i--) {
			if(!(categories.includes(this.itemList[i].type))){
				console.log(this.itemList[i].type)
				categories.push(this.itemList[i].type)
			}
		}

		return categories;
	}

	// getItemsUnderCategory(category){
	// 	// this.initializeItems();

	// 	var content: any[] = [];

	// 	if (category && category.trim() != '') {
	// 		this.itemList = this.itemList.filter((item) => {
	// 		if(item.type.toLowerCase().indexOf(category.toLowerCase()) > -1){
	// 		  	content.push(item);
	// 		}
	// 		})
	// 	}

	// 	return content;
	// }

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

	addItemToOrder(){
		console.log("Added item to order.");
	}

	subtractItemFromOrder(){
		console.log("Subtract item from order.");
	}

	placeOrder(){

	}

	viewItems(){
		// Create a modal and pass values.
		this.gatherOrder();
		console.log("Create modal to view items.");
		console.log("Customer ordered the following.");
		console.log(this.orderedItemsList);


		let basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
		basket.present();
	}

	itemPanned(e, item){
		console.log(e);
		console.log(item.name + ": " + item.count);

		if (e.additionalEvent == "panright"){
			item.count++;
			console.log("Counting for add");
			console.log("Adding " + item.name + "to items.");
		} else if (e.additionalEvent == "panleft"){
			item.count--;
			console.log("Counting for remove");
			console.log("Removing " + item.name + "to items.");
		}

		if (item.count < 0) {
			item.count = 0;
		}

		item.ordered = Math.floor(item.count/5);
	}

	itemTapped(e, item){
		console.log(e.center);

		if (e.center.x >= 150) {
		  	item.ordered++;
		} else if (e.center.x < 150 && item.ordered > 0) {
		  	item.ordered--;
		}
	}

	gatherOrder(){
		for (var category of this.categoryList) {
			console.log(category.items);

			for (var item of category.items) {
				if (item.ordered > 0) {
				  	this.orderedItemsList.push(item);
				}
			}
		}
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

