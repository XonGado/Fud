import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
  	categoryList: Category[];
  	itemList: Item[];
  	items: Observable<Item[]>;
  	itemsCollectionRef: AngularFirestoreCollection<Item>

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fire: AngularFireAuth, private firestore: AngularFirestore) {
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

			console.log("Menu was retrieved!");

			console.log("Item list:")
			for (var item in items) {
				console.log(item.item_type);
			}

			console.log("Categories:")
			for (var category in categories) {
				console.log(category);
			}
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

	initializeCategories() {

	}

	getItemsUnderCategory(category){
		let content: any[] = [];
	    if (category && category.trim() != '') {
			this.itemList.filter((item) => {
				if(item.item_type.toLowerCase().indexOf(category.toLowerCase()) > -1){
					content.push(item);
				}
			})
	    }return content;
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
}

interface Category{
	title: string,
	items: any[]
}