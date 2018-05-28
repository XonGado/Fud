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

	orderDocRef: AngularFirestoreDocument<Order>
	orderedItemsRef: any
	customer_name: string
	items: any[] = []
	cost: number = 0
	ordereditems_ids: any[] = []

	constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private firestore: AngularFirestore) {
  		this.orderDocRef = this.firestore.collection('diners').doc(this.navParams.get('dinerID')).collection('orders').doc(this.navParams.get('orderID'))
  		this.orderedItemsRef = this.orderDocRef.collection('orderedItems')
  		this.getOrderDetails()
	}

	getOrderDetails() {
		let that = this
		this.orderDocRef.ref.get().then( order => { that.cost = order.data().cost })
		this.orderedItemsRef.ref.get()
		.then( items => {
			items.forEach( item => {
				console.log(item.data())
				let details = {id: "", name: "", price: 0, ordered: 0 }

				details.id = item.id
				details.name = item.data().item_name
				details.price = item.data().item_price
				details.ordered = item.data().item_ordered

				console.log(details)
				that.items.push(details)
				that.ordereditems_ids.push(item.id)
			})
		})
	}

	deleteOrderedItem(item){
		let price: number = 0
		let that = this

		this.orderedItemsRef.doc(item.id).ref.get().then( item => {
			if (item.data().lock == false){
				this.orderedItemsRef.doc(item.id).delete()
				.then( _=> {
					console.log("Ordered items successfully deleted.")
				})
				.catch( error => {
					console.log("Some error occured.")
				})
				this.orderedItemsRef.ref.get()
				.then( items => {
					items.forEach( item => { price += (Number(item.data().item_price) * Number(item.data().item_ordered)) })
					that.cost = price
					that.orderDocRef.update({ cost: that.cost })
				})
			}else{
				console.log("The ordered item cannot be deleted because it is being processed now.")
			}
		})
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
