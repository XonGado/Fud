import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

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
	customer_name: string
	items: any[] = []
	order_cost: any

	constructor(public navCtrl: NavController, public navParams: NavParams, private fire: AngularFireAuth, private firestore: AngularFirestore) {
		this.diner_id = this.navParams.get('dinerID')
		this.order_id = this.navParams.get('orderID')

		console.log(this.diner_id)
		console.log(this.order_id)

  		this.orderDocRef = this.firestore.collection('diners').doc(this.diner_id).collection('orders').doc(this.order_id)
  		this.getOrderDetails()
	}

	getOrderDetails() {
		let that = this
		this.orderDocRef.ref.get()
		.then(doc => {
			that.customer_name = doc.data().customer_name
			that.items = doc.data().items
			that.order_cost = doc.data().order_cost
		})
	}

	ionViewDidLoad() {
    	console.log('ionViewDidLoad CustViewOrderPage');
	}

}
