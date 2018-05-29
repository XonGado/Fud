import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'
import { DinerViewOrderPage } from '../diner-view-order/diner-view-order'

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
  		let that = this
    	this.uid = this.fire.auth.currentUser.uid
    	this.diner = this.firestore.collection('diners').doc(this.uid)
    	this.ordersCollectionRef = this.diner.collection('orders')
	    this.ordersCollectionRef$ = this.ordersCollectionRef.valueChanges()
	    this.ordersCollectionRef$.subscribe( collection => {
	      this.ordersCollectionRef.ref.where("cleared", "==", true).get()
	      .then( orders=> {
	        let list = []

	        orders.forEach( order=> {

				let details = { id: "", customer: "", cost: 0, cleared: true, type: 0, totalItems: 0, orderNumber: 0 , timestamp: {}}

				details.id = order.id
				details.type = order.data().type
				details.cost = order.data().cost
				details.cleared = order.data().cleared
				details.totalItems = order.data().totalItems
				details.orderNumber = order.data().orderNumber
				details.timestamp = that.dateParser(order.data().timestamp)
				that.firestore.collection("customers").doc(order.data().customer).ref.get().then( doc => { 
					details.customer = doc.data().cust_name
				}).then( _=> {
					console.log(details)
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

	orderDetails(id){
		this.navCtrl.push(DinerViewOrderPage, { orderID: id })
	}

	dateParser(timestamp){
		console.log(timestamp.toString())
		var elements = timestamp.toString().split(" ")
		let time = elements[4].split(":")
		let day: any = []

		time.pop()

		if (time[0] > 12){
		    time[0] -= 12
		    time = time.join(":")
		    time += " PM"
		} else if (time[0] == 0){
		    time[0] = 12
		    time = time.join(":")
		    time += " AM"
		} else {
		    time = time.join(":")
		    time += " AM"
		}

		day.push(elements[2])
		day.push(elements[1])
		day = day.join(" ")

		// Mon May 28 2018 
		console.log(elements)

		return {day: day, time: time}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerOrderHistoryPage');
	}

}
