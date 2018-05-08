import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'

import { Geolocation } from '@ionic-native/geolocation'

import { DinerDetails } from '../../models/dinerdetails.interface'

/**
 * Generated class for the DinerLocatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google


@IonicPage()
@Component({
  selector: 'page-diner-locate',
  templateUrl: 'diner-locate.html',
})
export class DinerLocatePage {

	@ViewChild('map') mapElement: ElementRef
	map: any
	uid: string

	marker: any

	dinerDocRef: AngularFirestoreDocument<DinerDetails>

	constructor(public navCtrl: NavController, 
		public navParams: NavParams, 
		public geolocation: Geolocation, 
		public alertCtrl: AlertController,
		private fire: AngularFireAuth,
		private firestore: AngularFirestore) {
		this.uid = this.fire.auth.currentUser.uid
	    this.dinerDocRef = this.firestore.collection('diners').doc(this.uid)
		this.loadMap()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerLocatePage');
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

	checkMarkerLocation(){
		console.log("latitude: " + this.marker.position.lat + ", longitude: " +  this.marker.position.lng)
	}

	confirmMapSetting(){
		let confirm = this.alertCtrl.create({
			title: "Set Location",
			message: 'Your location will be changed',
			buttons: [
			    {
			    	text: 'No',
			    	handler: () => {
			    		confirm.dismiss()
			    	}
			    },
			    {
			    	text: 'Set',
			    	handler: () => {
			        	this.setLocation()
			    	}
			    }
			]
		})

		confirm.present()
	}

	setLocation(){
		this.dinerDocRef.update({
			dine_location: {
				latitude: this.marker.getPosition().lat(), 
				longitude: this.marker.getPosition().lng()
			}
		})
	}

}
