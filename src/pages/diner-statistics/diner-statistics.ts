import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, MenuController, ToastController } from 'ionic-angular'

import { Order } from '../../models/order.interface'
import { Customer } from '../../models/customer.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'
import { Notification } from '../../models/notification.interface'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

/**
 * Generated class for the DinerStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diner-statistics',
  templateUrl: 'diner-statistics.html',
})
export class DinerStatisticsPage {

	data: string = "total"
	items: any[] = []
	total: any
	types: object = {
		dine: 0,
		take: 0,
		deli: 0
	}

	constructor(public navCtrl: NavController, 
  		public navParams: NavParams,
  		private fire: AngularFireAuth,
  		private firestore: AngularFirestore) {
		this.getItems()
	}

	getItems(){
		let that = this
		this.firestore.collection("diners").doc(this.fire.auth.currentUser.uid).collection("orders").ref.where("cleared", "==", true).get()
		.then( orders => {
			orders.forEach( order => {
				let details = {id: "", name: "", cost: 0, type: 0, totalItems: 0, orderNumber: 0}

				details.id = order.data().customer
				details.cost = order.data().cost
				details.type = order.data().type
				details.totalItems = order.data().totalItems
				this.firestore.collection("customers").doc(details.id).ref.get().then( customer => { details.name = customer.data().cust_name })

				that.items.push(details)
			})
		}).then( _=> {
			that.getTotal()
			that.getTypes()
		})
	}

	getTotal(){
		this.total = 0
		for (var i = this.items.length - 1; i >= 0; i--) {
			this.total += this.items[i].cost
		}
	}

	getTypes(){
		let dine = 0
		let take = 0
		let deli = 0

		for (var i = this.items.length - 1; i >= 0; i--) {
			if (this.items[i].type == 0){
				dine++
			} else if (this.items[i].type == 1){
				take++
			} else {
				deli++
			}
		}

		this.types = {dine: dine, take: take, deli: deli}
	}

	ionViewDidLoad() {
    	console.log('ionViewDidLoad DinerStatisticsPage');
	}

}
