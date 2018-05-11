import { Component, ViewChild } from '@angular/core';
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
  orderedItemsColRef: any
  customer_name: string
  items: any[] = []
  order_cost: any
  ordereditems_id: any[] = []
  lock: boolean

  constructor(public navCtrl: NavController, public navParams: NavParams, private fire: AngularFireAuth, private firestore: AngularFirestore) {
  	this.order_id = this.navParams.get('data')
  	this.orderDocRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('orders').doc(this.order_id)
    this.orderedItemsColRef = this.orderDocRef.collection('OrderedItems')
  	this.getOrderDetails()
  }

  getOrderDetails() {
  	let that = this
  	this.orderDocRef.ref.get()
  	.then(doc => {
  		that.customer_name = doc.data().customer_name
  		that.order_cost = doc.data().order_cost
      that.lock = doc.data().lock
    })
    this.orderedItemsColRef.ref.get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        that.items.push(doc.data())
        that.ordereditems_id.push(doc.id)
      })
      for (var i = 0; i < that.items.length; i++) {
        that.items[i].lock = false
      }
  	})
  }

  clearOrder() {
  	this.orderDocRef.ref.update({
  		cleared: true
  	})
  	this.navCtrl.pop()
  }

  ionViewDidLoad() {
  	console.log('ionViewDidLoad OrderDetailsPage');
  }

  changeLock(item, index){
    let ordereditemsid = this.ordereditems_id[index]
    this.orderedItemsColRef.doc(ordereditemsid).ref.update({
      lock: item.lock
    })
  }

  locksEnabled(){
    for(var item of this.items){
      if (item.lock == false) {
        return false
      }
    }
    return true
  }
}