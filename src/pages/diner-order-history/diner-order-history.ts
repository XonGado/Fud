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

  	ordersCollectionRef: AngularFirestoreCollection<Order>
	ordersCollectionRef$: Observable<Order[]>
  	diner: AngularFirestoreDocument<DinerDetails>
  	orderFilter: string = "all"
  	ordersList: any[] = []
  	itemsList: any[] = []
  	order_ids: any[] = []
  	itemCount: number
	uid: string

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

		this.ordersCollectionRef = this.diner.collection('orders')
		this.ordersCollectionRef$ = this.ordersCollectionRef.valueChanges()
		this.ordersCollectionRef$.subscribe( collection => {
			this.ordersCollectionRef.ref.orderBy("orderNumber", "asc").get()
			.then( orders=> {
				let list = []

				orders.forEach( order=> {
					let details = { id: "", customer: "", cost: 0, cleared: true, type: 0, totalItems: 0, orderNumber: 0 }

					details.id = order.id
					details.type = order.data().type
					details.cost = order.data().cost
					details.cleared = order.data().cleared
					details.totalItems = order.data().totalItems
					details.orderNumber = order.data().orderNumber
					that.firestore.collection("customers").doc(order.data().customer).ref.get().then( doc => { details.customer = doc.data().cust_name}).then( _=> {
						list.push(details)
					})
				})

				that.ordersList = list
			})
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
