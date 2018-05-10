import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'

import { Order } from '../../models/order.interface'

/**
 * Generated class for the CustViewOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cust-view-order',
  templateUrl: 'cust-view-order.html',
})
export class CustViewOrderPage {

	diner_id: any
	order_id: any
	orderDocRef: AngularFirestoreDocument<Order>
	orderedItemsRef: any
	customer_name: string
	items: any[] = []
	order_cost: any
	ordereditems_ids: any[] = []

	constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private firestore: AngularFirestore) {
		this.diner_id = this.navParams.get('dinerID')
		this.order_id = this.navParams.get('orderID')
  		this.orderDocRef = this.firestore.collection('diners').doc(this.diner_id).collection('orders').doc(this.order_id)
  		this.orderedItemsRef = this.orderDocRef.collection('OrderedItems')
  		this.getOrderDetails()
	}

	getOrderDetails() {
		let that = this
		this.orderDocRef.ref.get()
		.then(doc => {
			that.customer_name = doc.data().customer_name
			that.order_cost = doc.data().order_cost
		})
		this.orderedItemsRef.ref.get()
		.then(querySnapshot => {
			querySnapshot.forEach(function(doc) {
				that.items.push(doc.data())
				that.ordereditems_ids.push(doc.id)
			})
		})
	}

	deleteOrderedItem(item, i){
		let ordereditem_id = this.ordereditems_ids[i]
		if (this.items[i].lock == false){
			this.orderedItemsRef.doc(ordereditem_id).delete()
			.then(function() {
				console.log("Ordered items successfully deleted.")
			})
			.catch(function(error) {
				console.log("Some error occured.")
			})
		}else{
			console.log("The ordered item cannot be deleted because it is being processed now.")
		}
	}

	moreOptions() {
		let flag: boolean = false
		this.items.forEach(function(item) {
			if (item.lock == true){
				flag = true
			}
		})
		if (flag == false){
			let actionSheet = this.actionSheetCtrl.create({
				title: 'More options',
				buttons: [
					{
						cssClass: 'danger',
						icon: 'close',
						text: 'Cancel Order',
						handler: () => {
							this.orderDocRef.delete()
							.then(function() {
								console.log("Order successfully cancelled.")
							})
							.catch(function(error) {
								console.log("Some error occured.")
							})
						}
					}
				]
			});
			actionSheet.present();
		}else{
			console.log("You cannot cancel your order anymore.")
		}
	}

	ionViewDidLoad() {
    	console.log('ionViewDidLoad CustViewOrderPage');
	}
}
