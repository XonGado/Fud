import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

@IonicPage()
@Component({
  selector: 'page-diner-order-history',
  templateUrl: 'diner-order-history.html',
})
export class DinerOrderHistoryPage {
	uid: string
  	ordersCollectionRef: AngularFirestoreCollection<Order>
  	ordersList: any[] = []
  	itemsList: any[] = []
  	itemCount: number
  	diner: AngularFirestoreDocument<DinerDetails>
  	orderFilter: string = "all"
  	order_ids: any[] = []

  	constructor(public navCtrl: NavController, 
        public navParams: NavParams,
        private fire: AngularFireAuth, 
        private firestore: AngularFirestore) {
    	this.uid = this.fire.auth.currentUser.uid
    	this.diner = this.firestore.collection('diners').doc(this.uid)
    	this.ordersCollectionRef = this.diner.collection('orders')
  	}

  	ionViewWillEnter() { 
		this.getOrders()
	}

  	getOrders() {
		let that = this
		this.ordersList = []
		this.order_ids = []

		this.ordersCollectionRef.ref.where("cleared", "==", true).get()
		.then(function(querySnapshot) {
		  querySnapshot.forEach(function(doc) {
		    that.ordersList.push(doc.data())
		    that.order_ids.push(doc.id)
		    console.log(doc.data().customer_name)
		    console.log(doc.id)
		  })
		  that.getItems()
		})
	}

	getItems() {
		let that = this
		let count: number = 0
		this.ordersList.forEach(doc => {
		  that.itemsList = doc.items
		})
		this.itemsList.forEach(doc => {
		  count = count + Number(doc.item_ordered)
		})
		this.itemCount = count
	}

	hasHistory(){
		return this.ordersList.length > 0
	}

	ionViewDidLoad() {
		this.getOrders()
		console.log('ionViewDidLoad DinerOrderHistoryPage');
	}

}
