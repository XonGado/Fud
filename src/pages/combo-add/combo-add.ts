import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Events, Platform } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item.model'

import { BasketPage } from '../basket/basket'

/**
 * This page will show the items inside the selected menu.
 * This will be the last page in the process of adding a combo.
 * The functions are similar with placing an order but instead,
 * the combinations of the items are saved instead along with
 * a name that is provided by the user. 
 */

@IonicPage()
@Component({
  selector: 'page-combo-add',
  templateUrl: 'combo-add.html',
})
export class ComboAddPage {

	searchQuery: string = '';
	itemList: Item[];
	categoryList: Category[] = [];
	orderedItemsList: any[] = [];
	items: Observable<Item[]>;
	diner: string;
	diner_id: string;
	itemCollectionRef: AngularFirestoreCollection<Item>

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
				public alertCtrl: AlertController, 
				public events: Events,
				public modalCtrl: ModalController,
				public platform: Platform,
				// private fire: AngularFireAuth,
				private firestore: AngularFirestore) {
		this.diner_id = this.navParams.get('data')
		this.itemCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('items')
	}

	ionViewDidLoad() {
		this.getItems()
		console.log('ionViewDidLoad ComboAddPage');
	}

	createCombo(){
		// Saving to database
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
		console.log("Create modal to view items.");
		console.log("Customer ordered the following.");
		console.log(this.orderedItemsList);


		let basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
		basket.present();
	}

	itemPanned(e, item){
		console.log(e);
		console.log(item.item_name + ": " + item.item_count);

		if (e.additionalEvent == "panright"){
			item.item_count++;
			console.log("Counting for add");
			console.log("Adding " + item.item_name + " to items.");
		} else if (e.additionalEvent == "panleft"){
			item.item_count--;
			console.log("Counting for remove");
			console.log("Removing " + item.item_name + " to items.");
		}

		if (item.item_count < 0) {
			item.item_count = 0;
		}

		this.itemIsOrdered(e, item)

		item.item_ordered = Math.floor(item.item_count/5);
	}

	itemTapped(e, item){
		console.log(e.center);
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
		// Function under renovation.

		// var className = "item item-block item-md"

		// if (item.item_count > 0) {
		// 	e.target.offsetParent.className = className + " ordered"
		// } else {
		// 	e.target.offsetParent.className = className
		// }
	}

	gatherOrder(){
		var _list: Item[] = []

		for (var category of this.categoryList) {
			console.log(category.items);

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
}

interface Category{
  title: string,
  items: any[]
}