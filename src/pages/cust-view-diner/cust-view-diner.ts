import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'

import { DinerDetails } from '../../models/dinerdetails.interface'

import { Geolocation } from '@ionic-native/geolocation'

declare var google

@IonicPage()
@Component({
  selector: 'page-cust-view-diner',
  templateUrl: 'cust-view-diner.html',
})
export class CustViewDinerPage {

	@ViewChild('map') mapElement: ElementRef
	map: any

	dinerRef: AngularFirestoreDocument<DinerDetails>

	// Diner's credentials
	name: any
	email: any
	address: any
	number: any
	location: any
	isFavorite: boolean = false

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private fire: AngularFireAuth, private firestore: AngularFirestore) {
		let that = this
		this.dinerRef = this.firestore.collection('diners').doc(this.navParams.get('dinerID'))
		this.dinerRef.ref.get().then( doc => {
			console.log(doc.data())
			that.name = doc.data().dine_name
			that.email= doc.data().dine_email
			that.address = doc.data().dine_address
			that.number = doc.data().dine_number
			that.location = doc.data().dine_location
		}).then( _=> {
			that.loadMap(that.location)
		})
		this.checkFavorite()
	}

	ionViewDidLoad() {
		console.log("You are now viewing " + this.name + ".")
	}

	loadMap(location){
	    var latLng = new google.maps.LatLng(location.latitude, location.longitude);
	 
	    let mapOptions = {
	      center: latLng,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    }

	    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

	    let marker = new google.maps.Marker({
	        map: this.map,
	        animation: google.maps.Animation.DROP,
	        position: latLng
	    })

	    marker.setMap(this.map)
	}

	checkFavorite(){
		let that = this
		let exists = false
		this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid).collection("favorites").doc(this.navParams.get("dinerID")).ref.get().then( doc=> {
			exists = doc.exists
		}).then( _=> {
			console.log(exists)
			that.isFavorite = exists 
		})
	}

	favorite(){
		let that = this
		let dinerID = this.navParams.get("dinerID")
		let exists = null
		let loading = this.loadingCtrl.create({ content: `<ion-spinner name="cresent"></ion-spinner>` })
		let favorite = this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid).collection("favorites").doc(dinerID)

		loading.present().then( _=> {
			favorite.ref.get().then(doc => {
				exists = doc.exists
				if (!exists) {
					let userID = that.fire.auth.currentUser.uid
					let notificationID = that.firestore.createId()

					favorite.set({
						id: dinerID,
						timestamp: new Date()
					}).catch(error => {
						that.alertCtrl.create({
							title: "Error",
							message: error.message,
							buttons: [{ text: "Got it" }]
						}).present()
					})

					that.dinerRef.collection("fans").doc(userID).set({
						id: userID,
						timestamp: new Date()
					}).catch(error => {
						that.alertCtrl.create({
							title: "Error",
							message: error.message,
							buttons: [{ text: "Got it" }]
						}).present()
					})

					that.dinerRef.collection("notifications").doc(notificationID).set({
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

					that.checkFavorite()

					that.alertCtrl.create({
						title: "Favorite",
						message: "You will now be updated about " + that.name + ".",
						buttons: [{
							text: "Great!"
						}]
					}).present().then( _=> {
						loading.dismiss()
					})
				} else {
					that.alertCtrl.create({
						title: "Oops",
						message: that.name + " is already one of your favorites.",
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

	unfavorite(){
		let that = this
		let loading = this.loadingCtrl.create({
			content: `<ion-spinner name="cresent"></ion-spinner>`
		})

		loading.present().then( _=> {
			that.dinerRef.collection("fans").doc(that.fire.auth.currentUser.uid).delete()
			that.firestore.collection("customers").doc(that.fire.auth.currentUser.uid).collection("favorites").doc(that.navParams.get("dinerID")).delete()
			.then( _=> {
				that.alertCtrl.create({
					title: "Unfavorite",
					message: that.name + " is no longer one of your favorites",
					buttons: [{
						text: "Okay"
					}]
				}).present().then( _=> {
					that.checkFavorite()	
					loading.dismiss()
				})
			})
			.catch( error=> {
				that.alertCtrl.create({
					title: "Oops",
					message: "Something went wrong on unfavoriting " + that.name,
					buttons: [
						{
							text: "Try again",
							handler: _=>{
								that.unfavorite()
							}
						},
						{
							text: "Cancel"
						}
					]
				}).present()
			})
		})

	}

}
