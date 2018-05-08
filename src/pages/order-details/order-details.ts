import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

import { Order } from '../../models/order.interface'

/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  order_id: any
  orderDocRef: AngularFirestoreDocument<Order>
  customer_name: string
  items: any[] = []
  order_cost: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private fire: AngularFireAuth, private firestore: AngularFirestore) {
  	this.order_id = this.navParams.get('data')
  	this.orderDocRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('orders').doc(this.order_id)
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

  clearOrder() {
  	this.orderDocRef.ref.update({
  		cleared: true
  	})
  	this.navCtrl.pop()
  }

  ionViewDidLoad() {
  	// this.getOrderDet	ails()
  	console.log('ionViewDidLoad OrderDetailsPage');
  }

}
 