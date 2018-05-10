import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, Events, Platform } from 'ionic-angular'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { Item } from '../../models/item.model'
import { Combo } from '../../models/combo.interface'
import { CustomerDetails } from '../../models/customerdetails.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'

import { BasketPage } from '../basket/basket'

/*
 *  This page will show the items inside the selected menu.
 *  This will be the last page in the process of adding a combo.
 *  The functions are similar with placing an order but instead,
 *  the combinations of the items are saved instead along with
 *  a name that is provided by the user. 
 */

@IonicPage()
@Component({
  selector: 'page-combo-add',
  templateUrl: 'combo-add.html',
})
export class ComboAddPage {

	@ViewChild('combo_name') combo_name

	totalItemCount: number = 0
	itemList: Item[]
	categoryList: Category[] = []
	orderedItemsList: any[] = []
	items: Observable<Item[]>
	diner: string
	diner_id: string
	itemCollectionRef: AngularFirestoreCollection<Item>
	dinerCollectionRef: AngularFirestoreCollection<DinerDetails>
	combosCollectionRef: AngularFirestoreCollection<Combo>
	customerDocRef: AngularFirestoreDocument<CustomerDetails>
	itemCount: number

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
				public alertCtrl: AlertController, 
				public events: Events,
				public modalCtrl: ModalController,
				public toastCtrl: ToastController,
				public platform: Platform,
	      		private fire: AngularFireAuth,
	     		private firestore: AngularFirestore) {
		this.diner_id = this.navParams.get('data')
		this.dinerCollectionRef = this.firestore.collection('diners')
		this.itemCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('items')
		this.customerDocRef = this.firestore.collection('customers').doc(this.fire.auth.currentUser.uid)
		this.combosCollectionRef = this.customerDocRef.collection('combos')
	}

	getCategoryList(){
		var categories: any[] = []
		for (var i = this.itemList.length - 1; i >= 0; i--) {
			if(!(categories.includes(this.itemList[i].item_type))){
				console.log(this.itemList[i].item_type)
				categories.push(this.itemList[i].item_type)
			}
		}

		return categories
	}

	createCategory(title, items){

		this.categoryList.push({
			title: title,
			items: items
		})

		console.log("Created category: " + title)
		console.log("has the following items: ")
		console.log(items)
	}

	confirmQR(){
		console.log("Open confirm modal.")
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
		  let categories: string[] = that.getCategories(items)
		  that.initializeCategories(categories, items)
		})
	}

	getCategories(items){
		let _categoryList: string[] = []

		for (var item of items) {
		  if (!(_categoryList.includes(item.item_type))) {
		    _categoryList.push(item.item_type)
		  }
		}
		return _categoryList
	}

	initializeCategories(categories, items) {
		var _items: any[] = []
		for (var category of categories) {
		  _items = this.getItemsUnderCategory(category, items)
		  this.categoryList.push({
		    title: category,
		    items: _items
		  })
		}
	}

	getItemsUnderCategory(category, items){
		let _items: any[] = []
		if (category && category.trim() != '') {
			items.filter((item) => {
				if(item.item_type.toLowerCase().indexOf(category.toLowerCase()) > -1){
				  _items.push(item)
				}
			})
		}
		return _items
	}

	viewItems(){
		let count: number = 0
		this.orderedItemsList =  this.gatherOrder()
		this.orderedItemsList.forEach(doc => {
			count = count + Number(doc.item_ordered)
		})
		this.itemCount = count
		let basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList })
		basket.present()
	}

	createCombo(){
		this.orderedItemsList = this.gatherOrder()
		
		let that = this
		let cost: number = 0
		let name = this.combo_name.value
		if (name == ""){
			name = "Combo"
		}
		this.orderedItemsList.forEach(doc => {
			cost += Number(doc.item_price * doc.item_ordered)
		})

		this.customerDocRef.ref.get()
		.then(doc => {
			let id = that.firestore.createId()
			that.combosCollectionRef.doc(id).set({
				combo_id: id,
				combo_name: name,
				diner_id: that.diner_id,
				combo_cost: cost,
				items: that.orderedItemsList
			})

			var comboAddToast = this.toastCtrl.create({
				message: "Your combo is added.",
				dismissOnPageChange: true,
				position: "top",
				duration: 3000
			})

			comboAddToast.present()
		})

	}

	itemPanned(e, item){
		if (e.additionalEvent == "panright"){
			item.item_count++
		} else if (e.additionalEvent == "panleft"){
			item.item_count--
		}
		if (item.item_count < 0) {
			item.item_count = 0
		}

		item.item_ordered = Math.floor(item.item_count/5)
		this.totalItemCount = this.totalItemCount + item.item_ordered
	}

	itemTapped(e, item){
		var width = this.platform.width()
		if (e.center.x >= width/2) {
			item.item_count += 5
		  	item.item_ordered++
		} else if (e.center.x < width/2 && item.item_ordered > 0) {
			item.item_count -= 5
		  	item.item_ordered--
		}

		if (item.item_ordered < 0) {
			item.item_ordered = 0
		} 

		// this.itemIsOrdered(e, item)
	}

	// itemIsOrdered(e, item){
	// 	var className = "item item-block item-md"
	// 	if (item.item_count > 0) {
	// 		e.target.offsetParent.className = className + " ordered"
	// 	} else {
	// 		e.target.offsetParent.className = className
	// 	}
	// }

	gatherOrder(){
		var _list: Item[] = []
		for (var category of this.categoryList) {
			for (var item of category.items) {
				if (item.item_ordered > 0) {
				  	_list.push(item)
				}
			}
		}
		console.log(_list)
		return _list
	}

	ionViewDidLoad() {
		this.getItems()
		console.log('ionViewDidLoad ComboPage')
	}

	filter(name, keyword){
		var _filter = new RegExp(keyword, 'gi');
		if (_filter.test(name)) {
			return true
		}
		return false
	}

	isEmpty(items, keyword){
		var _filter = new RegExp(keyword, 'gi');
		
		for (var item of items) {
			if (_filter.test(item.item_name)) {
				return false
			}
		}

		return true
	}
}

interface Category{
  title: string,
  items: any[]
}