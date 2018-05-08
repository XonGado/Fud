import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Events, Platform } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item.model'
import { Combo } from '../../models/combo.interface'

import { BasketPage } from '../basket/basket'

/**
 * Generated class for the ComboEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-combo-edit',
  templateUrl: 'combo-edit.html',
})
export class ComboEditPage {

	@ViewChild('combo_name') combo_name;

	searchQuery: string = '';
	combo_data: Combo
	itemList: Item[];
	categoryList: Category[] = [];
	orderedItemsList: any[] = [];
	items: Observable<Item[]>;
	customer: string;
	combo_id: string;
	diner_id: string;
	itemsCollectionRef: AngularFirestoreCollection<Item>
	combosCollectionRef: AngularFirestoreCollection<Combo>
	comboItems: any[] = []

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
				public alertCtrl: AlertController, 
				public events: Events,
				public modalCtrl: ModalController,
				public platform: Platform,
				private fire: AngularFireAuth,
				private firestore: AngularFirestore) {

		this.combo_data = this.navParams.get('data')
		this.comboItems = this.combo_data.items
		this.diner_id = this.combo_data.diner_id
		this.itemsCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('items')
		this.customer = this.fire.auth.currentUser.uid
		this.combosCollectionRef = this.firestore.collection('customers').doc(this.customer).collection('combos')
	}

	ionViewDidLoad() {
		console.log(this.combo_data)
		this.getItems()
		console.log('ionViewDidLoad ComboAddPage');
	}

	deleteCombo() {
		let combo_id = this.combo_data.combo_id
		this.combosCollectionRef.doc(combo_id).delete()
		.then(function() {
			console.log("Combo deleted successfully!")
		})
		.catch(error => {
			console.error("Error deleting the combo. Please try again.")
		})
	}

	updateCombo(){
		// Saving to database
		this.orderedItemsList = this.gatherOrder()
		
		let that = this
		let cost: number = 0
		let name = this.combo_name.value
		if (name == ""){
			name = "Combo"
		}

		this.orderedItemsList.forEach(doc => {
			cost = cost + Number(doc.item_price)
		})

		let combo_id = this.combo_data.combo_id
		
		this.combosCollectionRef.doc(combo_id).update({
			combo_id: combo_id,
			combo_name: that.combo_name.value,
			diner_id: that.diner_id,
			combo_cost: cost,
			items: that.orderedItemsList
		})
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
	}

	confirmQR(){
		console.log("Open confirm modal.");
	}

	getItems() {
		let that = this
		let items: any[] = []
		this.itemsCollectionRef.ref.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				var _item = doc.data()
				_item.item_ordered = 0
				that.comboItems.forEach(item => {
					if (_item.item_name == item.item_name){
						_item.item_ordered = item.item_ordered
					}
				})
				
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
