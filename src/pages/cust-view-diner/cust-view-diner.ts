import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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

	name: any
	email: any
	address: any
	number: any
	location: any

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fire: AngularFireAuth, private firestore: AngularFirestore) {
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
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustViewCafePage');
	}

	loadMap(location){

	    console.log("Loading map...")
	    console.log(location.latitude + " " + location.longitude)

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

	    console.log("Map loaded.")
	   
	}

	favorite(){
		let that = this
		let dinerID = this.navParams.get("dinerID")
		let userID = this.fire.auth.currentUser.uid
		let user = this.firestore.collection("customers").doc(userID)
		var _favorites = []
		var exists = false

		user.ref.get().then( doc => {
			let retrievedFaves = doc.data().favorites 
			console.log(retrievedFaves)

			if (retrievedFaves != undefined) {
				_favorites = retrievedFaves
			}
		}).then( _ => {
			console.log(!_favorites.includes(dinerID))

			if (!_favorites.includes(dinerID)) {
				console.log("Diner id is added in your favorites.")
				_favorites.push(dinerID)
			} else {
				exists = true
			}
		}).then( _ =>{
			this.firestore.collection("customers").doc(userID).update({
				favorites: _favorites
			}).then( _ =>{
				let alert = that.alertCtrl.create({
					title: "Favorite",
					message: "You will now be updated about " + that.name + ".",
					buttons: [{
						text: "Great!",
						handler: _=>{
							console.log("Should update button.")
						}
					}]
				})

				let favoriteAlert = that.alertCtrl.create({
					title: "Oops",
					message: that.name + " is already one of your favorites.",
					buttons: [{
						text: "Okay",
						handler: _=>{
							console.log("Should update button.")
						}
					}]
				})

				if (exists) {
					favoriteAlert.present()
				} else {
					alert.present()
				}
			})
			.catch( error => {
				console.log(error.message)
			})
		})
	}

}
