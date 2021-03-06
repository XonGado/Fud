import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ActionSheetController, LoadingController, Events, Platform, ToastController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item.model'
import { Order } from '../../models/order.interface'
import { Combo } from '../../models/combo.interface'
import { CustomerDetails } from '../../models/customerdetails.interface'

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
	ordersCollectionRef: AngularFirestoreCollection<Order>
	combosCollectionRef: AngularFirestoreCollection<Combo>
	customerDocRef: AngularFirestoreDocument<CustomerDetails>
	orderedItemsColRef: any
	orderNumber: number
	orderType: any
	comboItems: any[] = []
	diner_ids: any[] = []
	dinerID: string
	orderID: string
	ordered: boolean
	uid: string
	dinerList: any[] = []
	customerCount: any[] = []

	loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: `<ion-spinner name="cresent"></ion-spinner>`
    });

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
				public alertCtrl: AlertController, 
				public events: Events,
				public modalCtrl: ModalController,
				public actionSheetCtrl: ActionSheetController,
				public platform: Platform,
				public loadingCtrl: LoadingController,
				private fire: AngularFireAuth,
				private firestore: AngularFirestore,
				public toastCtrl: ToastController) {
		this.uid = fire.auth.currentUser.uid
		this.combo_data = this.navParams.get('data')
		this.combo_id = this.combo_data.combo_id
		this.comboItems = this.combo_data.items
		this.diner_id = this.combo_data.diner_id
		this.itemsCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('items')
		this.ordersCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('orders')
		this.orderedItemsColRef = this.ordersCollectionRef.doc(this.combo_id).collection('OrderedItems')
		this.customer = this.fire.auth.currentUser.uid
		this.customerDocRef = this.firestore.collection('customers').doc(this.customer)
		this.combosCollectionRef = this.firestore.collection('customers').doc(this.customer).collection('combos')
		this.dinerList = this.retrieveDiners()
	}

	ionViewDidLoad() {
		console.log(this.combo_data)
		this.getItems()
		console.log('ionViewDidLoad ComboEditPage');
	}

	userHasOrdered(){
		let that = this
		let order: any[] = []

		for (var i = 0; i < this.diner_ids.length; i++) {
			let id = this.diner_ids[i]

			this.firestore.collection('diners').doc(id).collection('orders').ref.where("customer_id", "==", that.uid).where("cleared", "==", false).get()
			.then( querySnapshot => {
				querySnapshot.forEach( doc => {
					order.push(doc.data())
					that.dinerID = id
					that.orderID = doc.id
				})
			}).then( _ => {
				that.ordered = order.length >= 1
			})
		}
	}

	retrieveDiners(){
		let _diners: any[] = []
		let that = this
		this.firestore.collection('diners').ref.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				_diners.push(doc.data())
				that.diner_ids.push(doc.id)
			})
		})
		.then( function() {
			that.userHasOrdered()
		})
		return _diners
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
		let loading = this.loadingCtrl.create({content: `<ion-spinner name="cresent"></ion-spinner>`})
		loading.present()

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
		.then(_=>{
			let alert = this.alertCtrl.create({
				title: "Combo Changed!",
				message: "Let's try this combination you made.",
				buttons: [{
					text: "Alright!",	
					handler: _=>{ this.navCtrl.pop() }
				}]
			})

			loading.dismiss()
			alert.present()
		})
		.catch(error=>{
			loading.dismiss()
			that.errorAlert(error)
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

	askOrderType(){
			if (this.ordered == undefined) {
			this.userHasOrdered()
			
			var orderedMsg = this.toastCtrl.create({
				message: "Give us a second.",
				dismissOnPageChange: true,
				position: "bottom",
				duration: 3000
			})

			orderedMsg.present()
		} else if (!this.ordered) {
			let alert = this.alertCtrl.create();
			let address: string = ''

			alert.setTitle("Select an option")

		    alert.addInput({
		    	type: 'radio',
		    	label: "I'll dine in",
		    	value: "0",
		    	checked: true
		    });

		    alert.addInput({
		    	type: 'radio',
		    	label: "I'll take it out",
		    	value: "1",
		    	checked: false
		    });

		    alert.addInput({
		    	type: 'radio',
		    	label: "Deliver it to me",
		    	value: "2",
		    	checked: false
		    });

		    alert.addButton('Cancel');
		    alert.addButton({
		    	text: "Confirm",
		    	handler: data => {
		    		this.orderType = data;
		    		console.log(this.orderType)
		    		this.placeOrder(this.orderType)
		    		// if (this.orderType == 2) {
		    			// Get location. Tasked to Clyde.
		    		// }
		    	}
		    });
		    alert.present();
			this.loading.dismiss()
		} else {
			var orderedMsg = this.toastCtrl.create({
				message: "You can't order again! You still have ongoing orders.",
				dismissOnPageChange: true,
				position: "bottom",
				duration: 3000
			})

			orderedMsg.present()
		}
	}

	placeOrder(orderType){
		// // Saving to database
		this.orderedItemsList = this.gatherOrder()

		let customer_name: string
		let customer_id: string
		let id = this.firestore.createId()
		let that = this
		let price: number = 0
		let count: number = 0

		this.orderedItemsList.forEach(doc => {
			price = price + Number(doc.item_price * doc.item_ordered)
			count = count + Number(doc.item_ordered)
		})

		this.ordersCollectionRef.ref.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				that.orderNumber +=1
			})
		})

		this.customerDocRef.ref.get()
		.then(doc => {
			customer_name = doc.data().cust_name
			customer_id = doc.id
			that.ordersCollectionRef.doc(id).set({
				customer_id: customer_id,
				customer_name: customer_name,
				order_cost: price,
				cleared: false,
				order_type: that.orderType,
				totalItems: count,
				orderNumber: that.orderNumber
			})
			.then(function(){
				let alert = that.alertCtrl.create({
					title: "Order Placed!",
					subTitle: "We'll be preparing your food.",
					buttons: [{
						text: "Okay!",
						handler: () =>{
							that.navCtrl.pop()
						}
					}]
				});
				that.loading.dismiss()
				alert.present()
			})
		})
		.then(doc => {
			let that = this
			that.orderedItemsList.forEach(doc => {
				let ordereditem_id = that.firestore.createId()
				that.ordersCollectionRef.doc(id).collection('OrderedItems').doc(ordereditem_id).set({
					item_id: doc.item_id,
					item_name: doc.item_name,
					item_description: doc.item_description,
					item_price: doc.item_price,
					item_type: doc.item_type,
					item_count: doc.item_count,
					item_ordered: doc.item_ordered,
					item_availability: doc.item_availability,
					item_visibility: doc.item_visibility,
					lock: false
				})
			})
		})
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

	presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'More options',
			buttons: [
				{
					cssClass: 'danger',
					icon: 'close',
					text: 'Delete',
					handler: () => {
						this.deleteCombo()
						this.navCtrl.pop()
					}
				}
			]
		});

		actionSheet.present();
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

	errorAlert(error){
		console.log(error.message)

		let errorAlert = this.alertCtrl.create({
			title: "ERROR",
			message: error.message,
			buttons: [
				{
					text: "Oops",
					handler: _=>{
						console.log("Error alert closed.")
					}
				}
			]
		})

		errorAlert.present()
	}
}


interface Category{
  title: string,
  items: any[]
}
