import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore'

import { Geolocation } from '@ionic-native/geolocation'

import { DinerDetails } from '../../models/dinerdetails.interface'
import { Customer } from '../../models/customer.interface'
import { Order } from '../../models/order.interface'
import { Item } from '../../models/item.model'

declare var google

@IonicPage()
@Component({
  selector: 'page-cust-locate',
  templateUrl: 'cust-locate.html',
})
export class CustLocatePage {

	@ViewChild('map') mapElement: ElementRef
	map: any
	uid: string
	marker: any
	order: any
	location: any
	diner_id: any
	diner: AngularFirestoreDocument<any>
	customerDocRef: AngularFirestoreDocument<Customer>
	orderedItemsColRef: AngularFirestoreCollection<Item>
	ordersCollectionRef: AngularFirestoreCollection<Order>
	dinerCollectionRef: AngularFirestoreCollection<DinerDetails>

	loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: `<ion-spinner name="cresent"></ion-spinner>`
    })

	constructor(public navCtrl: NavController, 
		public navParams: NavParams, 
		public geolocation: Geolocation, 
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		private fire: AngularFireAuth,
		private firestore: AngularFirestore) {
		this.order = this.navParams.get('order')
		this.diner_id = this.navParams.get('dinerID')
		console.log(this.order)
		console.log(this.diner_id)
		this.uid = this.fire.auth.currentUser.uid
	    this.dinerCollectionRef = this.firestore.collection('diners')
	    this.customerDocRef = this.firestore.collection('customers').doc(this.uid)
	    this.diner = this.dinerCollectionRef.doc(this.diner_id)
	    this.ordersCollectionRef = this.diner.collection('orders')
		this.loadMap()
	}

	loadMap(){
	    this.geolocation.getCurrentPosition().then((position) => {
 
			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

			let mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

			this.marker = new google.maps.Marker({
				draggable: true,
			  	map: this.map,
			  	animation: google.maps.Animation.DROP,
			  	position: latLng
			})

			this.marker.setMap(this.map)

			console.log("map is set")

		}, (err) => {
			console.log(err)
	    })
	}

	confirmLocation(){
		let confirm = this.alertCtrl.create({
			title: "Delivery",
			message: 'We will deliver your food here.',
			buttons: [{
			    	text: 'No',
			    	handler: () => { confirm.dismiss() }
			    },
			    {
			    	text: 'Yes!',
			    	handler: () => { 
			    		this.location = {
							latitude: this.marker.getPosition().lat(), 
							longitude: this.marker.getPosition().lng()
						}
			    		this.placeOrder() 
			    	}
			    }
			]
		})

		confirm.present()
	}

	placeOrder(){
		// Saving to database
		let loading = this.loadingCtrl.create({
			content: "<ion-spinner name='cresent'></ion-spinner>",
			dismissOnPageChange: true
		})
		loading.present()
		let customer_name: string
		let customer_id: string
		let id = this.firestore.createId()
		let that = this
		let price: number = 0
		let count: number = 0
		let orderNumber: number = 0

		this.order.forEach(doc => {
			price = price + Number(doc.item_price * doc.item_ordered)
			count = count + Number(doc.item_ordered)
		})

		this.ordersCollectionRef.ref.get()
		.then(orders => { orderNumber == orders.size })

		this.customerDocRef.ref.get()
		.then(doc => {
			customer_id = doc.id
			that.ordersCollectionRef.doc(id).set({
				cost: price,
				cleared: false,
				totalItems: count,
				type: 2,
				timestamp: new Date(),
				customer: customer_id,
				orderNumber: orderNumber,
				location: that.location
			})
			.then(function(){
				let alert = that.alertCtrl.create({
					title: "Order Placed!",
					subTitle: "We'll be delivering your food.",
					buttons: [{
						text: "Okay!",
						handler: () =>{
							that.navCtrl.popToRoot()
						}
					}]
				});
				that.loading.dismiss()
				alert.present()
			})
		})
		.then(doc => {
			let that = this
			that.order.forEach(doc => {
				let ordereditem_id = that.firestore.createId()
				that.ordersCollectionRef.doc(id).collection('orderedItems').doc(ordereditem_id).set({
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

			let notificationID = that.firestore.createId()
			that.diner.collection("notifications").doc(notificationID).set({
				id: notificationID,
				from: that.fire.auth.currentUser.uid,
				type: 1,
				new: true,
				seen: false,
				cleared: false,
				timestamp: new Date()
			})
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustLocatePage');
	}

}
