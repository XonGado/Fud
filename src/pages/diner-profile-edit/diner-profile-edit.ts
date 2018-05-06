import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { DinerLocatePage } from '../diner-locate/diner-locate'

import { DinerDetails } from '../../models/dinerdetails.interface'

import { Geolocation } from '@ionic-native/geolocation'

/**
 * Generated class for the DinerProfileEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google

@IonicPage()
@Component({
  selector: 'page-diner-profile-edit',
  templateUrl: 'diner-profile-edit.html',
})
export class DinerProfileEditPage {
	
	@ViewChild('map') mapElement: ElementRef
	map: any

	@ViewChild('dine_name') dine_name;
	@ViewChild('dine_username') dine_username;
	@ViewChild('dine_owner_name') dine_owner_name;
	@ViewChild('dine_email') dine_email;
	@ViewChild('dine_weblink') dine_weblink;
	@ViewChild('dine_number') dine_number;
	@ViewChild('dine_address') dine_address;
	@ViewChild('dine_password') dine_password;
	@ViewChild('dine_new_password') dine_new_password;
	@ViewChild('dine_retypePassword') dine_retypePassword;

	name: string; 
	owner_name: string; 
	username: string; 
	email: string; 
	weblink: string; 
	number: string; 
	address: string;
	dinerDocRef: AngularFirestoreDocument<DinerDetails>
	uid:string

	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				public modalCtrl: ModalController,
  				private fire: AngularFireAuth,
  				private firestore: AngularFirestore,
  				public geolocation: Geolocation) {
  		this.uid = fire.auth.currentUser.uid
  		this.dinerDocRef = this.firestore.collection('diners').doc(this.uid)
		this.loadMap()
	}

	ionViewDidLoad() {
		this.fetchData()
  		console.log('ionViewDidLoad DinerProfileEditPage');
	}

	fetchData() {
		let that = this
		this.dinerDocRef.ref.get()
		.then(doc => {
			console.log(doc.data())
			that.address = doc.data().dine_address
			that.email = doc.data().dine_email
			that.name = doc.data().dine_name
			that.number = doc.data().dine_number
			that.owner_name = doc.data().dine_owner_name
			that.username = doc.data().dine_username
			that.weblink = doc.data().dine_weblink
		})
	}

	mapSettingsModal(){
		let locateModal = this.modalCtrl.create(DinerLocatePage);
		locateModal.present();
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

			console.log("map is set")

		}, (err) => {
			console.log(err)
	    })
	 
	}

}
