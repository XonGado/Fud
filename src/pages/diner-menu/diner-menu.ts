import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { ItemEditPage } from "../item-edit/item-edit";
import { ItemAddPage } from "../item-add/item-add";

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item.model'

/**
 * Generated class for the DinerMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diner-menu',
  templateUrl: 'diner-menu.html',
})
export class DinerMenuPage {
	uid: string;
	searchQuery: string = '';
  	categoryList: Category[] = [];
  	itemList: Item[];
  	items: Observable<Item[]>;
  	itemsCollectionRef: AngularFirestoreCollection<Item>
  	loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: `<ion-spinner name="cresent"></ion-spinner>`
    });

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public loadingCtrl: LoadingController,
				public alertCtrl: AlertController, 
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore) {

	    this.loading.present();
		this.uid = fire.auth.currentUser.uid
		this.itemsCollectionRef = this.firestore.collection('diners').doc(this.uid).collection('items')
		this.items = this.itemsCollectionRef.valueChanges()
		// this.itemList = this.listOfItems()
		this.retrieveMenu();
	}

	ionViewDidLoad() {
		// this.listOfItems();
		console.log('ionViewDidLoad DinerMenuPage');
	}

	retrieveMenu(){
		let items: any[] = [];
		let that = this
		this.itemsCollectionRef.ref.get()
		.then(function(querySnapshot){

			querySnapshot.forEach(function(doc){
				items.push(doc.data());
			})

			let categories: string[] = that.getAllCategories(items);

			that.printRetrievedMenu(items, categories);
			that.initializeCategories(categories, items);
		})
	}

	getAllCategories(items){
		let _categoryList: string[] = [];

		for (var item of items) {
			if (!(_categoryList.includes(item.item_type))) {
				_categoryList.push(item.item_type);
			}
		}

		return _categoryList
	}

	// Check later
	listOfItems() {
		let list: any[] = [];
		this.itemsCollectionRef.ref.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				// list.push(doc.data())
				console.log("Doc ", doc.data())
			})
			// list = querySnapshot.docs
		})
		.catch(function (error){
			console.log("Error", error.code)
		})
		// return list;
	}

	initializeCategories(categories, items) {
		var _items: any[] = [];
		for (var category of categories) {
			_items = this.getItemsUnderCategory(category, items);

			this.categoryList.push({
				title: category,
				items: _items
			});

			this.printCreatedCategory(category, items);
		}

		this.loading.dismiss();
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

	addItem(){
		this.navCtrl.push(ItemAddPage);
	}

	editItem(item_id){
		console.log(item_id)
		this.navCtrl.push(ItemEditPage, {
			data: item_id
		});
	}

	deleteItem(item_id){
		console.log("Id: " + item_id);
		let confirm = this.alertCtrl.create({
	      title: 'Farewell delicious food',
	      message: 'Do you want to remove from the menu?',
	      buttons: [
	        {
	          text: 'Remove',
	          handler: () => {
	            console.log('Disagree clicked');
	            this.itemsCollectionRef.doc(item_id).delete();
	          }
	        },
	        {
	          text: 'No!',
	          handler: () => {
	            console.log('Agree clicked');
	          }
	        }
	      ]
	    });
	    confirm.present();
	}

	closePage(){
		this.navCtrl.pop();
	}

	printRetrievedMenu(items, categories){
		console.log("Menu was retrieved!");

		console.log("Item list:")
		for (var item of items) {
			console.log(item.item_type);
		}

		console.log("Categories:")
		for (var category of categories) {
			console.log(category);
		}
	}

	printCreatedCategory(category, items){
		console.log("Created " + category + " category");
		console.log(category + " has the following items:");
		for (var item of items) {
			console.log(item.name);
		}
	}
}

interface Category{
	title: string,
	items: any[]
}