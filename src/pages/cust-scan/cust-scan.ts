import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

import { OrderPage } from '../order/order'

@IonicPage()
@Component({
  selector: 'page-cust-scan',
  templateUrl: 'cust-scan.html',
})
export class CustScanPage {

	qrData = null
	createdCode = null
	scannedCode = null
	orderedItemsList:any = []


	orderType: any

	id: any = ""
	diner_id: any
	order: any

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		private barcodeScanner: BarcodeScanner,
		private fire: AngularFireAuth,
		private firestore: AngularFirestore) {

		this.order = navParams.get('order')
		this.diner_id = navParams.get('dinerID')
		this.orderType = navParams.get('orderType')
		this.scannedCode = this.scanCode()
	}

	scanCode(){
		let that = this
		this.barcodeScanner.scan().then(barcodedData =>{
			this.scannedCode = barcodedData.text
			this.doAction(this.scannedCode)
		})
	}

	doAction(code){
		var splitCode = code.split(";")

		if (splitCode[1] == 0) {
			this.favorite(splitCode[0])
		} else if (splitCode[1] == 1){
			this.placeOrder(splitCode[0], splitCode[2], this.orderType)
		} 
	}

	favorite(id){
		let name = ""
		let that = this
		let exists = null
		let loading = this.loadingCtrl.create({ content: `<ion-spinner name="cresent"></ion-spinner>` })
		let favorite = this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid).collection("favorites").doc(id)
		let dinerRef = this.firestore.collection("diners").doc(id)
		dinerRef.ref.get().then( diner => { name = diner.data().dine_name })

		loading.present().then( _=> {
			favorite.ref.get().then(doc => {
				exists = doc.exists
				if (!exists) {
					let userID = that.fire.auth.currentUser.uid
					let notificationID = that.firestore.createId()

					favorite.set({
						id: id,
						timestamp: new Date()
					}).catch(error => {
						that.alertCtrl.create({
							title: "Error",
							message: error.message,
							buttons: [{ text: "Got it" }]
						}).present()
					})

					dinerRef.collection("fans").doc(userID).set({
						id: userID,
						timestamp: new Date()
					}).catch(error => {
						that.alertCtrl.create({
							title: "Error",
							message: error.message,
							buttons: [{ text: "Got it" }]
						}).present()
					})

					dinerRef.collection("notifications").doc(notificationID).set({
						id: notificationID,
						from: userID,
						type: 2,
						new: true,
						seen: false,
						cleared: false,
						timestamp: new Date()
					}).catch(error => {
						that.alertCtrl.create({
							title: "Error",
							message: error.message,
							buttons: [{ text: "Got it" }]
						}).present()
					})

					that.alertCtrl.create({
						title: "Favorite",
						message: "You will now be updated about " + name + ".",
						buttons: [{
							text: "Great!"
						}]
					}).present().then( _=> {
						loading.dismiss()
					})
				} else {
					that.alertCtrl.create({
						title: "Oops",
						message: name + " is already one of your favorites.",
						buttons: [{
							text: "Okay"
						}]
					}).present().then( _=> {
						loading.dismiss()
					})
				}
			})
		})
	}

	placeOrder(id, tableName, orderType){
		let orderNumber = 0
		let customer = this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid)
		let diner = this.firestore.collection("diners").doc(id)
		let ordersCollectionRef = diner.collection("orders")
		let loading = this.loadingCtrl.create({ content: `<ion-spinner name="cresent"></ion-spinner>` })
		loading.present()

		let customer_name: string
		let customer_id: string
		let orderId = this.firestore.createId()
		let that = this
		let price: number = 0
		let count: number = 0

		this.order.forEach(doc => {
			price = price + Number(doc.item_price * doc.item_ordered)
			count = count + Number(doc.item_ordered)
		})

		ordersCollectionRef.ref.get()
		.then( orders => {
			orderNumber = orders.size + 1
		})

		customer.ref.get()
		.then(doc => {
			customer_id = doc.id
			ordersCollectionRef.doc(orderId).set({
				cost: price,
				cleared: false,
				totalItems: count,
				type: orderType,
				timestamp: new Date(),
				customer: customer_id,
				orderNumber: orderNumber,
			})
			.then(function(){
				let alert = that.alertCtrl.create({
					title: "Order Placed!",
					subTitle: "We'll be preparing your food.",
					buttons: [{
						text: "Okay!",
						handler: () =>{
							that.navCtrl.pop()
						}
					}]
				});
				loading.dismiss()
				alert.present()
			})
		})
		.then(doc => {
			let that = this
			that.order.forEach(doc => {
				let ordereditem_id = that.firestore.createId()
				ordersCollectionRef.doc(orderId).collection('orderedItems').doc(ordereditem_id).set({
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
			diner.collection("notifications").doc(notificationID).set({
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
		console.log('ionViewDidLoad DinerScanPage');
		this.scanCode()
	}

}
